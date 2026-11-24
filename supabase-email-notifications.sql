-- ============================================================
-- Notifications e-mail (Brevo) pour chaque nouvelle commande ou réservation
-- ============================================================
-- À exécuter dans Supabase > SQL Editor (ré-exécutable sans risque).
--
-- Prérequis (une seule fois, dans un AUTRE onglet du SQL Editor,
-- avec vos vraies valeurs — ne pas les enregistrer dans ce fichier) :
--
--   select vault.create_secret('VOTRE_CLE_API_BREVO', 'brevo_api_key');
--   select vault.create_secret('adresse-qui-recoit@example.com', 'notify_email_to');
--   select vault.create_secret('adresse-expediteur-verifiee-brevo@example.com', 'notify_email_from');
--
-- Sans ces secrets, le déclencheur ne fait rien (les commandes et réservations
-- sont enregistrées normalement). Un échec d'envoi n'empêche jamais l'enregistrement.
--
-- Vérifier les derniers envois :
--   select id, status_code, content, created from net._http_response order by created desc limit 5;
-- ============================================================

create extension if not exists pg_net;

-- Échappe le texte saisi par les clients avant de l'insérer dans l'e-mail HTML.
create or replace function public.mg_html(t text)
returns text
language sql
immutable
as $$
  select replace(replace(replace(replace(coalesce(t, ''), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;')
$$;

-- Ligne « libellé : valeur » du tableau de détails.
create or replace function public.mg_email_row(label text, value_html text)
returns text
language sql
immutable
as $$
  select '<tr>'
    || '<td style="padding:11px 0;border-bottom:1px solid #F0E6CC;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8A6840;width:120px;vertical-align:top;">' || label || '</td>'
    || '<td style="padding:11px 0;border-bottom:1px solid #F0E6CC;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1C1005;vertical-align:top;">' || value_html || '</td>'
    || '</tr>'
$$;

-- Bouton (lien stylé, compatible avec les clients e-mail).
create or replace function public.mg_email_button(href text, label text, bg text, fg text)
returns text
language sql
immutable
as $$
  select '<a href="' || href || '" style="display:inline-block;background:' || bg || ';color:' || fg
    || ';font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;'
    || 'padding:13px 22px;border-radius:8px;margin:0 8px 10px 0;">' || label || '</a>'
$$;

-- Gabarit complet : en-tête avec logo, pastille, titre, contenu, boutons, pied de page.
create or replace function public.mg_email_layout(badge text, heading text, content text, actions text)
returns text
language sql
immutable
as $$
  select '<!doctype html><html lang="fr"><head><meta charset="utf-8">'
    || '<meta name="viewport" content="width=device-width,initial-scale=1"><title>' || heading || '</title></head>'
    || '<body style="margin:0;padding:0;background:#F7F0DC;">'
    || '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F0DC;">'
    || '<tr><td align="center" style="padding:28px 12px;">'
    || '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
    || 'style="max-width:600px;background:#FFFDF7;border:1px solid #E8D9B5;border-radius:16px;overflow:hidden;">'
    -- En-tête
    || '<tr><td align="center" style="background:#2E1505;padding:30px 24px 24px;">'
    || '<img src="https://www.mondegourmand.com/images/logo-email.png" width="88" height="88" alt="Monde Gourmand" '
    || 'style="display:block;border:0;margin:0 auto 14px;width:88px;height:88px;">'
    || '<div style="font-family:Georgia,''Times New Roman'',serif;font-size:21px;font-weight:bold;letter-spacing:6px;color:#D4AF6A;">MONDE GOURMAND</div>'
    || '<div style="font-family:Georgia,''Times New Roman'',serif;font-size:13px;font-style:italic;color:#E9DCBF;margin-top:6px;">Café &amp; Cake · Kénitra</div>'
    || '</td></tr>'
    -- Filet doré
    || '<tr><td style="height:4px;line-height:4px;font-size:0;background:#BF9B4E;">&nbsp;</td></tr>'
    -- Pastille + titre
    || '<tr><td style="padding:30px 30px 6px;">'
    || '<span style="display:inline-block;background:#F3E7C9;color:#8C6B3C;font-family:Arial,Helvetica,sans-serif;'
    || 'font-size:11px;font-weight:bold;letter-spacing:2px;padding:7px 14px;border-radius:20px;">' || badge || '</span>'
    || '<h1 style="margin:16px 0 0;font-family:Georgia,''Times New Roman'',serif;font-size:24px;font-weight:normal;color:#1C1005;">' || heading || '</h1>'
    || '</td></tr>'
    -- Contenu
    || '<tr><td style="padding:10px 30px 6px;">' || content || '</td></tr>'
    -- Boutons
    || '<tr><td style="padding:18px 30px 30px;">' || actions || '</td></tr>'
    -- Pied de page
    || '<tr><td align="center" style="background:#F3E7C9;padding:16px 24px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8A6840;">'
    || 'Notification automatique du site '
    || '<a href="https://www.mondegourmand.com" style="color:#8C6B3C;font-weight:bold;text-decoration:none;">mondegourmand.com</a>'
    || '</td></tr>'
    || '</table></td></tr></table></body></html>'
$$;

create or replace function public.mg_notify_new_entry()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  api_key    text;
  mail_to    text;
  mail_from  text;
  subject    text;
  html       text;
  content    text;
  actions    text;
  items_html text;
  mode_label text;
  wa_phone   text;
  admin_url  constant text := 'https://www.mondegourmand.com/admin';
begin
  select decrypted_secret into api_key   from vault.decrypted_secrets where name = 'brevo_api_key'     limit 1;
  select decrypted_secret into mail_to   from vault.decrypted_secrets where name = 'notify_email_to'   limit 1;
  select decrypted_secret into mail_from from vault.decrypted_secrets where name = 'notify_email_from' limit 1;

  if api_key is null or mail_to is null then
    return new;
  end if;
  mail_from := coalesce(mail_from, mail_to);

  -- Numéro WhatsApp du client : chiffres uniquement, 06… → 2126…
  wa_phone := regexp_replace(coalesce(new.phone, ''), '\D', '', 'g');
  if wa_phone like '0%' then
    wa_phone := '212' || substr(wa_phone, 2);
  end if;

  actions := mg_email_button(admin_url, 'Ouvrir l''espace admin', '#BF9B4E', '#1C1005')
          || mg_email_button('tel:' || mg_html(new.phone), 'Appeler le client', '#2E1505', '#F7F0DC')
          || case when wa_phone <> ''
                  then mg_email_button('https://wa.me/' || wa_phone, 'WhatsApp client', '#1F8F4E', '#FFFFFF')
                  else '' end;

  if tg_table_name = 'orders' then
    mode_label := case new.order_type
      when 'livraison'  then 'Livraison'
      when 'a_emporter' then 'À emporter'
      when 'sur_place'  then 'Sur place'
      else new.order_type
    end;

    select string_agg(
             '<tr>'
             || '<td style="padding:12px 0;border-bottom:1px solid #F0E6CC;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1C1005;">'
             || '<span style="color:#BF9B4E;font-weight:bold;">' || mg_html(i->>'qty') || ' ×</span>&nbsp; ' || mg_html(i->>'name') || '</td>'
             || '<td align="right" style="padding:12px 0;border-bottom:1px solid #F0E6CC;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1C1005;white-space:nowrap;">'
             || mg_html(i->>'subtotal') || ' Dh</td>'
             || '</tr>',
             '')
      into items_html
      from jsonb_array_elements(new.items) as i;

    content := '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:6px;">'
      || coalesce(items_html, '')
      || '<tr><td style="padding:16px 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#1C1005;">Total</td>'
      || '<td align="right" style="padding:16px 0 4px;font-family:Georgia,''Times New Roman'',serif;font-size:24px;font-weight:bold;color:#BF9B4E;white-space:nowrap;">'
      || trim_scale(new.total) || ' Dh</td></tr>'
      || '</table>'
      || '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;">'
      || mg_email_row('Mode', '<strong>' || mode_label || '</strong>')
      || case when new.order_type = 'livraison'
              then mg_email_row('Adresse', mg_html(new.address))
              else mg_email_row('Date', coalesce(to_char(new.scheduled_date, 'DD/MM/YYYY'), '?')
                                        || ' à ' || coalesce(to_char(new.scheduled_time, 'HH24:MI'), '?'))
         end
      || mg_email_row('Client', mg_html(new.customer_first_name) || ' ' || mg_html(new.customer_last_name))
      || mg_email_row('Téléphone', '<a href="tel:' || mg_html(new.phone) || '" style="color:#8C6B3C;font-weight:bold;text-decoration:none;">' || mg_html(new.phone) || '</a>')
      || '</table>';

    subject := 'Nouvelle commande : ' || new.customer_first_name || ' ' || new.customer_last_name
               || ' (' || trim_scale(new.total) || ' Dh, ' || mode_label || ')';
    html := mg_email_layout('NOUVELLE COMMANDE',
                            'Commande de ' || mg_html(new.customer_first_name) || ' ' || mg_html(new.customer_last_name),
                            content, actions);

  elsif tg_table_name = 'event_reservations' then
    content := '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:6px;">'
      || mg_email_row('Événement', '<strong>' || mg_html(new.event_type) || '</strong>')
      || mg_email_row('Date', to_char(new.event_date, 'DD/MM/YYYY') || ' à ' || to_char(new.event_time, 'HH24:MI'))
      || mg_email_row('Personnes', new.guests::text)
      || case when coalesce(new.table_note, '') <> '' then mg_email_row('Tables', mg_html(new.table_note)) else '' end
      || mg_email_row('Client', mg_html(new.customer_name))
      || mg_email_row('Téléphone', '<a href="tel:' || mg_html(new.phone) || '" style="color:#8C6B3C;font-weight:bold;text-decoration:none;">' || mg_html(new.phone) || '</a>')
      || '</table>';

    subject := 'Nouvelle réservation : ' || new.event_type || ' le ' || to_char(new.event_date, 'DD/MM/YYYY')
               || ' (' || new.guests || ' pers.)';
    html := mg_email_layout('NOUVELLE RÉSERVATION',
                            mg_html(new.event_type) || ' · ' || new.guests || ' personnes',
                            content, actions);
  else
    return new;
  end if;

  perform net.http_post(
    url     := 'https://api.brevo.com/v3/smtp/email',
    headers := jsonb_build_object(
                 'api-key', api_key,
                 'content-type', 'application/json',
                 'accept', 'application/json'),
    body    := jsonb_build_object(
                 'sender', jsonb_build_object('name', 'Site Monde Gourmand', 'email', mail_from),
                 'to', jsonb_build_array(jsonb_build_object('email', mail_to)),
                 'subject', subject,
                 'htmlContent', html)
  );

  return new;
exception when others then
  -- Ne jamais bloquer une commande ou une réservation à cause de l'e-mail.
  raise warning 'mg_notify_new_entry: %', sqlerrm;
  return new;
end;
$$;

-- La fonction ne sert qu'aux déclencheurs : personne ne doit pouvoir l'appeler directement.
revoke all on function public.mg_notify_new_entry() from public, anon, authenticated;

drop trigger if exists mg_notify_new_order on public.orders;
create trigger mg_notify_new_order
  after insert on public.orders
  for each row execute function public.mg_notify_new_entry();

drop trigger if exists mg_notify_new_reservation on public.event_reservations;
create trigger mg_notify_new_reservation
  after insert on public.event_reservations
  for each row execute function public.mg_notify_new_entry();

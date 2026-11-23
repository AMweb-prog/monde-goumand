-- ============================================================
-- Notifications e-mail (Brevo) pour chaque nouvelle commande ou réservation
-- ============================================================
-- À exécuter une fois dans Supabase > SQL Editor.
--
-- Prérequis (à faire une seule fois, dans un AUTRE onglet du SQL Editor,
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
  items_html text;
  mode_label text;
  admin_url  constant text := 'https://www.mondegourmand.com/admin';
begin
  select decrypted_secret into api_key   from vault.decrypted_secrets where name = 'brevo_api_key'     limit 1;
  select decrypted_secret into mail_to   from vault.decrypted_secrets where name = 'notify_email_to'   limit 1;
  select decrypted_secret into mail_from from vault.decrypted_secrets where name = 'notify_email_from' limit 1;

  if api_key is null or mail_to is null then
    return new;
  end if;
  mail_from := coalesce(mail_from, mail_to);

  if tg_table_name = 'orders' then
    mode_label := case new.order_type
      when 'livraison'  then 'Livraison'
      when 'a_emporter' then 'À emporter'
      when 'sur_place'  then 'Sur place'
      else new.order_type
    end;

    select string_agg(
             format('<li>%s × %s : %s Dh</li>',
                    mg_html(i->>'qty'), mg_html(i->>'name'), mg_html(i->>'subtotal')),
             '')
      into items_html
      from jsonb_array_elements(new.items) as i;

    subject := format('Nouvelle commande : %s %s (%s Dh, %s)',
                      new.customer_first_name, new.customer_last_name, trim_scale(new.total), mode_label);

    html := format(
      '<h2>Nouvelle commande sur le site</h2>'
      '<ul>%s</ul>'
      '<p><strong>Total : %s Dh</strong></p>'
      '<p>Mode : %s<br>%s</p>'
      '<p>Client : %s %s<br>Téléphone : <a href="tel:%s">%s</a></p>'
      '<p><a href="%s">Ouvrir l''espace admin</a></p>',
      coalesce(items_html, ''),
      trim_scale(new.total),
      mode_label,
      case when new.order_type = 'livraison'
           then 'Adresse : ' || mg_html(new.address)
           else 'Date : ' || coalesce(to_char(new.scheduled_date, 'DD/MM/YYYY'), '?')
                || ' à ' || coalesce(to_char(new.scheduled_time, 'HH24:MI'), '?')
      end,
      mg_html(new.customer_first_name), mg_html(new.customer_last_name),
      mg_html(new.phone), mg_html(new.phone),
      admin_url
    );

  elsif tg_table_name = 'event_reservations' then
    subject := format('Nouvelle réservation : %s le %s (%s pers.)',
                      new.event_type, to_char(new.event_date, 'DD/MM/YYYY'), new.guests);

    html := format(
      '<h2>Nouvelle demande de réservation</h2>'
      '<p>Événement : %s<br>Date : %s à %s<br>Personnes : %s%s</p>'
      '<p>Client : %s<br>Téléphone : <a href="tel:%s">%s</a></p>'
      '<p><a href="%s">Ouvrir l''espace admin</a></p>',
      mg_html(new.event_type),
      to_char(new.event_date, 'DD/MM/YYYY'), to_char(new.event_time, 'HH24:MI'),
      new.guests,
      case when coalesce(new.table_note, '') <> '' then '<br>Tables : ' || mg_html(new.table_note) else '' end,
      mg_html(new.customer_name),
      mg_html(new.phone), mg_html(new.phone),
      admin_url
    );
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

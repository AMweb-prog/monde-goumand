/*
 * Génère une vraie page HTML pour chaque route du site (menu.html, gateaux.html, ...)
 * à partir de site-template.html, avec le bon titre, la bonne description et la bonne URL canonique
 * écrits directement dans le HTML (visible par Google sans JavaScript).
 *
 * Avec "cleanUrls": true dans vercel.json, Vercel sert /menu à partir de menu.html.
 *
 * À relancer après CHAQUE modification de site-template.html, avant de push :
 *     node generate-pages.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SITE = 'https://www.mondegourmand.com';
const source = fs.readFileSync(path.join(ROOT, 'site-template.html'), 'utf8');

// Lit les routes directement depuis window.MG_SEO_ROUTES dans le gabarit (source unique).
const routesMatch = source.match(/window\.MG_SEO_ROUTES\s*=\s*(\{[\s\S]*?\n\});/);
if (!routesMatch) throw new Error('window.MG_SEO_ROUTES introuvable dans site-template.html');
const ROUTES = new Function(`return ${routesMatch[1]};`)();

// Les marqueurs de page délimitent les contenus autonomes à publier sur chaque URL.
const markers = [...source.matchAll(/<!-- ══ PAGE: ([^\n]+?) ══ -->/g)];
const tailMarker = '<!-- ENHANCED GALLERY LIGHTBOX -->';
const tailStart = source.indexOf(tailMarker);
if (markers.length !== Object.keys(ROUTES).length || tailStart < 0) {
  throw new Error('Marqueurs de page manquants ou incohérents dans site-template.html');
}
const intro = source.slice(0, markers[0].index);
const tail = source.slice(tailStart);
const pageBlocks = {};
for (let index = 0; index < markers.length; index += 1) {
  const start = markers[index].index;
  const end = markers[index + 1]?.index ?? tailStart;
  const id = source.slice(start, end).match(/<div id="page-([^"]+)"/)[1];
  pageBlocks[id] = source.slice(start, end);
}
const lightboxMarker = '<!-- ══ LIGHTBOX PRODUITS';
const lightboxStart = pageBlocks.about.indexOf(lightboxMarker);
if (lightboxStart < 0) throw new Error('Lightbox produits introuvable');
const productLightbox = pageBlocks.about.slice(lightboxStart);
pageBlocks.about = pageBlocks.about.slice(0, lightboxStart);

const ROBOTS_INDEX = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
const ROBOTS_NOINDEX = 'noindex,follow';

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

function replaceOnce(html, regex, replacement, label) {
  const matches = html.match(new RegExp(regex.source, regex.flags.replace('g', '') + 'g'));
  if (!matches || matches.length !== 1) {
    throw new Error(`"${label}" trouvé ${matches ? matches.length : 0} fois dans site-template.html (attendu : 1)`);
  }
  return html.replace(regex, replacement);
}

// Remplace l'attribut content="..." d'une balise <meta> repérée par un attribut unique.
function setMeta(html, attr, content) {
  const re = new RegExp(`(<meta[^>]*${attr}[^>]*\\scontent=")[^"]*(")`);
  return replaceOnce(html, re, `$1${esc(content)}$2`, attr);
}

const written = [];
for (const [id, seo] of Object.entries(ROUTES)) {
  const url = SITE + seo.path;
  const robots = seo.noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX;
  if (!pageBlocks[id]) throw new Error(`Section ${id} introuvable`);
  let html = intro
    + pageBlocks[id].replace('class="page-section"', 'class="page-section active"')
    + productLightbox
    + tail;

  // Chaque route a son propre document : les liens internes doivent naviguer nativement.
  html = html.replace(/\s+onclick="showPage\([^"]*"/g, '');

  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${esc(seo.title)}</title>`, '<title>');
  html = setMeta(html, 'id="metaDescription"', seo.description);
  html = setMeta(html, 'id="metaRobots"', robots);
  html = setMeta(html, 'name="googlebot"', robots);
  html = setMeta(html, 'id="ogTitle"', seo.title);
  html = setMeta(html, 'id="ogDescription"', seo.description);
  html = setMeta(html, 'id="ogUrl"', url);
  html = setMeta(html, 'id="twitterTitle"', seo.title);
  html = setMeta(html, 'id="twitterDescription"', seo.description);
  html = replaceOnce(
    html,
    /(<link id="canonicalUrl" rel="canonical" href=")[^"]*(")/,
    `$1${url}$2`,
    'canonicalUrl'
  );
  html = html.replace(
    '<!DOCTYPE html>',
    '<!DOCTYPE html>\n<!-- Fichier généré automatiquement depuis site-template.html par generate-pages.js : ne pas modifier à la main. -->'
  );

  const schemaPattern = /(<script id="businessStructuredData" type="application\/ld\+json">)([\s\S]*?)(<\/script>)/;
  html = replaceOnce(html, schemaPattern, (_match, open, json, close) => {
    const data = JSON.parse(json);
    const relevant = {
      home: ['#gateaux-sur-mesure', '#evenements', '#commande', '#faq'],
      about: ['#evenements'],
      gateau: ['#gateaux-sur-mesure', '#commande'],
      menu: ['#menu', '#commande'],
      panier: [],
      wheel: []
    }[id] || [];
    data['@graph'] = data['@graph'].filter(node =>
      ['#organization', '#localbusiness', '#website'].some(suffix => node['@id']?.endsWith(suffix))
      || relevant.some(suffix => node['@id']?.endsWith(suffix))
    );
    data['@graph'].push({
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: seo.title,
      description: seo.description,
      inLanguage: 'fr-MA',
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': `${SITE}/#localbusiness` }
    });
    return open + '\n' + JSON.stringify(data, null, 2) + '\n' + close;
  }, 'businessStructuredData');
  if (id !== 'home') {
    const labels = { about: 'À propos', gateau: 'Gâteaux et pâtisseries', menu: 'Menu', panier: 'Panier', wheel: 'Roue Gourmande' };
    html = html.replace('</head>', `<script id="breadcrumbStructuredData" type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: labels[id], item: url }
      ]
    })}</script>\n</head>`);
  }

  const file = seo.path === '/' ? 'index.html' : seo.path.replace(/^\//, '') + '.html';
  fs.writeFileSync(path.join(ROOT, file), html);
  written.push(`${file}  →  ${seo.path}${seo.noindex ? '  (noindex)' : ''}`);
}

console.log('Pages générées :\n  ' + written.join('\n  '));

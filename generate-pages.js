/*
 * Génère une vraie page HTML pour chaque route du site (menu.html, gateaux.html, ...)
 * à partir de index.html, avec le bon titre, la bonne description et la bonne URL canonique
 * écrits directement dans le HTML (visible par Google sans JavaScript).
 *
 * Avec "cleanUrls": true dans vercel.json, Vercel sert /menu à partir de menu.html.
 *
 * À relancer après CHAQUE modification de index.html, avant de push :
 *     node generate-pages.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SITE = 'https://mondegourmand.com';
const source = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// Lit les routes directement depuis window.MG_SEO_ROUTES dans index.html (source unique).
const routesMatch = source.match(/window\.MG_SEO_ROUTES\s*=\s*(\{[\s\S]*?\n\});/);
if (!routesMatch) throw new Error('window.MG_SEO_ROUTES introuvable dans index.html');
const ROUTES = new Function(`return ${routesMatch[1]};`)();

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
    throw new Error(`"${label}" trouvé ${matches ? matches.length : 0} fois dans index.html (attendu : 1)`);
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
  if (seo.path === '/') continue; // index.html est la page d'accueil elle-même
  const url = SITE + seo.path;
  const robots = seo.noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX;
  let html = source;

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
    '<!DOCTYPE html>\n<!-- Fichier généré automatiquement depuis index.html par generate-pages.js : ne pas modifier à la main. -->'
  );

  const file = seo.path.replace(/^\//, '') + '.html';
  fs.writeFileSync(path.join(ROOT, file), html);
  written.push(`${file}  →  ${seo.path}${seo.noindex ? '  (noindex)' : ''}`);
}

console.log('Pages générées :\n  ' + written.join('\n  '));

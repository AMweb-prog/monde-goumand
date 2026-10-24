import { next } from '@vercel/edge';

const PROTECTED_PATHS = new Set([
  '/admin',
  '/admin.html',
  '/admin.css',
  '/admin.js'
]);

function secureEqual(left, right) {
  const encoder = new TextEncoder();
  const leftBytes = encoder.encode(String(left));
  const rightBytes = encoder.encode(String(right));
  const length = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] || 0) ^ (rightBytes[index] || 0);
  }

  return difference === 0;
}

function parseBasicCredentials(header) {
  if (!header?.startsWith('Basic ')) return null;

  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(':');
    if (separator < 1) return null;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1)
    };
  } catch {
    return null;
  }
}

function privateHeaders(extra = {}) {
  return {
    'Cache-Control': 'private, no-store, max-age=0',
    Pragma: 'no-cache',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    ...extra
  };
}

export const config = {
  matcher: ['/admin', '/admin.html', '/admin.css', '/admin.js']
};

export default function middleware(request) {
  const pathname = new URL(request.url).pathname;
  if (!PROTECTED_PATHS.has(pathname)) return next();

  const expectedUser = process.env.ADMIN_GATE_USER;
  const expectedPassword = process.env.ADMIN_GATE_PASSWORD;

  // Fail closed: a missing Vercel secret must never make the dashboard public.
  if (!expectedUser || !expectedPassword) {
    return new Response('Administration temporairement indisponible.', {
      status: 503,
      headers: privateHeaders({ 'Content-Type': 'text/plain; charset=utf-8' })
    });
  }

  const credentials = parseBasicCredentials(request.headers.get('authorization'));
  const isAuthorized = credentials
    && secureEqual(credentials.username, expectedUser)
    && secureEqual(credentials.password, expectedPassword);

  if (!isAuthorized) {
    return new Response('Authentification requise.', {
      status: 401,
      headers: privateHeaders({
        'Content-Type': 'text/plain; charset=utf-8',
        'WWW-Authenticate': 'Basic realm="Monde Gourmand Administration", charset="UTF-8"'
      })
    });
  }

  return next({ headers: privateHeaders() });
}

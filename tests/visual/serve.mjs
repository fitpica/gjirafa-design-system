// Minimal static file server rooted at the repo root, so visual fixtures can
// load the committed CSS (/docs/gjirafa-ds.css), the pre-bundled ds-core
// (/docs/vendor/ds-core-datepicker.js), and the built packages (/packages/...).
// Started by Playwright's `webServer`. Port 4317 (avoids the 4173 docs preview).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const PORT = Number(process.env.QA_PORT) || 4317;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.map': 'application/json; charset=utf-8',
};

createServer(async (req, res) => {
  try {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    // Prevent path traversal above the repo root.
    const safe = normalize(url).replace(/^(\.\.[/\\])+/, '');
    const body = await readFile(join(ROOT, safe));
    res.writeHead(200, { 'content-type': TYPES[extname(safe)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
}).listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[qa] serving ${ROOT} on http://localhost:${PORT}`);
});

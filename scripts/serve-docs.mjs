// Minimal static server for docs/ — used by `preview_start` via launch.json.
// Honors PORT env var (set by the MCP preview harness when autoPort triggers),
// falls back to 4173 when run directly.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..', 'docs');
const PORT = Number(process.env.PORT) || 4173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2',
  '.ico':  'image/x-icon',
};

createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const rel = urlPath === '/' ? '/index.html' : urlPath;
    const filePath = join(ROOT, rel);

    // Prevent path traversal: refuse anything outside ROOT
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }

    const data = await readFile(filePath);
    const mime = MIME[extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache' });
    res.end(data);
  } catch (err) {
    if (err.code === 'ENOENT' || err.code === 'EISDIR') {
      res.writeHead(404); res.end('Not found');
    } else {
      res.writeHead(500); res.end('Server error');
    }
  }
}).listen(PORT, () => {
  console.log(`Docs preview  →  http://localhost:${PORT}/`);
});

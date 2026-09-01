import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { createServer } from 'node:http';
import process from 'node:process';
import { URL } from 'node:url';

let version = 'v1';
const port = Number(process.env.RUCKUS_UPDATE_TEST_PORT ?? '4174');
const root = resolve('tests/.artifacts');
const types = new Map([
  ['.css', 'text/css'], ['.html', 'text/html'], ['.js', 'text/javascript'],
  ['.json', 'application/json'], ['.png', 'image/png'], ['.webmanifest', 'application/manifest+json'],
  ['.woff', 'font/woff'], ['.woff2', 'font/woff2'],
]);

createServer(async (request, response) => {
  if (request.method === 'POST' && request.url === '/__test/switch-to-v2') {
    version = 'v2';
    response.writeHead(204, { 'Cache-Control': 'no-store' });
    response.end();
    return;
  }

  const pathname = new URL(request.url ?? '/', `http://127.0.0.1:${String(port)}`).pathname;
  const relative = pathname.replace(/^\/Ruckus-Party\/?/, '');
  let file = resolve(root, version, relative || 'index.html');
  try {
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
  } catch {
    file = resolve(root, version, 'index.html');
  }
  response.writeHead(200, {
    'Content-Type': types.get(extname(file)) ?? 'application/octet-stream',
    'Cache-Control': file.endsWith('sw.js') ? 'no-store' : 'no-cache',
  });
  createReadStream(file).pipe(response);
}).listen(port, '127.0.0.1', () => {
  process.stdout.write(`ready:${String(port)}\n`);
});

import { cp, mkdir, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'dist');
const origin = 'https://941novabuild.com';
const preview = Boolean(process.env.CONTEXT && process.env.CONTEXT !== 'production');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(root, 'site'), output, { recursive: true });
const routes = JSON.parse(await readFile(path.join(root, 'routes.json'), 'utf8'));
if (preview) {
  for (const route of routes) {
    const file = path.join(output, route, 'index.html');
    const html = await readFile(file, 'utf8');
    await writeFile(file, html.replace('content="index, follow"', 'content="noindex, nofollow"'));
  }
}
await writeFile(path.join(output, 'robots.txt'), preview
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${origin}${route}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(path.join(output, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n'+(preview?'  X-Robots-Tag: noindex, nofollow\n':''));
console.log(`Built ${routes.length} pages for ${preview ? 'non-indexable preview' : 'production'} → dist`);

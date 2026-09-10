import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const routes = JSON.parse(await readFile(path.join(root, 'routes.json'), 'utf8'));
for (const route of routes) {
 const html = await readFile(path.join(dist,route,'index.html'),'utf8');
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,route+' has one h1');
 assert(html.includes(`href="https://nova941.com${route}"`),route+' canonical');
 assert(!/PRIVATE|chatgpt\.site|vinext|\/@vite|\/@id|Proposed service/.test(html),route+' no private runtime');
 assert(html.includes('tel:+12066999000'),route+' correct phone');
 for (const match of html.matchAll(/<script([^>]*)>/g)) assert(match[1].includes('application/ld+json'),'No executable scripts');
 for (const match of html.matchAll(/(?:href|src)="([^"#]*)(?:#[^"]*)?"/g)) {
   const url=match[1];if(!url.startsWith('/')||url.startsWith('//'))continue;
   const target=path.join(dist,url.endsWith('/')?url+'index.html':url);
   assert((await stat(target)).isFile(),`${route} broken resource ${url}`);
 }
 for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(html.includes(`id="${match[1]}"`),'Anchor '+match[1]);
 for (const match of html.matchAll(/<img\b[^>]*>/g)) assert(/alt="[^"]+"/.test(match[0]),'Image alternative text');
 console.log('OK',route);
}
const css=await readFile(path.join(dist,'styles.css'),'utf8');
assert(!css.includes('url('),'Styles must not rely on unbundled URLs');
const robots=await readFile(path.join(dist,'robots.txt'),'utf8');
assert(robots.includes(process.env.CONTEXT && process.env.CONTEXT!=='production'?'Disallow: /':'Allow: /'));
assert((await readFile(path.join(dist,'sitemap.xml'),'utf8')).includes('https://nova941.com/'));
console.log('All route, asset, canonical, phone, script, and indexing checks passed.');

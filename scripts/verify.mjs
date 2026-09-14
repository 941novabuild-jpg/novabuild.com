import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),dist=path.join(root,'dist');
const routes=JSON.parse(await readFile(path.join(root,'routes.json'),'utf8'));
for(const route of routes){
 const html=await readFile(path.join(dist,route==='/'?'index.html':route.slice(1)+'.html'),'utf8');
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,route+' heading');
 assert(!html.includes('nova-build.nqcwa82.chatgpt.site'),route+' preview origin');
 assert(html.includes('https://nova941.com'),route+' canonical domain');
 for(const m of html.matchAll(/(?:src|href|srcSet)="([^"#]+)"/g)){
  const u=m[1];if(!u.startsWith('/')||u.startsWith('//'))continue;
  const pathname=u.split(/[?#]/)[0];if(!pathname)continue;
  const target=path.join(dist,pathname==='/'?'index.html':pathname);
  const exists=await stat(target).catch(()=>null)??await stat(target+'.html').catch(()=>null);
  assert(exists,route+' missing '+u);
 }
 assert(!html.includes('type="module"')||html.includes('/_next/static/chunks/'),route+' hydration assets');
 console.log('OK',route);
}
assert((await readFile(path.join(dist,'sitemap.xml'),'utf8')).includes('nova941.com'));
console.log('All exported route and resource checks passed');

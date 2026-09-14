import {cp,rm,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const dist=path.join(root,'dist');
await rm(dist,{recursive:true,force:true});
await cp(path.join(root,'site'),dist,{recursive:true});
const routes=JSON.parse(await readFile(path.join(root,'routes.json'),'utf8'));
const preview=!!process.env.CONTEXT&&process.env.CONTEXT!=='production';
if(preview){for(const route of routes){const f=path.join(dist,route==='/'?'index.html':route.slice(1)+'.html');const html=await readFile(f,'utf8');await writeFile(f,html.replace(/<meta name="robots"[^>]*>/g,'<meta name="robots" content="noindex, nofollow"/>'));}await writeFile(path.join(dist,'_headers'),(await readFile(path.join(dist,'_headers'),'utf8'))+'\n/*\n  X-Robots-Tag: noindex, nofollow\n');}
await writeFile(path.join(dist,'robots.txt'),preview?'User-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\nSitemap: https://nova941.com/sitemap.xml\n');
const indexable=routes.filter(r=>!r.startsWith('/projects/'));
await writeFile(path.join(dist,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+indexable.map(r=>'<url><loc>https://nova941.com'+r+'</loc></url>').join('')+'</urlset>\n');
console.log('Built '+routes.length+' pages for '+(preview?'preview':'production'));

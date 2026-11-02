import {cp,rm,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
await import('./build-campaign.mjs');
const root=path.resolve(import.meta.dirname,'..');
const dist=path.join(root,'dist');
await rm(dist,{recursive:true,force:true});
await cp(path.join(root,'site'),dist,{recursive:true});
const routes=JSON.parse(await readFile(path.join(root,'routes.json'),'utf8'));
// Shared form loader also handles existing client-side navigation between service pages.
for(const route of routes){const f=path.join(dist,route==='/'?'index.html':route.slice(1)+'.html');let html=await readFile(f,'utf8');html=html.replace('</head>','<link rel="stylesheet" href="/inquiry.css"/><link rel="stylesheet" href="/measurement.css"/></head>').replace('</body>','<script src="/inquiry.js" defer></script><script src="/measurement.js" defer></script></body>');await writeFile(f,html);}
const preview=!!process.env.CONTEXT&&process.env.CONTEXT!=='production';
const {applySeo}=await import('./seo.mjs');
await applySeo(dist,routes,preview);
console.log('Built '+routes.length+' pages for '+(preview?'preview':'production'));

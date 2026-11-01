import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {pages,replaceText} from './seo.mjs';
const preview=process.env.CONTEXT==='deploy-preview';
assert.equal(replaceText('index, follow','index, follow','index, follow, max-image-preview:large'),'index, follow, max-image-preview:large');
const titles=new Set(), descriptions=new Set();
for(const [route,p] of Object.entries(pages)){
 const html=await readFile('dist/'+(route==='/'?'index':route.slice(1))+'.html','utf8');
 for(const pattern of [/<title>/g,/<meta name="description"/g,/<meta name="robots"/g,/<link rel="canonical"/g])assert.equal([...html.matchAll(pattern)].length,1,route);
 assert(html.includes('href="https://nova941.com'+route+'"'),route+' canonical');
 const robots=html.match(/<meta name="robots" content="([^"]+)"/)[1];
 assert.equal(robots,preview||!p.index?'noindex, follow':'index, follow, max-image-preview:large');
 assert(!titles.has(p.title));titles.add(p.title);assert(!descriptions.has(p.description));descriptions.add(p.description);
 if(p.index){const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert(schema['@graph'].some(x=>x['@type']==='Organization'));if(p.service)assert(schema['@graph'].some(x=>x['@type']==='Service'));assert(!JSON.stringify(schema).match(/"(?:aggregateRating|review|streetAddress|geo)"/));}
 if(p.image)await stat('dist'+p.image);
}
const sitemap=await readFile('dist/sitemap.xml','utf8');
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]).sort(),Object.entries(pages).filter(([,p])=>p.index).map(([r])=>'https://nova941.com'+r).sort());
const home=await readFile('dist/index.html','utf8');for(const route of Object.keys(pages).filter(r=>r.startsWith('/services/')))assert(home.includes('href="'+route+'"'),route+' home link');
console.log('SEO checks passed: 12 routes, unique metadata, indexing policy, schema, images, sitemap, service links.');

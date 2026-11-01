import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
export const pages=JSON.parse(await readFile(new URL('../seo/pages.json',import.meta.url),'utf8'));
const origin='https://nova941.com';
const cities=['Bellevue','Mercer Island','Medina','Kirkland','Redmond','Sammamish','Seattle','Clyde Hill','Newcastle'];
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'");
// Keep initial HTML, embedded React data, and retained RSC payloads consistent.
export function replaceText(html,oldValue,newValue){
 if(!oldValue||oldValue===newValue)return html;
 const variants=v=>[escape(v),v,v.replaceAll('&','\\u0026'),JSON.stringify(v).slice(1,-1).replaceAll('&','\\u0026')];
 const old=variants(oldValue),next=variants(newValue);
 const map=new Map(old.map((value,i)=>[value,next[i]]));
 const pattern=[...map.keys()].sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');
 return html.replace(new RegExp(pattern,'g'),match=>map.get(match));
}
export async function applySeo(dist,routes,preview){
 for(const route of routes){
  const p=pages[route];if(!p)throw Error('Missing SEO policy: '+route);
  const f=path.join(dist,route==='/'?'index.html':route.slice(1)+'.html');let html=await readFile(f,'utf8');
  const oldTitle=decode(html.match(/<title>(.*?)<\/title>/s)?.[1]||'');
  const oldDescription=decode(html.match(/<meta name="description" content="(.*?)"/s)?.[1]||'');
  html=replaceText(html,oldTitle,p.title);html=replaceText(html,oldDescription,p.description);
  const robots=preview?'noindex, follow':p.index?'index, follow, max-image-preview:large':'noindex, follow';
  const oldRobots=html.match(/<meta name="robots" content="(.*?)"/)?.[1];
  html=replaceText(html,oldRobots,robots);
  html=html.replace(/<title>.*?<\/title>/gs,'').replace(/<meta\b[^>]*(?:name="(?:description|robots|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g,'').replace(/<link\b[^>]*rel="canonical"[^>]*>/g,'').replace(/<script type="application\/ld\+json">.*?<\/script>/gs,'');
  const url=origin+route;
  const org={'@type':'Organization','@id':origin+'/#organization',name:'Nova Build',url:origin+'/',telephone:'+12066999000',description:'Residential remodeling contractor serving Seattle’s Eastside.',areaServed:cities.map(name=>({'@type':'City',name})),contactPoint:{'@type':'ContactPoint',telephone:'+12066999000',contactType:'project inquiries'}};
  const website={'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'Nova Build',publisher:{'@id':org['@id']}};
  const webpage={'@type':'WebPage','@id':url+'#webpage',url,name:p.title,description:p.description,inLanguage:'en-US',isPartOf:{'@id':website['@id']},about:{'@id':org['@id']}};
  const graph=[org,website,webpage];
  if(route!=='/'&&p.index){graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'},{'@type':'ListItem',position:2,name:p.name,item:url}]});webpage.breadcrumb={'@id':url+'#breadcrumb'};}
  if(p.service){const service={'@type':'Service','@id':url+'#service',name:p.service,serviceType:p.service,description:p.description,url,provider:{'@id':org['@id']},areaServed:cities.map(name=>({'@type':'City',name}))};graph.push(service);webpage.mainEntity={'@id':service['@id']};}
  const image=p.image||pages['/'].image;
  let head=`<title>${escape(p.title)}</title><meta name="description" content="${escape(p.description)}"><meta name="robots" content="${robots}"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="Nova Build"><meta property="og:title" content="${escape(p.title)}"><meta property="og:description" content="${escape(p.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin+image}"><meta name="twitter:card" content="summary_large_image">`;
  if(p.index)head+='<script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c')+'</script>';
  html=html.replace('</head>',head+'</head>');await writeFile(f,html);
  const rsc=f.replace(/\.html$/,'.rsc');let payload=await readFile(rsc,'utf8').catch(()=>null);
  if(payload){payload=replaceText(payload,oldTitle,p.title);payload=replaceText(payload,oldDescription,p.description);payload=replaceText(payload,oldRobots,robots);await writeFile(rsc,payload);}
 }
 const indexed=routes.filter(r=>pages[r].index);
 await writeFile(path.join(dist,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+indexed.map(r=>'<url><loc>'+origin+r+'</loc></url>').join('')+'</urlset>\n');
 // Permit fetching noindex pages so search engines can observe their directives.
 await writeFile(path.join(dist,'robots.txt'),'User-agent: *\nAllow: /\n'+(preview?'':'Sitemap: '+origin+'/sitemap.xml\n'));
 let headers=await readFile(path.join(dist,'_headers'),'utf8');
 for(const route of routes.filter(r=>!pages[r].index))headers+=`\n${route}\n  X-Robots-Tag: noindex, follow\n\n${route}.html\n  X-Robots-Tag: noindex, follow\n`;
 headers+='\n/*.rsc\n  X-Robots-Tag: noindex\n';
 if(preview)headers+='\n/*\n  X-Robots-Tag: noindex, follow\n';
 await writeFile(path.join(dist,'_headers'),headers);
}

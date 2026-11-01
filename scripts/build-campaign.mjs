import {build} from 'esbuild';
import {mkdir,readFile,writeFile,cp} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(import.meta.dirname,'..'),src=path.join(root,'campaign-src'),tmp=path.join(root,'.campaign-build');
await mkdir(tmp,{recursive:true});await mkdir(path.join(root,'site/campaign-assets'),{recursive:true});
const common={bundle:true,jsx:'automatic',alias:{'@':src},define:{'process.env.NODE_ENV':'"production"'},logLevel:'warning'};
await build({...common,entryPoints:[path.join(src,'render.tsx')],outfile:path.join(tmp,'render.mjs'),platform:'node',format:'esm',packages:'external'});
const {render}=await import(pathToFileURL(path.join(tmp,'render.mjs')).href+'?v='+Date.now());
await build({...common,entryPoints:[path.join(src,'client.tsx')],outfile:path.join(root,'site/campaign-assets/campaign.js'),platform:'browser',format:'iife',minify:true,target:['es2020']});
await cp(path.join(src,'campaign.css'),path.join(root,'site/campaign-assets/campaign.css'));
for(const kind of ['kitchen','bathroom']){
 const title=(kind==='kitchen'?'Kitchen':'Bathroom')+' Remodeling in Bellevue, WA | Nova Build',route='/services/'+kind+'-remodeling';
 const description=kind==='kitchen'?'Kitchen remodeling in Bellevue, WA. Cabinetry, countertops, backsplash and flooring, with clear scope and an on-site manager. Discuss your project with Nova Build.':'Bathroom remodeling in Bellevue, WA. Showers, vanities, tile and finishes, with clear scope and an on-site manager. Discuss your project with Nova Build.';
 const image=kind==='kitchen'?'/projects/kitchen-wide-20260914-desktop.jpg':'/projects/vanity-desktop.jpg';
 const html='<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><meta name="description" content="'+description+'"><meta name="robots" content="index, follow"><link rel="canonical" href="https://nova941.com'+route+'"><meta property="og:type" content="website"><meta property="og:title" content="'+title+'"><meta property="og:description" content="'+description+'"><meta property="og:url" content="https://nova941.com'+route+'"><meta property="og:image" content="https://nova941.com'+image+'"><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/campaign-assets/campaign.css"></head><body><div data-nova-campaign="'+kind+'">'+render(kind)+'</div><script src="/campaign-assets/campaign.js" defer></script></body></html>';
 await writeFile(path.join(root,'site',route+'.html'),html);
}
console.log('Rendered both campaign pages; production inquiry API unchanged.');

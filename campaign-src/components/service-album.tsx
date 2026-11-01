'use client';
import {useState} from 'react';
import {ProjectComparisons} from './project-comparisons';
import {Dialog,DialogTrigger,DialogContent,DialogTitle,DialogDescription,DialogClose} from './ui/dialog';
import {X,ZoomIn,ZoomOut,ChevronLeft,ChevronRight} from 'lucide-react';
import photos from '../lib/project-photos.json';
const groups={kitchen:['kitchen-wide','backsplash','stone'],bathroom:['bathroom','shower-wood','copper-basin'],custom:['custom-bench','custom-detail','custom-shelves','custom-entry','chandelier','shower-wood','copper-basin'],home:['interior','trim','porch'],tile:['shower-wood','backsplash','tile']} as const;
export function ServiceAlbum({kind,detailOnly=false}:{detailOnly?:boolean;kind:'kitchen'|'bathroom'|'custom'|'home'|'tile'}){
 const entries=groups[kind].filter(id=>!detailOnly||id!=='kitchen-wide').map(id=>photos[id]);
 const [index,setIndex]=useState(0),[open,setOpen]=useState(false),[zoom,setZoom]=useState(false);
 const current=entries[index];
 function move(direction:number){setIndex(i=>(i+direction+entries.length)%entries.length);setZoom(false)}
 return <section className="service-album" aria-label={`${kind} photo gallery`}>
 <Dialog open={open} onOpenChange={value=>{setOpen(value);setZoom(false)}}>
 <div className={`album-grid mosaic-grid mosaic-${kind}${detailOnly?' mosaic-details-only':''}`}>{entries.map((photo,i)=><DialogTrigger key={photo.source} className="album-thumbnail" onClick={()=>setIndex(i)} aria-label={`Enlarge photo ${i+1}: ${photo.alt}`}><picture><source srcSet={`${photo.desktop.src}.webp`} type="image/webp"/><img src={`${photo.desktop.src}.jpg`} alt={photo.alt} width={photo.desktop.width} height={photo.desktop.height} loading="lazy"/></picture>{/during construction|during installation|work in progress/i.test(photo.alt)&&<span className="album-stage">Work in progress</span>}</DialogTrigger>)}</div>
 <DialogContent className="album-lightbox" showCloseButton={false} onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();move(1)}if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}}}>
 <div className="album-toolbar"><DialogTitle>{{kitchen:'Kitchen',bathroom:'Bathroom',custom:'Custom work',home:'Home renovation',tile:'Tile'}[kind]} photographs</DialogTitle><div><button type="button" aria-label={zoom?'Zoom out':'Zoom in'} aria-pressed={zoom} onClick={()=>setZoom(!zoom)}>{zoom?<ZoomOut/>:<ZoomIn/>}</button><DialogClose className="album-close" aria-label="Close photo"><X/></DialogClose></div></div>
 <div className={`album-viewer${zoom?' is-zoomed':''}`}><img src={`${current.desktop.src}.jpg`} alt={current.alt} width={current.desktop.width} height={current.desktop.height}/></div>
 <div className="album-bottom"><button type="button" aria-label="Previous photo" onClick={()=>move(-1)}><ChevronLeft/></button><div><DialogDescription className="sr-only">{current.alt}</DialogDescription><span aria-live="polite">{index+1} / {entries.length}</span></div><button type="button" aria-label="Next photo" onClick={()=>move(1)}><ChevronRight/></button></div>
 </DialogContent></Dialog>
 {(kind==='kitchen'||kind==='bathroom')&&<ProjectComparisons kind={kind}/>}
 </section>
}

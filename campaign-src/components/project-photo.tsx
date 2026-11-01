import photos from '../lib/project-photos.json';
export type PhotoId = keyof typeof photos;
export function ProjectPhoto({id, priority=false, className='', sizes='(max-width: 760px) 100vw, 50vw', caption=true}: {id:PhotoId;priority?:boolean;className?:string;sizes?:string;caption?:boolean}) {
 const p=photos[id];
 return <figure className={'project-photo '+className}>
  <picture>
   <source media="(max-width: 760px)" type="image/webp" srcSet={p.mobile.src+'.webp'} width={p.mobile.width} height={p.mobile.height}/>
   <source media="(max-width: 760px)" type="image/jpeg" srcSet={p.mobile.src+'.jpg'} width={p.mobile.width} height={p.mobile.height}/>
   <source type="image/webp" srcSet={p.desktop.src+'.webp'} sizes={sizes}/>
   <img src={p.desktop.src+'.jpg'} width={p.desktop.width} height={p.desktop.height} alt={p.alt} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':undefined} decoding="async"/>
  </picture>
  {caption&&<figcaption>{p.caption}</figcaption>}
 </figure>;
}
export const servicePhotos:Record<string,PhotoId[]>={
 'kitchen-remodeling':['kitchen-wide','backsplash','stone'],
 'bathroom-remodeling':['bathroom','shower-wood','copper-basin'],
 'tile-installation':['shower-wood','backsplash','tile'],
 'home-renovation':['interior','trim','porch'],
 'finish-carpentry':['custom-bench','custom-detail','custom-shelves','custom-entry','chandelier','shower-wood','copper-basin']
};

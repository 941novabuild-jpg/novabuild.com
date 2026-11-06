'use client';
import {useState} from 'react';
import {RotateCcw} from 'lucide-react';
import {Slider} from './ui/slider';
type Pair='kitchen-01'|'kitchen-02'|'bathroom-01';
function Comparison({pair}:{pair:Pair}){
 const [position,setPosition]=useState(50);
 const wood=pair==='kitchen-02';
 return <div className="project-comparison-frame inline-comparison">
 <div className="project-comparison-labels"><span>{wood?'Before':'Earlier stage'}</span><span>{wood?'After':'Work in progress'}</span></div>
 <div className="photo-comparison real-comparison">
 {(['later','earlier'] as const).map(phase=><picture key={phase} className={phase==='earlier'?'comparison-before':undefined} style={phase==='earlier'?{clipPath:`inset(0 ${100-position}% 0 0)`}:undefined}>
 <source media="(max-width:600px)" srcSet={`/comparisons/mobile/${pair}-${phase}.webp`} type="image/webp"/>
 <source srcSet={`/comparisons/desktop/${pair}-${phase}.webp`} type="image/webp"/>
 <img src={`/comparisons/desktop/${pair}-${phase}.jpg`} alt={`${pair.startsWith('kitchen')?'Kitchen':'Bathroom'} ${wood?(phase==='earlier'?'before remodeling':'after remodeling'):(phase==='earlier'?'at an earlier renovation stage':'work in progress')}`} width={pair==='kitchen-01'?1200:1600} height={pair==='kitchen-01'?1500:2000} loading="lazy"/>
 </picture>)}
 <label className="comparison-control-label"><span className="sr-only">Earlier photo visibility. Use arrow keys to adjust.</span><Slider className="comparison-slider" value={[position]} onValueChange={value=>setPosition(Array.isArray(value)?value[0]:value)} min={0} max={100} step={1}/></label>
 </div>
 <div className="comparison-help comparison-tools"><button className="comparison-reset" type="button" aria-label="Reset comparison to center" title="Reset to center" onClick={()=>setPosition(50)}><RotateCcw size={20} strokeWidth={1.5} aria-hidden="true"/></button></div>
 </div>
}
export function ProjectComparisons({kind}:{kind:'kitchen'|'bathroom'}){
 const pairs:Pair[]=kind==='kitchen'?['kitchen-02','kitchen-01']:['bathroom-01'];
 return <section className="inline-comparisons" aria-labelledby="before-after-title"><h2 id="before-after-title">Before &amp; After</h2>{pairs.map(pair=><Comparison pair={pair} key={pair}/>)}</section>
}

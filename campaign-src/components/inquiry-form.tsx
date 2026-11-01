'use client';
import {useEffect,useRef} from 'react';
import {measure} from '../lib/inquiries/measurement';
export function InquiryForm({service}:{service?:string}){
 useEffect(()=>{(window as Window & {novaCampaignReady?:boolean}).novaCampaignReady=true;window.dispatchEvent(new Event('nova:campaign-ready'));},[]);
 return <div id="nova-inquiry-mount" data-service={service}><noscript>Please call or text (206) 699-9000 to discuss your project.</noscript></div>;
}
export function ContactLink({mode,children,className=''}:{mode:'call'|'text';children:React.ReactNode;className?:string}){
 const last=useRef(0);return <a className={className} href={(mode==='call'?'tel:':'sms:')+'+12066999000'} onClick={()=>{const now=Date.now();if(now-last.current<1500)return;last.current=now;measure(mode==='call'?'nova_call_click':'nova_text_click',crypto.randomUUID())}}>{children}</a>;
}

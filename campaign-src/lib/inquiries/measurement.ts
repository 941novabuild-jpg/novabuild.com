type EventName='nova_call_click'|'nova_text_click'|'nova_inquiry_received';
type MeasurementAdapter={consentGranted:boolean;send:(name:EventName,payload:{service:string;page:string;event_id:string;behavior:'intent'|'inquiry_received'})=>void};
declare global{interface Window{novaMeasurement?:MeasurementAdapter}}
const sent=new Set<string>();
export function measure(name:EventName,id:string){
 const adapter=window.novaMeasurement;
 if(!adapter?.consentGranted||sent.has(id))return;
 sent.add(id);
 if(name==='nova_inquiry_received'){
  try{if(sessionStorage.getItem('nova-measured-'+id))return;sessionStorage.setItem('nova-measured-'+id,'1')}catch{/* Memory deduplication remains available. */}
 }
 // Explicit allowlist: never include user input, query strings, phone, email or attribution.
 const service=window.location.pathname==='/services/bathroom-remodeling'?'bathroom-remodeling':'kitchen-remodeling';
 try{adapter.send(name,{service,page:'/services/'+service,event_id:id,behavior:name==='nova_inquiry_received'?'inquiry_received':'intent'})}catch{/* Measurement must never break contact actions. */}
}
export function attribution(){
 if(!window.novaMeasurement?.consentGranted)return undefined;
 const params=new URLSearchParams(window.location.search),result:Record<string,string>={};
 for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid']){
  const value=params.get(key);if(value&&/^[a-zA-Z0-9_ .~-]{1,200}$/.test(value))result[key]=value;
 }
 return result;
}

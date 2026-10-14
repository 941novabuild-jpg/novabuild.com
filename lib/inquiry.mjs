import {createHmac,randomUUID,timingSafeEqual} from 'node:crypto';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const paths={kitchen:'/services/kitchen-remodeling',bathroom:'/services/bathroom-remodeling'};
const response=(status,obj)=>Response.json(obj,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
function equal(a,b){return typeof a==='string'&&typeof b==='string'&&a.length>20&&Buffer.byteLength(a)===Buffer.byteLength(b)&&timingSafeEqual(Buffer.from(a),Buffer.from(b));}
function text(v,max,required=false){if(typeof v!=='string'||v.length>max||(required&&!v.trim())||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v))throw Error('INVALID');return v.trim();}
function sign(value,key){return createHmac('sha256',key).update(value).digest('base64url');}
export function normalize(b,isQA){
 if(!b||typeof b!=='object'||Array.isArray(b)||!uuid.test(b.requestId)||!paths[b.service]||b.page!==paths[b.service]||b.website!==''||b.contactConsent!==true)throw Error('INVALID');
 const name=text(b.name,120,true),contact=text(b.contact,160,true),city=text(b.city,100,true),brief=text(b.brief,4000,true),timing=text(b.timing??'',250);
 const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)?contact:'';
 const phone=!email&&/^[+()\d .-]{7,40}$/.test(contact)&&contact.replace(/\D/g,'').length>=7?contact:'';
 if(!email&&!phone)throw Error('INVALID');
 const attribution={};
 if(b.measurementConsent===true){for(const k of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid']){const v=b.attribution?.[k];if(v!==undefined){const s=text(v,160);if(!/^[\p{L}\p{N} _./:+-]*$/u.test(s))throw Error('INVALID');if(s)attribution[k]=s;}}}
 const google=attribution.utm_source?.toLowerCase()==='google'&&['cpc','ppc','paidsearch'].includes(attribution.utm_medium?.toLowerCase());
 const sourceDetail=JSON.stringify({channel:'website_form',page:b.page,submissionId:b.requestId,isTest:isQA,measurementConsent:b.measurementConsent===true,attribution,basis:google?'URL campaign parameters, unverified':'Website submission; acquisition unknown'});
 if(sourceDetail.length>2000)throw Error('INVALID');
 return {data:{name:(isQA?'NOVA TEST · ':'')+name,phone,email,contactMethod:email?'Email':'Phone',city,address:'',projectType:b.service==='kitchen'?'厨房改造':'卫生间改造',scope:brief,rawInquiry:`Website inquiry (${isQA?'QA':'visitor-submitted, not independently verified'})\n${brief}\nTiming: ${timing||'Not specified'}`,source:google?'GOOGLE_ADS':'WEBSITE',sourceDetail,campaign:attribution.utm_campaign||'',budgetCents:null,valueMinCents:null,valueMaxCents:null,startDate:'',completionDate:'',flexibility:timing,occupancy:'',permit:'',propertyType:'',lastContactAt:'',priorityReason:'',lostReason:'',lostNotes:'',assignedTo:''},action:{kind:'REVIEW',title:isQA?'QA 测试资料，不联系客户':'核对网站咨询并安排下一步',dueAt:null,notBefore:null}};
}
export async function handle(request,cfg,{fetcher=fetch,now=Date.now}={}){
 try{
  if(!cfg||!['qa','live'].includes(cfg.mode)||!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(cfg.url)||!cfg.key||!uuid.test(cfg.workspace)||!uuid.test(cfg.qaWorkspace)||cfg.workspace===cfg.qaWorkspace||!cfg.actor||typeof cfg.signingSecret!=='string'||cfg.signingSecret.length<32||typeof cfg.qaToken!=='string'||cfg.qaToken.length<32)return response(503,{available:false,error:'Online inquiries are not available. Please call or text us.'});
  const qaHeader=request.headers.get('x-nova-qa');const isQA=equal(qaHeader,cfg.qaToken);
  if(qaHeader&&!isQA)return response(403,{error:'Not authorized.'});
  if(cfg.mode!=='live'&&!isQA)return response(503,{available:false,error:'Online inquiries are being prepared. Please call or text us.'});
  const ownOrigin=new URL(request.url).origin;
  const origin=request.headers.get('Origin');
  if(origin&&!['https://nova941.com','https://www.nova941.com'].includes(origin)&&!(isQA&&origin===ownOrigin))return response(403,{error:'Request origin not allowed.'});
  if(request.method==='GET'){
   const value=JSON.stringify({id:randomUUID(),at:now(),qa:isQA});const token=Buffer.from(value).toString('base64url')+'.'+sign(value,cfg.signingSecret);
   return response(200,{available:true,token,isTest:isQA});
  }
  if(request.method!=='POST')return response(405,{error:'Method not allowed.'});
  if(!origin||!request.headers.get('Content-Type')?.startsWith('application/json'))return response(403,{error:'Request not allowed.'});
  if(Number(request.headers.get('Content-Length')||0)>16000)return response(413,{error:'Inquiry is too long.'});
  const reader=request.body?.getReader();if(!reader)return response(400,{error:'Missing inquiry.'});let chunks=[],length=0;
  for(;;){const {value,done}=await reader.read();if(done)break;length+=value.byteLength;if(length>16000){await reader.cancel();return response(413,{error:'Inquiry is too long.'});}chunks.push(value);}
  let b;try{b=JSON.parse(Buffer.concat(chunks).toString());}catch{return response(400,{error:'Invalid inquiry.'});}
  let t;try{const [enc,sig,...rest]=String(b.token).split('.');const value=Buffer.from(enc,'base64url').toString();t=JSON.parse(value);if(rest.length||!equal(sig,sign(value,cfg.signingSecret))||t.qa!==isQA||!uuid.test(t.id)||!Number.isFinite(t.at)||now()-t.at<1500||now()-t.at>7200000)throw Error();}catch{return response(400,{error:'Please refresh the form and try again. Your inquiry has not been confirmed.',code:'TOKEN_EXPIRED'});}
  let payload;try{payload=normalize(b,isQA);}catch{return response(400,{error:'Please check your name, contact details, city, project description and consent.'});}
  const headers={'Content-Type':'application/json',apikey:cfg.key};if(cfg.key.startsWith('eyJ'))headers.Authorization='Bearer '+cfg.key;
  // Existing Nova engine owns transactions, permission checks, actions and idempotency.
  const rpc={p_user:cfg.actor,p_workspace:isQA?cfg.qaWorkspace:cfg.workspace,p_request:b.requestId,p_lead:null,p_version:null,p_command:'create',p_payload:payload};
  let upstream;try{upstream=await fetcher(cfg.url+'/rest/v1/rpc/nova_lead_command',{method:'POST',headers,body:JSON.stringify(rpc),signal:AbortSignal.timeout(12000)});}catch{return response(503,{error:'We could not confirm receipt. Please retry this same inquiry.'});}
  if(!upstream.ok){const err=await upstream.text();return response(err.includes('NOVA_CONFLICT')?409:503,{error:err.includes('NOVA_CONFLICT')?'This submission ID already belongs to different details. Please call or text us before submitting again.':'We could not confirm receipt. Please retry this same inquiry.'});}
  let receipt;try{receipt=await upstream.json();}catch{return response(503,{error:'We could not confirm receipt. Please retry this same inquiry.'});}
  if(!uuid.test(receipt?.id)||!Number.isSafeInteger(receipt?.version))return response(503,{error:'We could not confirm receipt. Please retry this same inquiry.'});
  // Only expose the visitor's opaque request ID, never internal lead IDs or contact data.
  return response(200,{accepted:true,receiptId:b.requestId,isTest:isQA});
 }catch{return response(503,{error:'Online inquiries are temporarily unavailable. Please call or text us.'});}
}

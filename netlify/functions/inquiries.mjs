import {handle} from '../../lib/inquiry.mjs';
export default async(request)=>{let config;try{config=JSON.parse(process.env.NOVA_INQUIRY_CONFIG||'null');}catch{}
// Keep credentials sealed; activation is a separate, reversible deployment setting.
const mode=process.env.NOVA_INQUIRY_MODE;
if(config&&(mode==='qa'||mode==='live'))config={...config,mode};
return handle(request,config);};
export const config={path:'/api/inquiries',rateLimit:{windowLimit:20,windowSize:180,aggregateBy:['ip','domain']}};

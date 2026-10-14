import {handle} from '../../lib/inquiry.mjs';
export default async(request)=>{let config;try{config=JSON.parse(process.env.NOVA_INQUIRY_CONFIG||'null');}catch{}return handle(request,config);};
export const config={path:'/api/inquiries',rateLimit:{windowLimit:20,windowSize:180,aggregateBy:['ip','domain']}};

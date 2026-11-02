(()=>{
 const publicPath=/^\/(?:$|privacy\/?$|service-areas\/?$|services\/(?:kitchen-remodeling|bathroom-remodeling|finish-carpentry|home-renovation|tile-installation)\/?$|projects\/(?:kitchen-study|bathroom-study)\/?$)/;
 if(!publicPath.test(location.pathname))return;
 const key='nova-campaign-session-v1',ttl=30*60*1000;
 const fields=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid'];
 const clean=input=>Object.fromEntries(fields.flatMap(k=>{
  const v=input?.[k];
  if(typeof v!=='string'||!v||v.length>160)return [];
  const valid=k.startsWith('utm_')?/^[\p{L}\p{N} _./:+-]+$/u.test(v)&&!/[\d ()+.-]{7,}/.test(v):/^[A-Za-z0-9_-]{10,160}$/.test(v);
  return valid?[[k,v]]:[];
 }));
 let expires=Date.now()+ttl;
 let captured=clean(Object.fromEntries(new URLSearchParams(location.search))),retained={};
 try{const saved=JSON.parse(sessionStorage.getItem(key)||'null');if(saved&&Date.now()-saved.at<ttl&&saved.at<=Date.now()){retained=clean(saved.data);expires=saved.at+ttl;}else sessionStorage.removeItem(key);}catch{}
 let permitted=false;
 try{permitted=['yes','ads'].includes(localStorage.getItem('nova-analytics-consent-v1'));}catch{}
 const data=()=>{if(Date.now()>expires){captured={};retained={};try{sessionStorage.removeItem(key);}catch{}}return Object.keys(captured).length?{...captured}:{...retained};};
 const persist=()=>{if(!permitted)return;const d=data();if(Object.keys(d).length)try{expires=Date.now()+ttl;sessionStorage.setItem(key,JSON.stringify({at:Date.now(),data:d}));}catch{}};
 window.novaAttribution={
  read:()=>data(),
  allow:()=>{permitted=true;persist();},
  clear:()=>{permitted=false;retained={};captured={};try{sessionStorage.removeItem(key);}catch{}},
  // Only click identifiers enter the consented Google page context; arbitrary UTM text stays out.
  googleQuery:()=>{const q=new URLSearchParams();for(const [k,v] of Object.entries(data()))if(['gclid','gbraid','wbraid'].includes(k))q.set(k,v);return q.toString();}
 };
 persist();
})();

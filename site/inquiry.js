(()=>{
 const services={'/services/kitchen-remodeling':'kitchen','/services/bathroom-remodeling':'bathroom'};
 const hash=new URLSearchParams(location.hash.slice(1));let qa=hash.get('nova-qa')||'';
 if(qa){history.replaceState(null,'',location.pathname+location.search+'#inquiry');}
 let mounted='';
 function install(){
  if(document.querySelector('[data-nova-campaign]')&&!window.novaCampaignReady)return;
  const page=location.pathname.replace(/\/$/,''),service=services[page];
  if(!service){document.querySelector('#nova-inquiry')?.remove();mounted='';return;}
  const existing=document.querySelector('#nova-inquiry');if(existing&&mounted===page)return;existing?.remove();
  const main=document.querySelector('main');if(!main)return;mounted=page;
  const section=document.createElement('section');section.id='nova-inquiry';section.className='nova-inquiry';
  section.innerHTML=`<div class="ni-inner"><p class="ni-eyebrow">LET’S TALK ABOUT YOUR ${service.toUpperCase()}</p><h2>Tell us about your project.</h2><p>Share your city and the changes you have in mind. We’ll review your inquiry and discuss a useful next step. This is not an appointment booking.</p><p class="ni-status" role="status" aria-live="polite">Checking online inquiries…</p><form><div class="ni-grid"><label>Your name<input name="name" autocomplete="name" maxlength="120" required></label><label>Email or phone<input name="contact" autocomplete="email" maxlength="160" required></label><label>Project city<input name="city" autocomplete="address-level2" maxlength="100" required></label><label>Timing (optional)<input name="timing" maxlength="250" placeholder="For example, planning for next spring"></label></div><label>What would you like to change?<textarea name="brief" rows="4" maxlength="4000" required></textarea></label><div class="ni-honey" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><label class="ni-check"><input name="contactConsent" type="checkbox" required><span>I would like Nova Build to contact me about this project. <a href="/privacy">Privacy policy</a></span></label><label class="ni-check"><input name="measurementConsent" type="checkbox"><span>Optional: include campaign details from this visit to help us understand how you found us. This does not enable Google tracking.</span></label><button type="submit" disabled>Send project inquiry</button><p>Prefer a conversation? <a href="tel:+12066999000">Call</a> or <a href="sms:+12066999000">text 206 699 9000</a>.</p></form></div>`;
  (document.querySelector('#nova-inquiry-mount')||main).append(section);
  const form=section.querySelector('form'),button=form.querySelector('button'),status=section.querySelector('.ni-status');
  let token='',busy=false,pending=null;
  const storageKey='nova-inquiry:'+service;
  let requestId;try{requestId=sessionStorage.getItem(storageKey);}catch{}
  if(!/^[0-9a-f-]{36}$/i.test(requestId||'')){requestId=crypto.randomUUID();try{sessionStorage.setItem(storageKey,requestId);}catch{}}
  const headers=()=>({'Content-Type':'application/json',...(qa?{'X-Nova-QA':qa}:{})});
  async function ready(){
   try{const r=await fetch('/api/inquiries',{headers:headers(),cache:'no-store'}),b=await r.json();if(!r.ok||!b.available||!b.token)throw Error(b.error||'Online inquiries are unavailable. Please call or text us.');token=b.token;status.textContent=b.isTest?'QA TEST · saved separately; no customer contact.':'Your details are used to respond to your project inquiry.';button.disabled=false;}
   catch(e){status.textContent=e.message||'Online inquiries are unavailable. Please call or text us.';button.disabled=true;}
  }
  form.addEventListener('submit',async e=>{
   e.preventDefault();if(busy||!token||!form.reportValidity())return;busy=true;button.disabled=true;
   if(!pending){const d=new FormData(form),consent=d.get('measurementConsent')==='on',attribution={};if(consent){Object.assign(attribution,window.novaAttribution?.read()||{});}
    pending={requestId,service,page,name:d.get('name'),contact:d.get('contact'),city:d.get('city'),brief:d.get('brief'),timing:d.get('timing'),website:d.get('website'),contactConsent:d.get('contactConsent')==='on',measurementConsent:consent,attribution};}
   status.textContent='Sending your inquiry…';
   try{const r=await fetch('/api/inquiries',{method:'POST',headers:headers(),body:JSON.stringify({...pending,token})}),b=await r.json();if(!r.ok||b.accepted!==true||b.receiptId!==requestId){if(r.status===400&&b.code==='TOKEN_EXPIRED'){await ready();b.error='The form session was refreshed. Please retry the same inquiry in a moment.';}else if(r.status===400){pending=null;for(const el of form.elements)el.disabled=false;}throw Error(b.error||'Receipt is not confirmed. Please retry this same inquiry.');}
    dispatchEvent(new CustomEvent('nova:inquiry-received',{detail:{receiptId:b.receiptId,isTest:b.isTest===true}}));
    status.textContent=(b.isTest?'Test inquiry received. ':'Inquiry received. ')+`Reference: ${b.receiptId}. Thank you.`;button.textContent='Inquiry received';for(const el of form.elements)el.disabled=true;try{sessionStorage.removeItem(storageKey);}catch{}}
   catch(e){status.textContent=e.message||'Receipt is not confirmed. Retry to send the same inquiry, or call/text us.';button.disabled=false;button.textContent=pending?'Retry same inquiry':'Send project inquiry';if(pending){for(const el of form.elements)if(el!==button)el.disabled=true;}}
   finally{busy=false;}
  });
  ready();
 }
 new MutationObserver(()=>install()).observe(document.documentElement,{childList:true,subtree:true});
 addEventListener('popstate',install);addEventListener('nova:campaign-ready',install);install();
})();

(()=>{
 const id='G-D88PBW68G4',key='nova-analytics-consent-v1';
 const paths=new Set(['/','/services/kitchen-remodeling','/services/bathroom-remodeling','/services/finish-carpentry','/services/tile-installation','/services/home-renovation','/service-areas','/privacy','/projects/kitchen-study','/projects/bathroom-study']);
 const currentPage=()=>location.pathname.replace(/\/$/,'')||'/';if(!paths.has(currentPage()))return;
 const live=['nova941.com','www.nova941.com'].includes(location.hostname);
 let consent=false,ads=false,started=false,viewed=null;const sent=new Set();
 try{const saved=localStorage.getItem(key);consent=['yes','ads'].includes(saved);ads=saved==='ads';}catch{}
 function tag(){window.dataLayer=window.dataLayer||[];window.dataLayer.push(arguments);}
 let referrer='';try{referrer=new URL(document.referrer).origin+'/';}catch{}
 const consentState=()=>({analytics_storage:consent?'granted':'denied',ad_storage:ads?'granted':'denied',ad_user_data:ads?'granted':'denied',ad_personalization:'denied'});
 const context=()=>{const query=ads?window.novaAttribution?.googleQuery()||'':'';return {page_location:'https://nova941.com'+currentPage()+(query?'?'+query:''),page_referrer:referrer,page_title:document.title};};
 function start(){
  if(!consent||!live||!paths.has(currentPage()))return;
  window['ga-disable-'+id]=false;
  if(!started){started=true;
   tag('consent','default',consentState());
   tag('js',new Date());tag('set',{...context(),ads_data_redaction:!ads,url_passthrough:false});
   tag('config',id,{...context(),send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:60*60*24*90});
   const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.append(script);
  }else tag('consent','update',consentState());
  if(viewed!==currentPage()){viewed=currentPage();tag('event','page_view',{...context(),send_to:id});}
 }
 function send(name,receipt){
  if(!consent||!live||!paths.has(currentPage()))return;
  if(receipt){const k='nova-analytics-receipt:'+receipt;if(sent.has(k))return;try{if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,'1');}catch{}sent.add(k);}
  start();tag('event',name,{...context(),send_to:id,service:currentPage().split('/').pop()||'home',behavior:receipt?'inquiry_received':'intent'});
 }
 function clearCookies(pattern){for(const cookie of document.cookie.split(';')){const name=cookie.trim().split('=')[0];if(!pattern.test(name))continue;for(const domain of ['',location.hostname,'.nova941.com'])document.cookie=name+'=; Max-Age=0; Path=/'+(domain?'; Domain='+domain:'')+'; SameSite=Lax';}}
 const ui=document.createElement('aside');ui.className='nova-analytics';ui.setAttribute('aria-label','Analytics preferences');
 ui.innerHTML='<details><summary>Analytics preferences</summary><p>Choose optional website analytics, or analytics with advertising measurement to connect Google ad clicks with contact actions. Google may use cookies for your chosen purpose. We do not send inquiry details or enable personalized advertising. <a href="/privacy">Privacy policy</a></p><div><button type="button" data-choice="yes">Analytics only</button><button type="button" data-choice="ads">Analytics + ad measurement</button><button type="button" data-choice="no">Keep optional tracking off</button></div><p role="status"></p></details>';
 const status=ui.querySelector('[role="status"]');const update=()=>{status.textContent=ads?'Analytics and ad measurement are on.':consent?'Analytics only is on.':'Optional tracking is off.';};update();
 ui.addEventListener('click',e=>{const choice=e.target.closest('[data-choice]');if(!choice)return;const wasAds=ads;consent=['yes','ads'].includes(choice.dataset.choice);ads=choice.dataset.choice==='ads';try{localStorage.setItem(key,ads?'ads':consent?'yes':'no');}catch{}
  if(consent)window.novaAttribution?.allow();else window.novaAttribution?.clear();
  if(started){tag('consent','update',consentState());tag('set',{...context(),ads_data_redaction:!ads});}
  if(wasAds&&!ads)clearCookies(/^_gcl/);
  if(consent)start();else{window['ga-disable-'+id]=true;
   clearCookies(/^_(?:ga(?:_|$)|gcl)/);
  }update();
 });
 document.body.append(ui);
 document.addEventListener('click',e=>{const a=e.target.closest?.('a[href]');if(!a)return;const href=a.getAttribute('href');if(href==='tel:+12066999000')send('nova_call_click');if(href==='sms:+12066999000')send('nova_text_click');});
 addEventListener('nova:inquiry-received',e=>{const d=e.detail;if(d?.isTest===false&&/^[0-9a-f-]{36}$/i.test(d.receiptId||''))send('nova_inquiry_received',d.receiptId);});
 // Observe title/content changes for existing client-side navigation; query/hash changes do not count.
 let route=currentPage();
 if(typeof MutationObserver!=='undefined')new MutationObserver(()=>{if(route!==currentPage()){route=currentPage();start();}}).observe(document.documentElement,{childList:true,subtree:true});
 addEventListener('popstate',()=>start());
 start();
})();

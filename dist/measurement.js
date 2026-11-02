(()=>{
 const id='G-D88PBW68G4',key='nova-analytics-consent-v1';
 const paths=new Set(['/','/services/kitchen-remodeling','/services/bathroom-remodeling','/services/finish-carpentry','/services/tile-installation','/services/home-renovation','/service-areas','/privacy','/projects/kitchen-study','/projects/bathroom-study']);
 const currentPage=()=>location.pathname.replace(/\/$/,'')||'/';if(!paths.has(currentPage()))return;
 const live=['nova941.com','www.nova941.com'].includes(location.hostname);
 let consent=false,started=false,viewed=null;const sent=new Set();
 try{consent=localStorage.getItem(key)==='yes';}catch{}
 function tag(){window.dataLayer=window.dataLayer||[];window.dataLayer.push(arguments);}
 let referrer='';try{referrer=new URL(document.referrer).origin+'/';}catch{}
 const context=()=>({page_location:'https://nova941.com'+currentPage(),page_referrer:referrer,page_title:document.title});
 function start(){
  if(!consent||!live||!paths.has(currentPage()))return;
  window['ga-disable-'+id]=false;
  if(!started){started=true;
   tag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   tag('js',new Date());tag('set',{...context(),ads_data_redaction:true,url_passthrough:false});
   tag('config',id,{...context(),send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:60*60*24*90});
   const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.append(script);
  }else tag('consent','update',{analytics_storage:'granted'});
  if(viewed!==currentPage()){viewed=currentPage();tag('event','page_view',{...context(),send_to:id});}
 }
 function send(name,receipt){
  if(!consent||!live||!paths.has(currentPage()))return;
  if(receipt){const k='nova-analytics-receipt:'+receipt;if(sent.has(k))return;try{if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,'1');}catch{}sent.add(k);}
  start();tag('event',name,{...context(),send_to:id,service:currentPage().split('/').pop()||'home',behavior:receipt?'inquiry_received':'intent'});
 }
 const ui=document.createElement('aside');ui.className='nova-analytics';ui.setAttribute('aria-label','Analytics preferences');
 ui.innerHTML='<details><summary>Analytics preferences</summary><p>Allow optional Google Analytics cookies to help us understand page visits and contact actions. We do not send your inquiry details to Google Analytics. <a href="/privacy">Privacy policy</a></p><div><button type="button" data-choice="yes">Allow analytics</button><button type="button" data-choice="no">Keep analytics off</button></div><p role="status"></p></details>';
 const status=ui.querySelector('[role="status"]');const update=()=>{status.textContent=consent?'Optional analytics are on.':'Optional analytics are off.';};update();
 ui.addEventListener('click',e=>{const choice=e.target.closest('[data-choice]');if(!choice)return;consent=choice.dataset.choice==='yes';try{localStorage.setItem(key,consent?'yes':'no');}catch{}
  if(consent)start();else{window['ga-disable-'+id]=true;
   for(const cookie of document.cookie.split(';')){const name=cookie.trim().split('=')[0];if(!/^_ga(?:_|$)/.test(name))continue;for(const domain of ['',location.hostname,'.nova941.com'])document.cookie=name+'=; Max-Age=0; Path=/'+(domain?'; Domain='+domain:'')+'; SameSite=Lax';}
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

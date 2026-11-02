import {test} from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFileSync} from 'node:fs';
const attributionCode=readFileSync(new URL('../site/attribution.js',import.meta.url),'utf8');
const code=readFileSync(new URL('../site/measurement.js',import.meta.url),'utf8');
function setup(host='nova941.com',store=new Map(),search='?email=secret@example.com'){
 const listeners={},docListeners={},scripts=[],status={};let ui;
 const storage={getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
 const document={title:'Kitchen',referrer:'https://google.com/search?q=private',cookie:'',head:{append:x=>scripts.push(x)},body:{append:x=>{ui=x;}},createElement:()=>({setAttribute(){},querySelector:()=>status,addEventListener:(n,cb)=>listeners['ui:'+n]=cb}),addEventListener:(n,cb)=>docListeners[n]=cb};
 const window={};const context={window,document,location:{hostname:host,pathname:'/services/kitchen-remodeling',search},localStorage:storage,sessionStorage:storage,URL,URLSearchParams,Set,Date,addEventListener:(n,cb)=>listeners[n]=cb};vm.runInNewContext(attributionCode,context);vm.runInNewContext(code,context);
 return {window,scripts,store,navigate:p=>{context.location.pathname=p;listeners.popstate();},choose:v=>listeners['ui:click']({target:{closest:()=>({dataset:{choice:v}})}}),click:()=>docListeners.click({target:{closest:()=>({getAttribute:()=> 'tel:+12066999000'})}}),receipt:(id,isTest=false)=>listeners['nova:inquiry-received']({detail:{receiptId:id,isTest}}),events:()=>Array.from(window.dataLayer||[]).map(x=>Array.from(x)).filter(x=>x[0]==='event')};
}
test('no Google loading or events without explicit opt-in; one config and view after repeat consent',()=>{const x=setup();x.click();assert.equal(x.scripts.length,0);x.choose('yes');x.choose('yes');assert.equal(x.scripts.length,1);assert.equal(x.events().filter(x=>x[1]==='page_view').length,1);x.click();assert.equal(x.events().at(-1)[1],'nova_call_click');assert(!JSON.stringify(x.window.dataLayer).includes('private'));assert(!JSON.stringify(x.window.dataLayer).includes('secret'));});
test('confirmed receipt deduplicates across reload; tests excluded; revocation stops events',()=>{const x=setup();x.choose('yes');const id='11111111-1111-4111-8111-111111111111';x.receipt(id,true);x.receipt(id);x.receipt(id);assert.equal(x.events().filter(e=>e[1]==='nova_inquiry_received').length,1);const y=setup('nova941.com',x.store);y.receipt(id);assert.equal(y.events().filter(e=>e[1]==='nova_inquiry_received').length,0);x.choose('no');const n=x.events().length;x.click();assert.equal(x.events().length,n);assert(x.window['ga-disable-G-D88PBW68G4']);});
test('local previews never load Google or send measurement',()=>{const x=setup('localhost');x.choose('yes');x.click();assert.equal(x.scripts.length,0);assert.equal(x.events().length,0);});

test('client navigation updates clean page context without duplicate views or private-route events',()=>{const x=setup();x.choose('yes');x.navigate('/services/bathroom-remodeling');x.navigate('/services/bathroom-remodeling');x.click();assert.equal(x.events().filter(e=>e[1]==='page_view').length,2);assert.equal(x.events().at(-1)[2].service,'bathroom-remodeling');const n=x.events().length;x.navigate('/marketing-agent');x.click();assert.equal(x.events().length,n);});

test('legacy analytics consent never grants ads; ad opt-in shares only click identifiers',()=>{
 const store=new Map([['nova-analytics-consent-v1','yes']]);const x=setup('nova941.com',store,'?gclid=TestClick_abcdef1234&utm_campaign=private-name&email=private@example.com');
 assert(!JSON.stringify(x.events()).includes('TestClick'));x.choose('ads');x.click();assert(x.events().at(-1)[2].page_location.endsWith('?gclid=TestClick_abcdef1234'));assert(!JSON.stringify(x.events()).includes('private'));
 const consent=Array.from(x.window.dataLayer).map(x=>Array.from(x)).filter(x=>x[0]==='consent').at(-1)[2];assert.equal(consent.ad_user_data,'granted');assert.equal(consent.ad_personalization,'denied');
 x.choose('yes');x.click();assert(!x.events().at(-1)[2].page_location.includes('?'));x.choose('no');assert(!store.has('nova-campaign-session-v1'));
});
test('campaign evidence persists across pages only after consent; malformed and PII-like parameters discarded',()=>{
 const store=new Map();const x=setup('nova941.com',store,'?utm_source=google&utm_medium=cpc&utm_campaign=nova-kitchen&utm_term=2066999000&gclid=TestClick_abcdef1234&name=Private');
 assert(!store.has('nova-campaign-session-v1'));x.choose('yes');const y=setup('nova941.com',store,'');assert.equal(y.window.novaAttribution.read().utm_campaign,'nova-kitchen');assert(!y.window.novaAttribution.read().utm_term);assert(!y.window.novaAttribution.read().name);
 store.set('nova-campaign-session-v1',JSON.stringify({at:Date.now()-31*60*1000,data:{utm_source:'google'}}));store.delete('nova-analytics-consent-v1');const expired=setup('nova941.com',store,'');assert.equal(Object.keys(expired.window.novaAttribution.read()).length,0);
});

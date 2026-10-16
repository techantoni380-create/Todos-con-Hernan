/* Guía y estadísticas: el servidor es la única fuente de los contadores. */
(function () {
 'use strict';
 const root=document.getElementById('guia-gratis');
 if(!root||root.dataset.tchCounterInitialized==='true')return;
 root.dataset.tchCounterInitialized='true';
 const dictionary={
  es:{title:'La guía de Todos con Hernán',caption:'Suiza: empezar de nuevo',subtitle:'Una guía práctica y humana para tu nueva vida.',download:'Descargar gratis',format:'PDF en español · 54 páginas · 26,7 MB',date:'FECHA Y HORA · SUIZA',month:'MES',day:'DÍA',year:'AÑO',hour:'HORA',minute:'MIN',second:'SEG',visits:'VISITAS',visitLabel:'VISITAS A INICIO',downloads:'DESCARGAS',downloadLabel:'DESCARGAS DEL LIBRO',pending:'Estadísticas no disponibles',note:'Contadores desde la puesta en marcha. Visitas a Inicio y solicitudes de descarga; no personas únicas.',clock:'Fecha y hora de Suiza'},
  en:{title:'The Todos con Hernán guide',caption:'Switzerland: a new beginning',subtitle:'A practical, human guide to your new life.',download:'Download for free',format:'PDF in Spanish · 54 pages · 26.7 MB',date:'DATE & TIME · SWITZERLAND',month:'MON',day:'DAY',year:'YEAR',hour:'HOUR',minute:'MIN',second:'SEC',visits:'VISITS',visitLabel:'HOME PAGE VIEWS',downloads:'DOWNLOADS',downloadLabel:'BOOK DOWNLOADS',pending:'Statistics unavailable',note:'Counts since launch. Home page views and download requests; not unique people.',clock:'Date and time in Switzerland'},
  de:{title:'Der Ratgeber von Todos con Hernán',caption:'Schweiz: ein neuer Anfang',subtitle:'Ein praktischer, menschlicher Begleiter für dein neues Leben.',download:'Kostenlos herunterladen',format:'PDF auf Spanisch · 54 Seiten · 26,7 MB',date:'DATUM & ZEIT · SCHWEIZ',month:'MON',day:'TAG',year:'JAHR',hour:'STD',minute:'MIN',second:'SEK',visits:'AUFRUFE',visitLabel:'STARTSEITENAUFRUFE',downloads:'DOWNLOADS',downloadLabel:'BUCH-DOWNLOADS',pending:'Statistiken nicht verfügbar',note:'Zählung ab Inbetriebnahme. Seitenaufrufe und Download-Anfragen, keine einzelnen Personen.',clock:'Datum und Uhrzeit in der Schweiz'},
  fr:{title:'Le guide de Todos con Hernán',caption:'Suisse : un nouveau départ',subtitle:'Un guide pratique et humain pour votre nouvelle vie.',download:'Télécharger gratuitement',format:'PDF en espagnol · 54 pages · 26,7 Mo',date:'DATE ET HEURE · SUISSE',month:'MOIS',day:'JOUR',year:'ANNÉE',hour:'H',minute:'MIN',second:'SEC',visits:'VISITES',visitLabel:'VUES DE LA PAGE D’ACCUEIL',downloads:'TÉLÉCHARGEMENTS',downloadLabel:'TÉLÉCHARGEMENTS DU LIVRE',pending:'Statistiques indisponibles',note:'Compteurs depuis le lancement. Vues et demandes de téléchargement, pas de personnes uniques.',clock:'Date et heure en Suisse'},
  it:{title:'La guida di Todos con Hernán',caption:'Svizzera: un nuovo inizio',subtitle:'Una guida pratica e umana per la tua nuova vita.',download:'Scarica gratis',format:'PDF in spagnolo · 54 pagine · 26,7 MB',date:'DATA E ORA · SVIZZERA',month:'MESE',day:'GG',year:'ANNO',hour:'ORE',minute:'MIN',second:'SEC',visits:'VISITE',visitLabel:'VISITE ALLA HOME',downloads:'DOWNLOAD',downloadLabel:'DOWNLOAD DEL LIBRO',pending:'Statistiche non disponibili',note:'Conteggi dall’attivazione. Visite e richieste di download; non persone uniche.',clock:'Data e ora in Svizzera'},
  pt:{title:'O guia de Todos con Hernán',caption:'Suíça: um novo começo',subtitle:'Um guia prático e humano para a sua nova vida.',download:'Descarregar grátis',format:'PDF em espanhol · 54 páginas · 26,7 MB',date:'DATA E HORA · SUÍÇA',month:'MÊS',day:'DIA',year:'ANO',hour:'HORA',minute:'MIN',second:'SEG',visits:'VISITAS',visitLabel:'VISITAS À PÁGINA INICIAL',downloads:'DOWNLOADS',downloadLabel:'DOWNLOADS DO LIVRO',pending:'Estatísticas indisponíveis',note:'Contagens desde a ativação. Visitas e pedidos de download; não pessoas únicas.',clock:'Data e hora na Suíça'},
  zh:{title:'Todos con Hernán 指南',caption:'瑞士：重新开始',subtitle:'开启新生活的实用指南。',download:'免费下载',format:'西班牙语 PDF · 54 页 · 26.7 MB',date:'日期和时间 · 瑞士',month:'月',day:'日',year:'年',hour:'时',minute:'分',second:'秒',visits:'访问',visitLabel:'首页浏览次数',downloads:'下载',downloadLabel:'电子书下载次数',pending:'统计数据暂不可用',note:'启用后的首页浏览和下载请求次数，并非独立用户数。',clock:'瑞士日期和时间'}
 };
 const patterns={'0':'abcdef','1':'bc','2':'abdeg','3':'abcdg','4':'bcfg','5':'acdfg','6':'acdefg','7':'abc','8':'abcdefg','9':'abcdfg','-':'g'};
 const polygons={a:'5,1 19,1 22,4 18,6 6,6 2,4',b:'20,6 23,4 23,18 20,21 18,18 18,9',c:'20,23 23,26 23,40 20,42 18,38 18,26',d:'5,40 19,40 22,43 18,46 6,46 2,43',e:'2,23 5,26 5,38 2,42 0,40 0,26',f:'2,5 5,9 5,18 2,21 0,18 0,5',g:'5,20 18,20 21,23 18,26 5,26 2,23'};
 let lang='es', statsReady=false, latestStats=null;
 const links=[...root.querySelectorAll('[data-tch-download]')];
 const status=root.querySelector('.tch-stats-status');
 // Public browser key: grants access only to the counter RPC, not table writes.
 const endpoint='https://lqxvuuogxenzsplsruok.supabase.co/rest/v1/rpc/tch_book_counter';
 const publishableKey='sb_publishable_kBy973taie6QPk0awkdlIQ_21mxkXRS';
 function led(node,value,label){
  node.setAttribute('aria-label',label);
  if(node.dataset.value===value)return;
  node.dataset.value=value;
  node.innerHTML='<svg viewBox="0 0 '+(value.length*28)+' 48" aria-hidden="true" focusable="false">'+[...value].map((digit,i)=>'<g transform="translate('+(i*28+2)+',0)">'+Object.keys(polygons).map(key=>'<polygon class="tch-segment'+((patterns[digit]||'').includes(key)?' is-on':'')+'" points="'+polygons[key]+'"/>').join('')+'</g>').join('')+'</svg>';
 }
 const clockFormatter=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Zurich',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
 function clock(){
  const parts=Object.fromEntries(clockFormatter.formatToParts(new Date()).map(p=>[p.type,p.value]));
  root.querySelectorAll('[data-clock]').forEach(node=>led(node,parts[node.dataset.clock],parts[node.dataset.clock]));
  root.querySelector('.tch-date-row').setAttribute('aria-label',dictionary[lang].clock+': '+parts.day+'/'+parts.month+'/'+parts.year+' '+parts.hour+':'+parts.minute+':'+parts.second);
 }
 function translate(){
  const current=document.documentElement.lang.split('-')[0];lang=dictionary[current]?current:'es';
  const d=dictionary[lang];
  root.querySelectorAll('[data-tch-text]').forEach(node=>{node.textContent=d[node.dataset.tchText]});
  root.querySelector('.tch-circuits').title=d.note;
  status.textContent=statsReady?'':d.pending;
  if(latestStats&&statsReady){
   root.querySelector('[data-counter="visits"]').setAttribute('aria-label',d.visits+': '+latestStats.visits);
   root.querySelector('[data-counter="downloads"]').setAttribute('aria-label',d.downloads+': '+latestStats.downloads);
  }
  clock();
 }
 function renderStats(data){
  if(data?.ok!==true||!Number.isSafeInteger(data.visits)||data.visits<0||!Number.isSafeInteger(data.downloads)||data.downloads<0)throw Error('Invalid counters');
  // Concurrent reads must not overwrite a newer increment with older totals.
  if(latestStats)data={...data,visits:Math.max(data.visits,latestStats.visits),downloads:Math.max(data.downloads,latestStats.downloads)};
  led(root.querySelector('[data-counter="visits"]'),String(data.visits).padStart(8,'0'),dictionary[lang].visits+': '+data.visits);
  led(root.querySelector('[data-counter="downloads"]'),String(data.downloads).padStart(8,'0'),dictionary[lang].downloads+': '+data.downloads);
  statsReady=true;latestStats=data;status.textContent='';
 }
 function unavailable(){
  statsReady=false;status.textContent=dictionary[lang].pending;
  root.querySelectorAll('[data-counter]').forEach(node=>led(node,'--------',dictionary[lang].pending));
 }
 async function request(action='stats'){
  const control=new AbortController(),timeout=setTimeout(()=>control.abort(),5000);
  try{
   const response=await fetch(endpoint,{
    method:'POST',cache:'no-store',credentials:'omit',signal:control.signal,
    keepalive:action!=='stats',
    headers:{Accept:'application/json','Content-Type':'application/json',apikey:publishableKey},
    body:JSON.stringify({p_event:action})
   });
   if(!response.ok||!response.headers.get('content-type')?.includes('application/json'))throw Error('Statistics unavailable');
   const data=await response.json();renderStats(data);
  }catch(error){unavailable();throw error}finally{clearTimeout(timeout)}
 }
 root.querySelectorAll('[data-counter]').forEach(node=>led(node,'--------','—'));
 translate();clock();
 const observer=new MutationObserver(translate);observer.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 setInterval(()=>{if(!document.hidden)clock()},1000);
 if(location.protocol==='http:'||location.protocol==='https:'){
  // One visit per page load. Read-only refreshes never add visits.
  request('visit').catch(()=>{});
  links.forEach(link=>{
   function trackDownload(event){
    if(event.defaultPrevented||(event.type==='auxclick'&&event.button!==1))return;
    // Keep the native PDF download working, even if statistics are unavailable.
    // Never retry increments automatically: a lost reply may already be counted.
    request('download').catch(()=>{});
   }
   link.addEventListener('click',trackDownload);
   link.addEventListener('auxclick',trackDownload);
  });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){clock();if(statsReady)request().catch(()=>{})}});
  setInterval(()=>{if(!document.hidden)request().catch(()=>{})},60000);
 }
})();

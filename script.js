(function(){
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu){
    navToggle.addEventListener('click', ()=>{
      const shown = navMenu.classList.toggle('show');
      navToggle.setAttribute('aria-expanded', shown ? 'true' : 'false');
    });
  }

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href');
      if(id.length>1){
        const el = document.querySelector(id);
        if(el){
          e.preventDefault();
          const y = el.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({top:y, behavior:'smooth'});
          if(navMenu && navMenu.classList.contains('show')) navMenu.classList.remove('show');
        }
      }
    });
  });

  // Quote form (Netlify + mailto fallback)
  const form = document.getElementById('quoteForm');
  const status = document.getElementById('formStatus');
  if(form){
    form.addEventListener('submit', (e)=>{
      const data = new FormData(form);
      const required = ['company','email','commodity','origin','destination'];
      for(const r of required){
        if(!(data.get(r)||'').trim()){
          e.preventDefault();
          if(status){ status.textContent = 'Please fill all required fields.'; status.style.color = '#b40000'; }
          return;
        }
      }
      const isNetlify = !!document.querySelector('input[name="form-name"]');
      if(isNetlify && location.hostname.endsWith('.netlify.app')){
        if(window.gtag){ gtag('event','lead_submit',{method:'netlify'}); }
        return; // allow POST
      }
      e.preventDefault();
      const body = encodeURIComponent(
        `Company: ${data.get('company')}
Email: ${data.get('email')}
Commodity: ${data.get('commodity')}
Incoterms: ${data.get('incoterms')||''}
Origin: ${data.get('origin')}
Destination: ${data.get('destination')}
Volume & Weight: ${data.get('dims')||''}
Ship Date: ${data.get('shipdate')||''}
Notes:
${data.get('notes')||''}
`
      );
      window.location.href = `mailto:sales@northstarexpress.com?subject=Quote%20Request&body=${body}`;
      if(status){ status.textContent = 'Thanks! Your email editor should open now. We reply within 24 hours.'; status.style.color = '#0b3a33'; }
      if(window.gtag){ gtag('event','lead_submit',{method:'mailto'}); }
      form.reset();
    });
  }

  // Footer year
  const y = document.getElementById('year');
  if(y){ y.textContent = new Date().getFullYear(); }

  // i18n (EN/中文) minimal
  const dict = {
    en: {
      'hero.title': 'China–USA Logistics, Done Right.',
      'hero.sub': 'Ocean freight plus U.S. trucking & warehousing, with compliance built in. Designed for American importers, 3PLs, and growing brands.',
      'cta.request':'Request a Quote','cta.explore':'Explore Services',
      'nav.services':'Services','nav.process':'How it Works','nav.resources':'Resources','nav.about':'About','cta.get_quote':'Get a Quote',
      'services.title':'End‑to‑End Services','services.lead':'From port to porch: one accountable team for schedules, customs, trucking, and storage.',
      'process.title':'How It Works','resources.title':'Industry Resources','about.title':'Why North Star',
      'contact.title':'Request a Quote','contact.lead':'Tell us about your shipment and we’ll reply within 24 hours.',
      'form.company':'Company','form.email':'Email','form.commodity':'Commodity','form.incoterms':'Incoterms',
      'form.origin':'Origin (City, Country)','form.destination':'Destination (City, State)','form.dims':'Volume & Weight','form.shipdate':'Target Ship Date','form.notes':'Notes','cta.send':'Send Request'
    },
    zh: {
      'hero.title':'中美跨境物流，一次搞定',
      'hero.sub':'专注中美海运 + 美国本土卡车与仓储，全流程合规。为美国本土进口商、3PL与成长型品牌而设计。',
      'cta.request':'获取报价','cta.explore':'查看服务',
      'nav.services':'服务','nav.process':'流程','nav.resources':'资源','nav.about':'关于我们','cta.get_quote':'获取报价',
      'services.title':'端到端一站式服务','services.lead':'从港口到门店：时间表、清关、卡车与仓储均由同一团队负责。',
      'process.title':'服务流程','resources.title':'行业资源','about.title':'为什么选择 North Star',
      'contact.title':'获取报价','contact.lead':'告诉我们货物信息，我们将在24小时内回复。',
      'form.company':'公司','form.email':'邮箱','form.commodity':'品名','form.incoterms':'贸易术语',
      'form.origin':'起运地（城市, 国家）','form.destination':'目的地（城市, 州）','form.dims':'体积与重量','form.shipdate':'计划出运日期','form.notes':'备注','cta.send':'发送请求'
    }
  };
  function applyLang(lang){
    const map = dict[lang] || dict.en;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const k = el.getAttribute('data-i18n');
      if(map[k]){
        if(el.tagName==='INPUT' || el.tagName==='TEXTAREA'){
          el.setAttribute('placeholder', map[k]);
        }else{
          el.textContent = map[k];
        }
      }
    });
    localStorage.setItem('nsx_lang', lang);
  }
  const saved = localStorage.getItem('nsx_lang') || 'en';
  applyLang(saved);
  const btn = document.querySelector('.lang-toggle');
  if(btn){ btn.addEventListener('click', ()=>{ const cur = localStorage.getItem('nsx_lang') || 'en'; applyLang(cur==='en'?'zh':'en'); }); }

})();

// === Debug Overlay Mode ===
// Use ?debug=overlay in the URL to visualize potential blocking/overlay elements
(function(){
  try{
    const params = new URLSearchParams(location.search);
    if(params.get('debug') !== 'overlay') return;

    // Add styles for debug outlines and labels
    const style = document.createElement('style');
    style.textContent = `
    .__dbg-outline{ outline: 2px dashed rgba(220,0,0,.9) !important; outline-offset: 0 !important; }
    .__dbg-label{ position: absolute; top: -18px; left: 0; background: rgba(220,0,0,.9); color:#fff; font: 11px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 2px 4px; border-radius: 4px; z-index: 2147483647; pointer-events:none }
    .__dbg-panel{ position: fixed; right: 10px; bottom: 10px; background: rgba(0,0,0,.75); color:#fff; padding: 8px 10px; border-radius:10px; z-index:2147483647; font: 12px system-ui, -apple-system, Segoe UI, Roboto, Arial; }
    .__dbg-panel b{ color:#ffb3b3 }
    `;
    document.head.appendChild(style);

    const suspects = [];
    const all = document.querySelectorAll('*');
    all.forEach(el=>{
      const cs = getComputedStyle(el);
      const pos = cs.position;
      const zi = parseInt(cs.zIndex, 10);
      const pe = cs.pointerEvents;
      const op = parseFloat(cs.opacity);
      const isOverlayLike =
        (pos === 'fixed' || pos === 'absolute' || pos === 'sticky') ||
        (!isNaN(zi) && zi > 0) ||
        pe === 'none' ||
        (op < 1 && el.className && (el.className+'').toLowerCase().includes('overlay'));

      if(isOverlayLike){
        el.classList.add('__dbg-outline');
        // add label
        const rect = el.getBoundingClientRect();
        if(rect.width > 60 && rect.height > 20){
          const label = document.createElement('div');
          label.className = '__dbg-label';
          label.textContent = `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className ? '.' + String(el.className).split(' ').slice(0,2).join('.') : ''}  z:${isNaN(zi)?'auto':zi} pos:${pos}`;
          el.style.position = (pos==='static') ? 'relative' : el.style.position;
          el.appendChild(label);
        }
        suspects.push(el);
      }
    });

    const panel = document.createElement('div');
    panel.className = '__dbg-panel';
    panel.innerHTML = `<b>Overlay Debug</b><br/>Highlighted elements: ${suspects.length}<br/>Close this panel by removing <code>?debug=overlay</code> from the URL.`;
    document.body.appendChild(panel);
    console.log('[NSX] Overlay debug enabled. Highlighted elements:', suspects);
  }catch(e){ console.warn('Debug overlay init error:', e); }
})();


// --- Force form inputs to be visible & editable (safety net) ---
(function(){
  function forceFormVisible(){
    var form = document.getElementById('quoteForm');
    if(!form) return;
    var fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(function(el){
      try{
        el.style.display = 'block';
        el.style.width = '100%';
        el.style.minHeight = (el.tagName.toLowerCase()==='textarea') ? '120px' : '44px';
        el.style.background = '#ffffff';
        el.style.color = '#0b3a33';
        el.style.border = '1px solid #7fb8ac';
        el.style.borderRadius = '12px';
        el.style.padding = '12px 14px';
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.pointerEvents = 'auto';
        el.removeAttribute('disabled');
        el.removeAttribute('readonly');
        el.tabIndex = 0;
      }catch(e){}
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', forceFormVisible);
  }else{
    forceFormVisible();
  }
  window.NSX_forceFormVisible = forceFormVisible;
})();


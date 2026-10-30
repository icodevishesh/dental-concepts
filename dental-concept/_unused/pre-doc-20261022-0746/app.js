// Navigation
const toggle = document.querySelector('.nav-toggle');
const servicesBtn = document.querySelector('.nav-services-btn');
const servicesWrap = document.querySelector('.nav-services');

const setMenu = open => {
  toggle?.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
};
const setServices = open => {
  servicesBtn?.setAttribute('aria-expanded', String(open));
  servicesWrap?.classList.toggle('is-open', open);
};

toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
servicesBtn?.addEventListener('click', () => setServices(servicesBtn.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('click', e => { if (!e.target.closest('.nav-services')) setServices(false); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (servicesWrap?.classList.contains('is-open')) { setServices(false); servicesBtn.focus(); }
  else if (document.body.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
});

const current = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('#nav a').forEach(a => {
  if (a.getAttribute('href') !== current) return;
  a.setAttribute('aria-current', 'page');
  if (a.closest('.services-panel')) servicesBtn?.classList.add('is-current');
});

// Service index: pointing at a row shows its photograph
const preview = document.querySelector('.rx-preview');
if (preview) {
  const show = key => preview.querySelectorAll('figure').forEach(f => f.classList.toggle('is-on', f.dataset.key === key));
  document.querySelectorAll('.rx-sheet [data-photo]').forEach(row => {
    row.addEventListener('pointerenter', () => show(row.dataset.photo));
    row.addEventListener('focus', () => show(row.dataset.photo));
  });
}

// Contact form: builds an email draft, sends nothing itself
const inquiryForm = document.querySelector('#contact-inquiry-form');
if (inquiryForm) {
  inquiryForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!inquiryForm.reportValidity()) return;
    const formData = new FormData(inquiryForm);
    const topic = String(formData.get('topic') || 'General question');
    const recipient = topic === 'Shade photographs' ? 'photos@dentalconceptssf.com' : 'accounts@dentalconceptssf.com';
    const subject = `Dental Concepts inquiry: ${topic}`;
    const body = [
      `Name: ${formData.get('firstName')} ${formData.get('lastName')}`,
      `Practice: ${formData.get('practice')}`,
      `Practice email: ${formData.get('email')}`,
      `Phone: ${formData.get('phone') || 'Not provided'}`,
      `Topic: ${topic}`,
      `Preferred contact method: ${formData.get('preference') || 'Email'}`,
      '',
      'Message:',
      String(formData.get('message') || '')
    ].join('\n');
    const status = document.querySelector('#contact-form-status');
    if (status) status.textContent = `Your email draft is ready. Review it before sending to ${recipient}.`;
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

// Home hero video: pause and play
const heroVideo = document.querySelector('.hero-video');
const heroPause = document.querySelector('.hero-pause');
if (heroVideo && heroPause) {
  heroPause.addEventListener('click', () => {
    const pausing = !heroVideo.paused;
    if (pausing) heroVideo.pause(); else heroVideo.play();
    heroPause.setAttribute('aria-pressed', String(pausing));
    heroPause.textContent = pausing ? 'Play video' : 'Pause video';
  });
}

// Learning dropdown
document.querySelectorAll('.nav-drop').forEach(drop => {
  const btn = drop.querySelector('.nav-drop-btn');
  const set = open => { drop.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open)); };
  btn.addEventListener('click', () => set(!drop.classList.contains('is-open')));
  document.addEventListener('click', e => { if (!drop.contains(e.target)) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drop.classList.contains('is-open')) { set(false); btn.focus(); } });
  if (drop.querySelector('a[aria-current="page"]') || (/^blog-/.test(current) && drop.querySelector('a[href="blog.html"]'))) btn.classList.add('is-current');
});

/* scroll reveal */
(function(){
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var groups=['.menu-item','.pdp-step','.pdp-stats dl div','.pdp-quality-grid article','.svc-card','.svc-about-grid article','.kf-card','.vm-card','.people article','.post-card','.timeline li','.steps li','.service-row','.way-row','.partner-points article','.numbers-strip dl div','.quote-card'];
  var singles='.center-head,.section-head,.ways-head,.partner-head';
  var els=[];
  groups.forEach(function(g){document.querySelectorAll(g).forEach(function(el){
    var i=Array.prototype.indexOf.call(el.parentNode.children,el);
    el.style.setProperty('--rd',Math.min(i,4)*90+'ms');els.push(el);});});
  document.querySelectorAll(singles).forEach(function(el){els.push(el);});
  var vh=window.innerHeight;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(el){if(el.getBoundingClientRect().top<vh)return;el.classList.add('reveal');io.observe(el);});
})();

/* ways: swap large image with the hovered/focused item */
(function(){
  var items=document.querySelectorAll('.way-item'),imgs=document.querySelectorAll('.ways-media>.ways-img');
  if(!items.length||!imgs.length)return;
  function show(i){items.forEach(function(el,n){el.classList.toggle('is-active',n===i);});imgs.forEach(function(el,n){el.classList.toggle('is-active',n===i);});}
  items.forEach(function(el,i){el.addEventListener('mouseenter',function(){show(i);});el.addEventListener('focus',function(){show(i);});});
})();

/* ---------- motion & menu effects ---------- */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var root=document.documentElement;

  // header: deepen and tighten once the page scrolls
  var onScroll=function(){document.body.classList.toggle('is-scrolled',window.scrollY>12);};
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  // desktop: dropdowns open on hover, with a short grace period
  var hoverable=matchMedia('(hover:hover) and (min-width:981px)');
  function hoverMenu(wrap,btn){
    if(!wrap||!btn)return;var t;
    var set=function(open){wrap.classList.toggle('is-open',open);btn.setAttribute('aria-expanded',String(open));};
    wrap.addEventListener('mouseenter',function(){if(!hoverable.matches)return;clearTimeout(t);set(true);});
    wrap.addEventListener('mouseleave',function(){if(!hoverable.matches)return;t=setTimeout(function(){set(false);},160);});
  }
  hoverMenu(document.querySelector('.nav-services'),document.querySelector('.nav-services-btn'));
  document.querySelectorAll('.nav-drop').forEach(function(d){hoverMenu(d,d.querySelector('.nav-drop-btn'));});

  if(reduce)return;

  // home hero: staged entrance
  if(document.querySelector('.hero h1')){
    root.classList.add('intro');
    requestAnimationFrame(function(){requestAnimationFrame(function(){root.classList.add('intro-go');});});
  }

  // numbers: count up when they come into view
  var dts=document.querySelectorAll('.numbers-strip dt');
  if(dts.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return;io.unobserve(e.target);
      var el=e.target,txt=el.textContent,m=txt.match(/^(\d+)(.*)$/);if(!m)return;
      var end=+m[1],rest=m[2],t0=null,dur=1600;
      var step=function(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/dur,1),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=v+rest;if(p<1)requestAnimationFrame(step);};
      el.textContent='0'+rest;requestAnimationFrame(step);
    });},{threshold:.6});
    dts.forEach(function(d){io.observe(d);});
  }

  // navy cards: soft light follows the pointer
  document.querySelectorAll('.partner-points article,.feature-card').forEach(function(c){
    c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');});
  });
})();

/* tool pages: build an email draft from the form (nothing is sent by the site) */
document.querySelectorAll('form.tool-form[data-mailto]').forEach(function(form){
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!form.reportValidity())return;
    var lines=[],seen={},subjectExtra='';
    form.querySelectorAll('input[name],select[name],textarea[name]').forEach(function(el){
      if((el.type==='radio'||el.type==='checkbox')&&!el.checked)return;
      if(seen[el.name]&&el.type==='radio')return;seen[el.name]=1;
      var v=(el.value||'').trim();if(!v)return;
      lines.push(el.name+': '+v);
      if(el.name===form.dataset.subjectField)subjectExtra=' – '+v;
    });
    var subject=(form.dataset.subject||'Request')+subjectExtra;
    var status=form.querySelector('.form-status');
    if(status)status.textContent='Your email draft is ready. Review it, then send it to '+form.dataset.mailto+'.';
    window.location.href='mailto:'+form.dataset.mailto+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(lines.join('\n'));
  });
});

/* product page: material tabs (arrow keys move between tabs) */
document.querySelectorAll('.pdp-tabs').forEach(function(box){
  var tabs=[].slice.call(box.querySelectorAll('[role="tab"]'));
  function select(t){tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',String(on));x.tabIndex=on?0:-1;var p=document.getElementById(x.getAttribute('aria-controls'));if(p)p.hidden=!on;});}
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){select(t);});
    t.addEventListener('keydown',function(e){var n=null;if(e.key==='ArrowRight')n=tabs[(i+1)%tabs.length];if(e.key==='ArrowLeft')n=tabs[(i-1+tabs.length)%tabs.length];if(e.key==='Home')n=tabs[0];if(e.key==='End')n=tabs[tabs.length-1];if(n){e.preventDefault();select(n);n.focus();}});
  });
});

/* home: lab menu filters */
(function(){
  var btns=[].slice.call(document.querySelectorAll('.menu-filter')),items=[].slice.call(document.querySelectorAll('.menu-item'));
  if(!btns.length)return;
  btns.forEach(function(b){b.addEventListener('click',function(){
    var f=b.dataset.filter;btns.forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});
    items.forEach(function(it){var show=f==='all'||it.dataset.cat===f;it.hidden=!show;if(show){it.classList.add('is-in');}});
  });});
})();

// main.js — interactions: sticky header, tab active state, reveal on scroll
(function(){
  const header = document.querySelector('.site-header');
  const tabs = document.querySelectorAll('.tab');
  const listings = document.querySelectorAll('.listing');
  const overlay = document.getElementById('tabOverlay');
  const panels = overlay ? overlay.querySelectorAll('.tab-panel') : [];

  // Sticky header shadow
  function onScroll(){
    if(window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Tabs: open overlay panels on click (and support direct links via hash)
  tabs.forEach(tab => {
    tab.addEventListener('click', (e)=>{
      e.preventDefault();
      tabs.forEach(t=> t.classList.remove('active'));
      tab.classList.add('active');
      tabs.forEach(t=> t.removeAttribute('aria-current'));
      tab.setAttribute('aria-current','true');

      const targetId = tab.dataset.target;
      if(!overlay) return;
      // hide all panels then show target
      panels.forEach(p=> p.classList.add('hidden'));
      const panel = document.getElementById(targetId);
      if(panel){
        panel.classList.remove('hidden');
        overlay.classList.remove('hidden');
        overlay.setAttribute('aria-hidden','false');
        // focus the panel for accessibility
        panel.focus();
      }
    });
  });

  // If URL has hash that matches a tab, open that panel
  const hash = location.hash;
  if(hash){
    const target = hash.replace('#','');
    const matchingTab = Array.from(tabs).find(t=> t.dataset.target === 'panel-'+target);
    if(matchingTab) matchingTab.click();
  }

  // Overlay close behaviours
  function closeOverlay(){
    if(!overlay) return;
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden','true');
    panels.forEach(p=> p.classList.add('hidden'));
    tabs.forEach(t=> t.classList.remove('active'));
    tabs.forEach(t=> t.removeAttribute('aria-current'));
  }
  // close buttons
  overlay && overlay.querySelectorAll('.panel-close').forEach(btn => btn.addEventListener('click', closeOverlay));
  // click outside panel to close
  overlay && overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeOverlay(); });
  // esc to close
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && overlay && !overlay.classList.contains('hidden')) closeOverlay(); });

  // Reveal listings on scroll using IntersectionObserver
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view','reveal');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.12});
    listings.forEach(li => io.observe(li));
  } else {
    // fallback: reveal all
    listings.forEach(li => li.classList.add('in-view','reveal'));
  }

})();

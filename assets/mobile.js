/* Shared mobile behavior for the Indy automotive prototype */
(function(){
  const MOBILE_BREAKPOINT = 820;

  function setupMobileNav(){
    document.querySelectorAll('.nav').forEach((nav, index) => {
      const inner = nav.querySelector('.w, .wrap');
      const links = nav.querySelector('.links');
      if(!inner || !links || nav.dataset.mobileReady === 'true') return;
      nav.dataset.mobileReady = 'true';
      links.id = links.id || `mobile-nav-links-${index + 1}`;

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'mobile-menu-toggle';
      toggle.setAttribute('aria-label', 'Open navigation menu');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', links.id);
      toggle.innerHTML = '<span></span><span></span><span></span>';
      inner.insertBefore(toggle, links);

      function closeMenu(){
        nav.classList.remove('mobile-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
      }
      function openMenu(){
        nav.classList.add('mobile-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close navigation menu');
      }

      toggle.addEventListener('click', function(){
        nav.classList.contains('mobile-open') ? closeMenu() : openMenu();
      });
      links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
      document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });
      document.addEventListener('click', e => {
        if(window.innerWidth <= MOBILE_BREAKPOINT && nav.classList.contains('mobile-open') && !nav.contains(e.target)) closeMenu();
      });
      window.addEventListener('resize', () => { if(window.innerWidth > MOBILE_BREAKPOINT) closeMenu(); });
    });
  }

  function setupStickyCTA(){
    if(document.querySelector('.mobile-sticky-cta')) return;
    const primary = document.querySelector('.nav .links .btn');
    if(!primary) return;
    const bar = document.createElement('div');
    bar.className = 'mobile-sticky-cta';
    const link = primary.cloneNode(true);
    link.removeAttribute('id');
    bar.appendChild(link);
    document.body.appendChild(bar);
  }

  function addSwipe(target, prevButton, nextButton){
    if(!target || !prevButton || !nextButton || target.dataset.swipeReady === 'true') return;
    target.dataset.swipeReady = 'true';
    let startX = 0;
    let startY = 0;
    target.addEventListener('touchstart', e => {
      const t = e.changedTouches[0];
      startX = t.clientX;
      startY = t.clientY;
    }, {passive:true});
    target.addEventListener('touchend', e => {
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if(Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(dy)) return;
      dx < 0 ? nextButton.click() : prevButton.click();
    }, {passive:true});
  }

  function setupSwipeControls(){
    document.querySelectorAll('.slider').forEach(slider => {
      const scope = slider.closest('section') || document;
      const prev = scope.querySelector('#prev') || slider.querySelector('#prev');
      const next = scope.querySelector('#next') || slider.querySelector('#next');
      addSwipe(slider, prev, next);
    });
    document.querySelectorAll('.process-slider').forEach(slider => {
      addSwipe(slider, document.getElementById('processPrev'), document.getElementById('processNext'));
    });
  }

  function improveAccessibility(){
    document.querySelectorAll('.arrows button,.process-arrows button').forEach((btn, i) => {
      if(!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', i % 2 === 0 ? 'Previous slide' : 'Next slide');
    });
    document.querySelectorAll('.dots button,.process-dots button').forEach((btn, i) => {
      if(!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', `Show slide ${i + 1}`);
    });
  }

  function init(){
    setupMobileNav();
    setupStickyCTA();
    setupSwipeControls();
    improveAccessibility();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

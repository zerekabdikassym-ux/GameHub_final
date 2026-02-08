


(function(){
  
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.09 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);

  
  document.addEventListener('DOMContentLoaded', () => {
    const targets = document.querySelectorAll('.card, .game, .game-card, .sudoku, .profile, .auth-wrap');
    targets.forEach(t => observer.observe(t));

    
    const rippleTargets = document.querySelectorAll('button, .card, .game-card, a.card, .ripple');
    rippleTargets.forEach(el => setupRipple(el));

    
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add('touch-device');
      document.addEventListener('touchstart', e => {
        const el = e.target.closest('.card, .game-card, button, a');
        if (el) {
          el.classList.add('touch-pressed');
          setTimeout(() => el.classList.remove('touch-pressed'), 250);
        }
      }, {passive: true});
    }
  });

  
  function setupRipple(el) {
    if (!el) return;
    el.classList.add('ripple');
    el.addEventListener('pointerdown', (e) => {
      
      if (e.button && e.button !== 0) return;
      const rect = el.getBoundingClientRect();
      const span = document.createElement('span');
      span.className = 'ripple-effect';
      const size = Math.max(rect.width, rect.height) * 0.4;
      span.style.width = span.style.height = size + 'px';
      
      const x = e.clientX - rect.left - size/2;
      const y = e.clientY - rect.top - size/2;
      span.style.left = (x) + 'px';
      span.style.top = (y) + 'px';
      el.appendChild(span);
      
      setTimeout(() => { try { span.remove(); } catch(e){} }, 700);
    }, {passive: true});
  }

  
  let parallaxEl = null;
  let lastScroll = 0;
  function updateParallax() {
    if (!parallaxEl) return;
    const y = window.scrollY;
    
    parallaxEl.style.transform = `translateY(${y * 0.08}px)`;
  }
  window.addEventListener('scroll', () => {
    
    if (lastScroll) return;
    lastScroll = requestAnimationFrame(() => {
      updateParallax();
      lastScroll = 0;
    });
  }, {passive: true});
  
  document.addEventListener('DOMContentLoaded', () => {
    parallaxEl = document.querySelector('.header-parallax');
  });

})();

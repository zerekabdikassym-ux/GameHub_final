
document.addEventListener('DOMContentLoaded', () => {
  
  const toggleBtn = document.getElementById('theme-toggle');

  function setTheme(mode, skipTransition = false) {
    
    if (skipTransition) {
      document.body.style.transition = 'none';
    }
    
    if (mode === 'light') document.body.classList.add('light');
    else document.body.classList.remove('light');
    localStorage.setItem('theme', mode);
    if (toggleBtn) toggleBtn.textContent = mode === 'light' ? 'Dark Mode' : 'Light Mode';
    
    
    if (skipTransition) {
      setTimeout(() => {
        document.body.style.transition = '';
      }, 50);
    }
  }

  
  const saved = localStorage.getItem('theme') || 'dark';
  setTheme(saved, true);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const newMode = document.body.classList.contains('light') ? 'dark' : 'light';
      setTheme(newMode);
    });
  }

  const nav = document.getElementById('main-nav');
  if (nav) {
    let currentPage = location.pathname.split('/').pop();
    if (!currentPage) currentPage = 'index.html';

    const links = nav.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href') || '';
      const hrefFile = href.split('/').pop().split('?')[0].split('#')[0];
      if (hrefFile === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('gameSearch');
  const gamesContainer = document.getElementById('gamesContainer');
  const searchResults = document.getElementById('searchResults');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  if (!searchInput || !gamesContainer) return;
  
  const games = Array.from(gamesContainer.querySelectorAll('.game'));
  let currentCategory = 'all';
  let currentSearchTerm = '';
  
  
  function saveSearchState() {
    localStorage.setItem('gameSearchTerm', currentSearchTerm);
    localStorage.setItem('gameFilterCategory', currentCategory);
  }
  
  
  function loadSearchState() {
    const savedSearchTerm = localStorage.getItem('gameSearchTerm') || '';
    const savedCategory = localStorage.getItem('gameFilterCategory') || 'all';
    
    if (savedSearchTerm) {
      searchInput.value = savedSearchTerm;
      currentSearchTerm = savedSearchTerm;
    }
    
    if (savedCategory !== 'all') {
      currentCategory = savedCategory;
      filterButtons.forEach(btn => {
        if (btn.dataset.category === savedCategory) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
    
    filterGames();
  }
  
  
  function filterGames() {
    let visibleCount = 0;
    
    games.forEach(game => {
      const gameName = game.dataset.name.toLowerCase();
      const gameCategory = game.dataset.category;
      
      const matchesSearch = gameName.includes(currentSearchTerm.toLowerCase());
      const matchesCategory = currentCategory === 'all' || gameCategory === currentCategory;
      
      if (matchesSearch && matchesCategory) {
        game.style.display = 'block';
        game.style.animation = 'fadeIn 0.3s ease';
        visibleCount++;
      } else {
        game.style.display = 'none';
      }
    });
    
    
    updateResultsMessage(visibleCount);
    saveSearchState();
  }
  
  
  function updateResultsMessage(count) {
    if (!searchResults) return;
    
    if (currentSearchTerm || currentCategory !== 'all') {
      if (count === 0) {
        searchResults.textContent = `No games found 😕`;
        searchResults.style.color = 'var(--error-color)';
      } else if (count === 1) {
        searchResults.textContent = `Found ${count} game`;
        searchResults.style.color = 'var(--success-color)';
      } else {
        searchResults.textContent = `Found ${count} games`;
        searchResults.style.color = 'var(--success-color)';
      }
    } else {
      searchResults.textContent = `Showing all ${games.length} games`;
      searchResults.style.color = 'var(--text-color)';
    }
  }
  
  
  searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value;
    filterGames();
  });
  
  
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      currentSearchTerm = '';
      filterGames();
    }
  });
  
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      
      filterButtons.forEach(b => {
        if (b.classList.contains('active')) {
          b.style.background = 'var(--link-color)';
          b.style.color = 'white';
        } else {
          b.style.background = 'transparent';
          b.style.color = 'var(--link-color)';
        }
      });
      
      
      currentCategory = btn.dataset.category;
      filterGames();
    });
    
    
    btn.addEventListener('mouseenter', () => {
      if (!btn.classList.contains('active')) {
        btn.style.background = 'var(--card-hover-bg)';
      }
    });
    
    btn.addEventListener('mouseleave', () => {
      if (!btn.classList.contains('active')) {
        btn.style.background = 'transparent';
      }
    });
  });
  
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(style);
  
  
  loadSearchState();
});


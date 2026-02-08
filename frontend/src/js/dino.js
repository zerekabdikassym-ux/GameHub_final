
const game = document.getElementById('game');
const dino = document.getElementById('dino');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart');

let isJumping = false;
let position = 20; 
let gameOver = false;
let score = 0;
let cactusTimer;

function createCactus() {
  if (gameOver) return;
  const cactus = document.createElement('div');
  cactus.className = 'cactus';
  game.appendChild(cactus);

  let cactusLeft = game.offsetWidth;
  cactus.style.left = cactusLeft + 'px';

  const speed = 6 + Math.random() * 4;
  function move() {
    if (gameOver) {
      cactus.remove();
      return;
    }
    cactusLeft -= speed;
    cactus.style.left = cactusLeft + 'px';

    
    const dinoRect = dino.getBoundingClientRect();
    const cactusRect = cactus.getBoundingClientRect();
    if (
      cactusRect.left < dinoRect.right &&
      cactusRect.right > dinoRect.left &&
      cactusRect.top < dinoRect.bottom &&
      cactusRect.bottom > dinoRect.top
    ) {
      endGame();
    }

    
    if (cactusLeft < -50) {
      cactus.remove();
      score += 10;
      scoreEl.textContent = 'Score: ' + score;
    } else {
      requestAnimationFrame(move);
    }
  }
  requestAnimationFrame(move);

  
  cactusTimer = setTimeout(createCactus, 900 + Math.random() * 1600);
}

function jump() {
  if (isJumping || gameOver) return;
  isJumping = true;
  let upInterval = setInterval(() => {
    if (position >= 120) {
      clearInterval(upInterval);
      let downInterval = setInterval(() => {
        if (position <= 20) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          position -= 8;
          dino.style.bottom = position + 'px';
        }
      }, 20);
    } else {
      position += 12;
      dino.style.bottom = position + 'px';
    }
  }, 20);
}

function endGame() {
  gameOver = true;
  clearTimeout(cactusTimer);
  alert('Game over. Score: ' + score);
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    jump();
  }
});

restartBtn.addEventListener('click', () => {
  
  document.querySelectorAll('.cactus').forEach(c => c.remove());
  gameOver = false;
  score = 0;
  scoreEl.textContent = 'Score: 0';
  position = 20;
  dino.style.bottom = position + 'px';
  createCactus();
});

createCactus();

function endGame() {
  gameOver = true;
  clearTimeout(cactusTimer);
  submitScore('dino', score); // Submit score to backend
  alert('Game over. Score: ' + score);
}

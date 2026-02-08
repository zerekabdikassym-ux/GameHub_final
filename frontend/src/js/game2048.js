
const size = 4;
let grid = Array(size).fill().map(() => Array(size).fill(0));
let score = 0;


const tileColors = {
  0: 'var(--card-hover-bg)',
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
  4096: '#3c3a32',
  8192: '#3c3a32'
};

const textColors = {
  2: '#776e65',
  4: '#776e65'
};

function draw(){
  const table = document.getElementById("grid");
  table.innerHTML = "";
  
  grid.forEach(row => {
    const tr = document.createElement("tr");
    row.forEach(value => {
      const td = document.createElement("td");
      td.textContent = value || "";
      
      
      const bgColor = tileColors[value] || '#3c3a32';
      const color = value <= 4 ? (textColors[value] || '#f9f6f2') : '#f9f6f2';
      
      td.style.background = bgColor;
      td.style.color = color;
      td.style.fontWeight = 'bold';
      
      
      if (value > 0) {
        td.classList.add('tile-active');
      }
      
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  
  document.getElementById("score").textContent = "Score: " + score;
  
  
  if (isGameOver()) {
    setTimeout(() => {
      alert("Game Over! Your score: " + score + "\nReload to play again.");
    }, 200);
  } else if (hasWon()) {
    submitScore('game2048', score); // Submit score to backend
    setTimeout(() => {
      if (confirm("You won! Score: " + score + "\nContinue playing?")) {
        
      } else {
        location.reload();
      }
    }, 200);
  }
``

function addTile() {
  const empty = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) empty.push([r, c]);
    }
  }
  
  if (empty.length > 0) {
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
}

function slideAndMerge(line) {
  
  let newLine = line.filter(val => val !== 0);
  
  
  for (let i = 0; i < newLine.length - 1; i++) {
    if (newLine[i] === newLine[i + 1]) {
      newLine[i] *= 2;
      score += newLine[i];
      newLine.splice(i + 1, 1);
    }
  }
  
  
  while (newLine.length < size) {
    newLine.push(0);
  }
  
  return newLine;
}

function moveLeft() {
  let moved = false;
  const newGrid = grid.map(row => {
    const newRow = slideAndMerge(row);
    if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
    return newRow;
  });
  grid = newGrid;
  return moved;
}

function moveRight() {
  let moved = false;
  const newGrid = grid.map(row => {
    const reversed = row.slice().reverse();
    const merged = slideAndMerge(reversed);
    const newRow = merged.reverse();
    if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
    return newRow;
  });
  grid = newGrid;
  return moved;
}

function moveUp() {
  let moved = false;
  const newGrid = Array(size).fill().map(() => Array(size).fill(0));
  
  for (let c = 0; c < size; c++) {
    const column = grid.map(row => row[c]);
    const merged = slideAndMerge(column);
    
    if (JSON.stringify(column) !== JSON.stringify(merged)) moved = true;
    
    for (let r = 0; r < size; r++) {
      newGrid[r][c] = merged[r];
    }
  }
  
  grid = newGrid;
  return moved;
}

function moveDown() {
  let moved = false;
  const newGrid = Array(size).fill().map(() => Array(size).fill(0));
  
  for (let c = 0; c < size; c++) {
    const column = grid.map(row => row[c]);
    const reversed = column.slice().reverse();
    const merged = slideAndMerge(reversed);
    const newColumn = merged.reverse();
    
    if (JSON.stringify(column) !== JSON.stringify(newColumn)) moved = true;
    
    for (let r = 0; r < size; r++) {
      newGrid[r][c] = newColumn[r];
    }
  }
  
  grid = newGrid;
  return moved;
}

function isGameOver() {
  
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 0) return false;
    }
  }
  
  
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const current = grid[r][c];
      if (c < size - 1 && grid[r][c + 1] === current) return false;
      if (r < size - 1 && grid[r + 1][c] === current) return false;
    }
  }
  
  return true;
}

function hasWon() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 2048) return true;
    }
  }
  return false;
}

function handleMove(direction) {
  let moved = false;
  
  switch(direction) {
    case 'left':
      moved = moveLeft();
      break;
    case 'right':
      moved = moveRight();
      break;
    case 'up':
      moved = moveUp();
      break;
    case 'down':
      moved = moveDown();
      break;
  }
  
  if (moved) {
    addTile();
    draw();
  }
}


document.addEventListener("keydown", e => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
  
  switch(e.key) {
    case "ArrowLeft":
      handleMove('left');
      break;
    case "ArrowRight":
      handleMove('right');
      break;
    case "ArrowUp":
      handleMove('up');
      break;
    case "ArrowDown":
      handleMove('down');
      break;
  }
});


let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const gameContainer = document.getElementById("grid");

gameContainer.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

gameContainer.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const minSwipeDistance = 30;
  
  
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    
    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        handleMove('right');
      } else {
        handleMove('left');
      }
    }
  } else {
    
    if (Math.abs(deltaY) > minSwipeDistance) {
      if (deltaY > 0) {
        handleMove('down');
      } else {
        handleMove('up');
      }
    }
  }
}


addTile();
addTile();
draw();

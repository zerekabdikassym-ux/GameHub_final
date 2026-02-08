
const boardEl = document.getElementById('board');
const newBtn = document.getElementById('newPuzzle');
const checkBtn = document.getElementById('check');
const solveBtn = document.getElementById('solve');
const diffSel = document.getElementById('difficulty');
const message = document.getElementById('message');

let solution = []; 
let puzzle = [];   

function deepCopy(a){ return a.map(r => r.slice()); }


const base = [
  [1,2,3,4,5,6,7,8,9],
  [4,5,6,7,8,9,1,2,3],
  [7,8,9,1,2,3,4,5,6],
  [2,3,4,5,6,7,8,9,1],
  [5,6,7,8,9,1,2,3,4],
  [8,9,1,2,3,4,5,6,7],
  [3,4,5,6,7,8,9,1,2],
  [6,7,8,9,1,2,3,4,5],
  [9,1,2,3,4,5,6,7,8]
];

function shuffleArray(a) {
  for (let i = a.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function permuteBase() {
  
  let g = deepCopy(base);

  
  for (let band=0; band<3; band++) {
    const rows = [0,1,2].map(i => band*3+i);
    shuffleArray(rows);
    const newBand = rows.map(r => g[r]);
    for (let i=0;i<3;i++) g[band*3+i] = newBand[i];
  }
  
  
  g = transpose(g);
  for (let stack=0; stack<3; stack++) {
    const cols = [0,1,2].map(i => stack*3+i);
    shuffleArray(cols);
    const newStack = cols.map(c => g[c]);
    for (let i=0;i<3;i++) g[stack*3+i] = newStack[i];
  }
  g = transpose(g);

  
  const map = [1,2,3,4,5,6,7,8,9];
  shuffleArray(map);
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) g[r][c] = map[g[r][c]-1];

  return g;
}

function transpose(m) {
  const res = Array(9).fill().map(()=>Array(9).fill(0));
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) res[c][r]=m[r][c];
  return res;
}

function makePuzzle(difficulty='medium') {
  solution = permuteBase();
  puzzle = deepCopy(solution);
  
  let removeCount = difficulty==='easy'? 36 : difficulty==='hard'? 50 : 44;
  const coords = [];
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) coords.push([r,c]);
  shuffleArray(coords);
  for (let i=0;i<removeCount;i++) {
    const [r,c] = coords[i];
    puzzle[r][c] = 0;
  }
  renderBoard();
}

function renderBoard() {
  boardEl.innerHTML = '';
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
    const wrap = document.createElement('div');
    wrap.className = 'cell';
    
    if ((c+1)%3===0 && c!==8) wrap.classList.add('box-right');
    if ((r+1)%3===0 && r!==8) wrap.classList.add('box-bottom');

    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.dataset.r = r; input.dataset.c = c;

    if (puzzle[r][c] !== 0) {
      input.value = puzzle[r][c];
      input.disabled = true;
      wrap.classList.add('given');
    } else input.value = '';

    input.addEventListener('input', onInput);
    wrap.appendChild(input);
    boardEl.appendChild(wrap);
  }
  message.textContent = '';
  checkConflicts(); 
}

function onInput(e) {
  const v = e.target.value.replace(/[^1-9]/g,'');
  e.target.value = v;
  checkConflicts();
}

function getBoardValues() {
  const vals = Array(9).fill().map(()=>Array(9).fill(0));
  const inputs = boardEl.querySelectorAll('input');
  inputs.forEach(inp=>{
    const r = +inp.dataset.r, c = +inp.dataset.c;
    const v = parseInt(inp.value) || 0;
    vals[r][c] = v;
  });
  return vals;
}

function checkConflicts() {
  
  boardEl.querySelectorAll('.cell').forEach(cell=>cell.classList.remove('conflict'));
  const vals = getBoardValues();
  
  for (let r=0;r<9;r++) {
    const seen = {};
    for (let c=0;c<9;c++){
      const v = vals[r][c];
      if (!v) continue;
      if (seen[v]) {
        
        markCellsWithValue(r, c, 'row', v, vals);
      } else seen[v]=true;
    }
  }
  
  for (let c=0;c<9;c++) {
    const seen = {};
    for (let r=0;r<9;r++){
      const v = vals[r][c];
      if (!v) continue;
      if (seen[v]) markCellsWithValue(r, c, 'col', v, vals);
      else seen[v]=true;
    }
  }
  
  for (let br=0;br<3;br++) for (let bc=0;bc<3;bc++){
    const seen = {};
    for (let r=br*3;r<br*3+3;r++) for (let c=bc*3;c<bc*3+3;c++){
      const v = vals[r][c];
      if (!v) continue;
      if (seen[v]) markCellsWithValue(r, c, 'box', v, vals);
      else seen[v]=true;
    }
  }
}

function markCellsWithValue(r0,c0, type, val, vals) {
  
  if (type==='row') {
    for (let c=0;c<9;c++) if (vals[r0][c]===val) markCell(r0,c);
  } else if (type==='col') {
    for (let r=0;r<9;r++) if (vals[r][c0]===val) markCell(r,c0);
  } else {
    const br = Math.floor(r0/3)*3, bc = Math.floor(c0/3)*3;
    for (let r=br;r<br+3;r++) for (let c=bc;c<bc+3;c++) if (vals[r][c]===val) markCell(r,c);
  }
}

function markCell(r,c) {
  const idx = r*9 + c;
  const cell = boardEl.children[idx];
  if (cell) cell.classList.add('conflict');
}

function checkSolution() {
  const vals = getBoardValues();
  
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
    if (vals[r][c] === 0) {
      message.textContent = 'There are empty cells.';
      return false;
    }
    if (vals[r][c] !== solution[r][c]) {
      message.textContent = 'Solution is incorrect.';
      return false;
    }
  }
  message.textContent = 'Congratulations! Puzzle solved.';
  submitScore('sudoku', 100);
  return true;
}

newBtn.addEventListener('click', () => {
  const diff = diffSel.value;
  makePuzzle(diff);
});

checkBtn.addEventListener('click', () => {
  checkConflicts();
  
  const anyConflict = boardEl.querySelector('.cell.conflict');
  if (anyConflict) {
    message.textContent = 'There are conflicts. Fix them.';
    return;
  }
  
  const filled = getBoardValues();
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) if (filled[r][c] === 0) {
    message.textContent = 'There are empty cells.';
    return;
  }
  
  let ok = true;
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) if (filled[r][c] !== solution[r][c]) ok = false;
  if (ok) {
    message.textContent = 'Correct solution! Well done.';
    submitScore('sudoku', 100);
  } else {
    message.textContent = 'Solution is incorrect.';
  }
});

solveBtn.addEventListener('click', () => {
  
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
    const idx = r*9 + c;
    const input = boardEl.children[idx].querySelector('input');
    input.value = solution[r][c];
  }
  checkConflicts();
  message.textContent = 'Solved (filled).';
});


makePuzzle('medium');

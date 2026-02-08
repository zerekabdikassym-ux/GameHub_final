
const board = document.getElementById("board");
let cells = Array(9).fill("");
let current = "X";
const turnText = document.getElementById("turn");
let scoreSubmitted = false;


for (let i = 0; i < 9; i++) {
  const div = document.createElement("div");
  div.className = "cell";
  div.addEventListener("click", () => move(i, div));
  board.appendChild(div);
}

function move(i, cell) {
  if (cells[i] || checkWin()) return;
  cells[i] = current;
  cell.textContent = current;
  if (checkWin()) {
    turnText.textContent = "Winner: " + current + "!";
    // 1 point for a win
    if (!scoreSubmitted && typeof submitScore === 'function') {
      scoreSubmitted = true;
      submitScore('tictactoe', 1);
    }
    return;
  }
  current = current === "X" ? "O" : "X";
  turnText.textContent = "Current Player: " + current;
}

function checkWin() {
  const win = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return win.some(([a,b,c]) => cells[a] && cells[a]==cells[b] && cells[a]==cells[c]);
}

document.getElementById("reset").onclick = () => {
  cells = Array(9).fill("");
  document.querySelectorAll(".cell").forEach(c => c.textContent = "");
  current = "X";
  turnText.textContent = "Current Player: X";
  scoreSubmitted = false;
};

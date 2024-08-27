document.addEventListener("DOMContentLoaded", () => {
  const minesweeper = document.getElementById("game-board");
  const resetButton = document.getElementById("reset-button");
  const messageElement = document.getElementById("message");
  const rows = 10;
  const cols = 10;
  const minesCount = 20;
  let cells = [];
  let gameOver = false;

  // Check if the minesweeper element exists
  if (!minesweeper) {
    console.error("Minesweeper board not found!");
    return;
  }

  function createBoard() {
    // Create the game board
    minesweeper.innerHTML = ""; // Clear any existing board content
    for (let i = 0; i < rows; i++) {
      cells[i] = [];
      for (let j = 0; j < cols; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.addEventListener("click", revealCell);
        minesweeper.appendChild(cell);
        cells[i][j] = cell;
      }
    }
    placeMines();
  }

  function placeMines() {
    // Randomly places mines on board
    let placedMines = 0;
    while (placedMines < minesCount) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (!cells[row][col].classList.contains("mine")) {
        cells[row][col].classList.add("mine");
        placedMines++;
      }
    }
  }

  function revealCell(event) {
    // Reveal the clicked cell
    if (gameOver) return; // Do not reveal if game is over

    const cell = event.target;
    if (cell.classList.contains("revealed")) return; // Avoid revealing the same cell twice
    cell.classList.add("revealed");

    if (cell.classList.contains("mine")) {
      cell.textContent = "💣";
      endGame(false); // End game if a mine is clicked
    } else {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      const mines = countMines(row, col);
      if (mines > 0) {
        cell.textContent = mines;
      } else {
        revealAdjacentCells(row, col);
      }
    }
  }

  function countMines(row, col) {
    // Count the number of mines around the cell
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const r = row + i;
        const c = col + j;
        if (
          r >= 0 &&
          r < rows &&
          c >= 0 &&
          c < cols &&
          cells[r][c].classList.contains("mine")
        ) {
          count++;
        }
      }
    }
    return count;
  }

  function revealEmptyCells(row, col) {
    // Reveal all empty cells around the cell
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const r = row + i;
        const c = col + j;
        if (
          r >= 0 &&
          r < rows &&
          c >= 0 &&
          c < cols &&
          !cells[r][c].classList.contains("revealed")
        ) {
          cells[r][c].classList.add("revealed");
          if (!cells[r][c].classList.contains("mine")) {
            const mines = countMines(r, c);
            if (mines > 0) {
              cells[r][c].textContent = mines;
            } else {
              // Instead of triggering a click event, call revealEmptyCells directly
              revealEmptyCells(r, c);
            }
          }
        }
      }
    }
  }

  function revealAllMines() {
    // Reveal all mines on the board when the gane is over
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (cells[i][j].classList.contains("mine")) {
          cells[i][j].classList.add("revealed");
          cells[i][j].textContent = "💣"; // Use an emoji or any other representation for mines
        }
      }
    }
  }

  function checkWin() {
    // Check if the player has won
  }

  function endGame(won) {
    gameOver = true;
    revealAllMines();
    const message = won ? "Congratulations, you won!" : "Game Over!";
    messageElement.textContent = message;
  }

  // New function to reset the game board
  function resetBoard() {
    createBoard(); // Call the createBoard function to reset the board
  }

  // Event listener for reset button
  resetButton.addEventListener("click", resetBoard);

  // Initialize the game board when the page loads
  createBoard();
});

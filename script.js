
//Construction of the canvas drawing
const $ = document.querySelector("canvas").getContext("2d");
const scoreElem = document.querySelector(".score");
//button construction
const buttonPlay = document.querySelector(".playButton");
//Player's name
const playerName = document.querySelector("#playerName");

// measurements of the grid and the color of the lines
const rows = 20;
const cols = 10;
//Board size
const size = 20; 
const empty = "black";

//Start now
let dropStart = Date.now();
let gameOver = false;

//
function drawSquare(x, y, color) {
  $.fillStyle = color; //fillStyle
  $.fillRect(x * size, y * size, size, size);

  $.strokeStyle = "#999";
  $.strokeRect(x * size, y * size, size, size);
}


//Construction of the matrix with each rotation of the 7 tetromino of the game
const I = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0]
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0]
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0]
  ]
];

const J = [
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  [
    [0, 1, 1],
    [0, 1, 0],
    [0, 1, 0]
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 1]
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0]
  ]
];

const L = [
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [1, 0, 0]
  ],
  [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0]
  ]
];

const O = [
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ]
];

const S = [
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 0, 1]
  ],
  [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0]
  ]
];

const T = [
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 0]
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0]
  ]
];

const Z = [
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
  [
    [0, 0, 1],
    [0, 1, 1],
    [0, 1, 0]
  ],
  [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [1, 0, 0]
  ]
];



//Creation of the empty matrix game board
let board = [];
for (let r = 0; r < rows; r++) {
  board[r] = [];
  for (let c = 0; c < cols; c++) {
    board[r][c] = empty;
  }
}
function drawBoard() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      drawSquare(c, r, board[r][c]);
    }
  }
}
drawBoard();


//Pieces and their colors
const P = [
  [Z, "red"],
  [S, "green"],
  [T, "yellow"],
  [O, "blue"],
  [L, "purple"],
  [I, "cyan"],
  [J, "orange"]
];

//Function to show the lines and add points use of this
let score = 0;
class Piece {
  constructor(tetro, color) {
    //This accesses the classes
    this.tetro = tetro; 
    this.color = color;

    //Start from first pattern
    this.tetroN = 0; 
    this.tetroA = this.tetro[this.tetroN]; //Active tetromino

    //Control pieces
    this.x = 3;
    this.y = -2;
  }

  fill(color) {
    for (let r = 0; r < this.tetroA.length; r++) {
      for (let c = 0; c < this.tetroA.length; c++) {
        //Draw occupied squares
        if (this.tetroA[r][c]) {
          drawSquare(this.x + c, this.y + r, color);
        }
      }
    }
  }

  draw() {
    this.fill(this.color);
  }

  undraw() {
    this.fill(empty);
  }
 //Movement of the pieces
  move(direction) {
    switch (direction) {
      case "down":
        if (!this.collision(0, 1, this.tetroA)) {
          this.undraw();
          this.y++;
          this.draw();
        } else {
          //Lock piece and draw new
          this.lock();
          p = randomPiece();
        }
        break;
      case "right":
        if (!this.collision(1, 0, this.tetroA)) {
          this.undraw();
          this.x++;
          this.draw();
        }
        break;
      case "left":
        if (!this.collision(-1, 0, this.tetroA)) {
          this.undraw();
          this.x--;
          this.draw();
        }
        break;
    }
  }
 //Rotation of the pieces in their 4 possible positions
  rotate() {
    let nextPattern = this.tetro[(this.tetroN + 1) % this.tetro.length];
    let kick = 0;

    if (this.collision(0, 0, nextPattern)) {
      this.x > C / 2
        ? // right wall
        // move piece to left
        (kick = -1)
        : // left wall
        // move piece to right
        (kick = 1);
    }

    if (!this.collision(kick, 0, nextPattern)) {
      this.undraw();
      this.x += kick;
      this.tetroN = (this.tetroN + 1) % this.tetro.length; // (0+1)%4 = 1
      this.tetroA = this.tetro[this.tetroN];
      this.draw();
    }
  }

  lock() {
    for (let r = 0; r < this.tetroA.length; r++) {
      for (let c = 0; c < this.tetroA.length; c++) {
        // skip empty squares
        if (!this.tetroA[r][c]) continue;

        // pieces locked on top - game over
        if (this.y + r < 0) {
          gameOver = true;
          break;
        }
        // lock piece
        board[this.y + r][this.x + c] = this.color;
      }
    }

    // remove full rows
    for (let r = 0; r < rows; r++) {
      let isRowFull = true;
      for (let c = 0; c < cols; c++) {
        isRowFull = isRowFull && board[r][c] != empty;
      }
      if (isRowFull) {
        // move down all rows above
        for (let y = r; y > 1; y--) {
          for (let c = 0; c < cols; c++) {
            board[y][c] = board[y - 1][c];
          }
        }

        // top row has no row above
        for (let c = 0; c < cols; c++) board[0][c] = empty;

        score += 10;
      }
    }

    drawBoard();
    scoreElem.textContent = score;
  }

  collision(x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece.length; c++) {
        // skip empty square
        if (!piece[r][c]) continue;

        // coordinates after movement
        let newX = this.x + c + x;
        let newY = this.y + r + y;

        if (newX < 0 || newX >= cols || newY >= rows) return true;

        // newY < 0; board[-1] will crash game
        if (newY < 0) continue;

        // check locked piece
        if (board[newY][newX] != empty) return true;
      }
    }
    return false;
  }
}
// Math random function so that the pieces come out randomly
function randomPiece() {
  let r = Math.floor(Math.random() * P.length); // 0 -> 6
  return new Piece(P[r][0], P[r][1]);
}
let p = randomPiece();

// Keyboard event for manipulating parts
document.addEventListener("keydown", (event) => {
  switch (event.keyCode) {
    case 37:
      p.move("left");
      dropStart = Date.now();
      break;
    case 38:
      p.rotate();
      dropStart = Date.now();
      break;
    case 39:
      p.move("right");
      dropStart = Date.now();
      break;
    case 40:
      p.move("down");
      break;
  }
});


buttonPlay.addEventListener("click", () => {
  const name = prompt("Digita tu nombre");
  playerName.textContent = `Player: ${name}`

  drop();
});

//Start game
function drop() {
  let now = Date.now();
  let delta = now - dropStart;
  if (delta > 1000) {
    p.move("down");
    dropStart = Date.now();
  }

  !gameOver ? requestAnimationFrame(drop) : location.reload();
}



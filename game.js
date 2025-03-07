const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const BLOCK_SIZE = 20;
const ROWS = canvas.height / BLOCK_SIZE;
const COLS = canvas.width / BLOCK_SIZE;

let board = [];
for (let i = 0; i < ROWS; i++) {
    board[i] = [];
    for (let j = 0; j < COLS; j++) {
        board[i][j] = 0;
    }
}

const SHAPES = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 1], [0, 1, 0]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1, 1], [0, 0, 1]]
];

const COLORS = [
    '#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'
];

let currentPiece;
let currentX;
let currentY;
let score = 0;

function newPiece() {
    const randomIndex = Math.floor(Math.random() * SHAPES.length);
    currentPiece = SHAPES[randomIndex];
    currentX = Math.floor(COLS / 2) - Math.floor(currentPiece[0].length / 2);
    currentY = 0;
}

function drawBoard() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (board[i][j]) {
                ctx.fillStyle = COLORS[board[i][j] - 1];
                ctx.fillRect(j * BLOCK_SIZE, i * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function drawPiece() {
    for (let i = 0; i < currentPiece.length; i++) {
        for (let j = 0; j < currentPiece[i].length; j++) {
            if (currentPiece[i][j]) {
                ctx.fillStyle = COLORS[SHAPES.indexOf(currentPiece)];
                ctx.fillRect((currentX + j) * BLOCK_SIZE, (currentY + i) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function canMove(piece, x, y) {
    for (let i = 0; i < piece.length; i++) {
        for (let j = 0; j < piece[i].length; j++) {
            if (piece[i][j]) {
                const newX = x + j;
                const newY = y + i;
                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX])) {
                    return false;
                }
            }
        }
    }
    return true;
}

function mergePiece() {
    for (let i = 0; i < currentPiece.length; i++) {
        for (let j = 0; j < currentPiece[i].length; j++) {
            if (currentPiece[i][j]) {
                board[currentY + i][currentX + j] = SHAPES.indexOf(currentPiece) + 1;
            }
        }
    }
}

function clearLines() {
    for (let i = 0; i < ROWS; i++) {
        let isLineFull = true;
        for (let j = 0; j < COLS; j++) {
            if (!board[i][j]) {
                isLineFull = false;
                break;
            }
        }
        if (isLineFull) {
            score += 100;
            document.getElementById('score').textContent = score;
            board.splice(i, 1);
            board.unshift(new Array(COLS).fill(0));
        }
    }
}

function rotate(piece) {
    const newPiece = [];
    for (let i = 0; i < piece[0].length; i++) {
        newPiece[i] = [];
        for (let j = piece.length - 1; j >= 0; j--) {
            newPiece[i][piece.length - 1 - j] = piece[j][i];
        }
    }
    return newPiece;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece();

    if (canMove(currentPiece, currentX, currentY + 1)) {
        currentY++;
    } else {
        mergePiece();
        clearLines();
        newPiece();
        if (!canMove(currentPiece, currentX, currentY)) {
            alert('游戏结束！得分：' + score);
            score = 0;
            document.getElementById('score').textContent = score;
            for (let i = 0; i < ROWS; i++) {
                for (let j = 0; j < COLS; j++) {
                    board[i][j] = 0;
                }
            }
            newPiece();
        }
    }

    setTimeout(gameLoop, 300);
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            if (canMove(currentPiece, currentX - 1, currentY)) {
                currentX--;
            }
            break;
        case 'ArrowRight':
            if (canMove(currentPiece, currentX + 1, currentY)) {
                currentX++;
            }
            break;
        case 'ArrowDown':
            if (canMove(currentPiece, currentX, currentY + 1)) {
                currentY++;
            }
            break;
        case 'ArrowUp':
            const rotatedPiece = rotate(currentPiece);
            if (canMove(rotatedPiece, currentX, currentY)) {
                currentPiece = rotatedPiece;
            }
            break;
    }
});

newPiece();
gameLoop();
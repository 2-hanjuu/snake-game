const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// 캔버스를 브라우저 창 크기에 맞게 조절
function resizeCanvas() {
  // grid 단위로 딱 맞게 조정
  canvas.width = Math.floor(window.innerWidth / grid) * grid;
  canvas.height = Math.floor(window.innerHeight / grid) * grid;
}

const grid = 20;
let count = 0;
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
let snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};
let apple = {
  x: 320,
  y: 320
};

// 폭탄(먹으면 길이가 줄어듦)
let bomb = {
  x: 160,
  y: 160
};
let score = 0;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  if (++count < 8) return; // 속도를 0.5배 느리게
  count = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0) snake.x = canvas.width - grid;
  else if (snake.x >= canvas.width) snake.x = 0;
  if (snake.y < 0) snake.y = canvas.height - grid;
  else if (snake.y >= canvas.height) snake.y = 0;

  snake.cells.unshift({x: snake.x, y: snake.y});
  if (snake.cells.length > snake.maxCells) snake.cells.pop();

  // 사과 그리기
  ctx.fillStyle = '#e53935';
  ctx.fillRect(apple.x, apple.y, grid-2, grid-2);

  // 폭탄 그리기
  ctx.fillStyle = '#ffd600';
  ctx.fillRect(bomb.x, bomb.y, grid-2, grid-2);

  ctx.fillStyle = '#4caf50';
  snake.cells.forEach((cell, index) => {
    ctx.fillRect(cell.x, cell.y, grid-2, grid-2);
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      // 사과 위치 재설정 (현재 캔버스 크기에 맞게)
      apple.x = getRandomInt(0, canvas.width / grid) * grid;
      apple.y = getRandomInt(0, canvas.height / grid) * grid;
    }
    // 폭탄 먹었을 때
    if (cell.x === bomb.x && cell.y === bomb.y) {
      if (snake.maxCells > 1) snake.maxCells--;
      // 폭탄 위치 재설정 (현재 캔버스 크기에 맞게)
      bomb.x = getRandomInt(0, canvas.width / grid) * grid;
      bomb.y = getRandomInt(0, canvas.height / grid) * grid;
    }
    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        score = 0;
        // 사과, 폭탄 위치 모두 재설정 (현재 캔버스 크기에 맞게)
        apple.x = getRandomInt(0, canvas.width / grid) * grid;
        apple.y = getRandomInt(0, canvas.height / grid) * grid;
        bomb.x = getRandomInt(0, canvas.width / grid) * grid;
        bomb.y = getRandomInt(0, canvas.height / grid) * grid;
      }
    }
  });

  ctx.fillStyle = '#fff';
  ctx.font = '18px Arial';
  ctx.fillText('Score: ' + score, 10, 390);
}

document.addEventListener('keydown', function(e) {
  // 방향키 입력 시 스크롤 방지
  if (["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(e.key)) {
    e.preventDefault();
  }
  if (e.key === 'ArrowLeft' && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.key === 'ArrowUp' && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.key === 'ArrowRight' && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.key === 'ArrowDown' && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

gameLoop();

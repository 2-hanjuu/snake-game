const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// 캔버스 크기를 최초 버전의 2배(800x800)로 고정
const grid = 20;
let count = 0;
canvas.width = 800;
canvas.height = 800;
let snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};
// 사과와 폭탄을 배열로 관리
let apples = [];
let bombs = [];

function randomizeFruits() {
  // 사과와 폭탄 개수(1~2개 랜덤)
  const fruitCount = getRandomInt(1, 3);
  apples = [];
  bombs = [];
  for (let i = 0; i < fruitCount; i++) {
    apples.push({
      x: getRandomInt(0, canvas.width / grid) * grid,
      y: getRandomInt(0, canvas.height / grid) * grid
    });
    bombs.push({
      x: getRandomInt(0, canvas.width / grid) * grid,
      y: getRandomInt(0, canvas.height / grid) * grid
    });
  }
}

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

  // 사과 그리기 (여러 개)
  ctx.fillStyle = '#e53935';
  apples.forEach(apple => {
    ctx.fillRect(apple.x, apple.y, grid-2, grid-2);
  });

  // 폭탄 그리기 (여러 개)
  ctx.fillStyle = '#ffd600';
  bombs.forEach(bomb => {
    ctx.fillRect(bomb.x, bomb.y, grid-2, grid-2);
  });

  ctx.fillStyle = '#4caf50';
  snake.cells.forEach((cell, index) => {
    ctx.fillRect(cell.x, cell.y, grid-2, grid-2);
    // 여러 사과 체크
    apples.forEach((apple, appleIdx) => {
      if (cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;
        score++;
        // 사과 위치 재설정
        apples[appleIdx].x = getRandomInt(0, canvas.width / grid) * grid;
        apples[appleIdx].y = getRandomInt(0, canvas.height / grid) * grid;
        // 사과/폭탄 개수도 다시 랜덤화
        randomizeFruits();
      }
    });
    // 여러 폭탄 체크
    bombs.forEach((bomb, bombIdx) => {
      if (cell.x === bomb.x && cell.y === bomb.y) {
        if (snake.maxCells > 1) snake.maxCells--;
        // 폭탄 위치 재설정
        bombs[bombIdx].x = getRandomInt(0, canvas.width / grid) * grid;
        bombs[bombIdx].y = getRandomInt(0, canvas.height / grid) * grid;
        // 사과/폭탄 개수도 다시 랜덤화
        randomizeFruits();
      }
    });
    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        score = 0;
        // 사과, 폭탄 모두 랜덤화
        randomizeFruits();
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

// 게임 시작 시 과일/폭탄 랜덤화
randomizeFruits();
gameLoop();

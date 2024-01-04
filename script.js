// Define HTML elements

const board = document.getElementById('game-board');
const infoText = document.getElementById('info-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Draw game map, snake and food
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}

// Draw snake

function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

//Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Testing Draw Func
// draw();

// Draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// Generate food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Moving Snake
function moveSnake() {
  const head = { ...snake[0] };
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'right':
      head.x++;
      break;
    case 'left':
      head.x--;
      break;
    case 'down':
      head.y++;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y == food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); // Clear past interval
    gameInterval = setInterval(() => {
      moveSnake();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

//start game func
function startGame() {
  gameStarted = true; // Keep track of running game
  infoText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    moveSnake();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Keypress event listener

function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.key === ' ')
  ) {
    startGame();
  } else {
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  infoText.style.display = 'block';
  logo.style.display = 'block';
}

// test moving

// setInterval(() => {
//   moveSnake(); //Move first
//   draw(); // Then draw again new position
// }, 200);

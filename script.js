// Canvas
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Game variables
let snake = [{ x: 200, y: 200 }, { x: 190, y: 200 }, { x: 180, y: 200 }];
let food = { x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10 };
let score = 0;
let highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
let direction = 'right';
let gameRunning = false;
let gameInterval = null;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameContainer = document.querySelector('.game-container');
const gameOverScreen = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');
const newRecordEl = document.getElementById('new-record');
document.getElementById('high-score').textContent = highScore;

// Start Button
document.getElementById('start-btn').addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    startGame();
});

// Game loop
function gameLoop() {
    drawBoard();
    drawSnake();
    drawFood();
    updateGameState();
}

// Start game
function startGame() {
    gameRunning = true;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 150);
}

// Restart game
function restartGame() {
    snake = [{ x: 200, y: 200 }, { x: 190, y: 200 }, { x: 180, y: 200 }];
    food = { x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10 };
    score = 0;
    direction = 'right';
    gameRunning = true;
    document.getElementById('score').textContent = score;
    gameOverScreen.style.display = 'none';
    startGame();
}

// Draw Board
function drawBoard() {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

// Draw Snake
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#059669' : '#10b981';
        ctx.fillRect(segment.x + 1, segment.y + 1, 8, 8);

        if (index === 0) {
            ctx.fillStyle = 'white';
            ctx.fillRect(segment.x + 2, segment.y + 2, 1, 1);
            ctx.fillRect(segment.x + 5, segment.y + 2, 1, 1);
        }
    });
}

// Draw Food
function drawFood() {
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(food.x + 1, food.y + 1, 8, 8);
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(food.x + 2, food.y + 2, 2, 2);
}

// Update Game State
function updateGameState() {
    if (!gameRunning) return;

    for (let i = snake.length - 1; i > 0; i--) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
    }

    switch(direction){
        case 'up': snake[0].y -= 10; break;
        case 'down': snake[0].y += 10; break;
        case 'left': snake[0].x -= 10; break;
        case 'right': snake[0].x += 10; break;
    }

    // Food collision
    if(snake[0].x === food.x && snake[0].y === food.y){
        score++;
        document.getElementById('score').textContent = score;
        snake.push({ ...snake[snake.length-1] });

        do {
            food = { x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10 };
        } while(snake.some(s => s.x === food.x && s.y === food.y));
    }

    // Wall collision
    if(snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height){
        gameOver();
    }

    // Self collision
    for(let i=1;i<snake.length;i++){
        if(snake[0].x === snake[i].x && snake[0].y === snake[i].y){
            gameOver();
        }
    }
}

// Game Over
function gameOver(){
    gameRunning = false;
    clearInterval(gameInterval);

    const newRecord = score > highScore;
    if(newRecord){
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('high-score').textContent = highScore;
    }

    finalScoreEl.textContent = score;
    newRecordEl.style.display = newRecord ? 'block' : 'none';

    gameOverScreen.style.display = 'flex';
    gameOverScreen.classList.add('show');
}

// Controls
document.addEventListener('keydown', e => {
    if(!gameRunning) return;

    switch(e.key){
        case 'ArrowUp': case 'w': case 'W': if(direction!=='down') direction='up'; break;
        case 'ArrowDown': case 's': case 'S': if(direction!=='up') direction='down'; break;
        case 'ArrowLeft': case 'a': case 'A': if(direction!=='right') direction='left'; break;
        case 'ArrowRight': case 'd': case 'D': if(direction!=='left') direction='right'; break;
    }
});

// Particle effect
const container = document.querySelector('.game-container');
for(let i=0;i<30;i++){
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random()*container.offsetWidth+'px';
    p.style.top = Math.random()*container.offsetHeight+'px';
    p.style.animationDelay = (Math.random()*6)+'s';
    container.appendChild(p);
}

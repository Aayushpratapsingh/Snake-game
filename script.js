// Get canvas and context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Game variables
let snake = [{ x: 200, y: 200 }, { x: 190, y: 200 }, { x: 180, y: 200 }];
let food = { x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10 };
let score = 0;
let highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
let direction = 'right';
let gameRunning = true;

// Update high score display
document.getElementById('high-score').textContent = highScore;

// Draw functions
function drawBoard() {
    // Clear canvas with light background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle grid
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

function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Snake head
            ctx.fillStyle = '#059669';
            ctx.fillRect(segment.x + 1, segment.y + 1, 8, 8);
            
            // Simple eyes
            ctx.fillStyle = 'white';
            ctx.fillRect(segment.x + 2, segment.y + 2, 1, 1);
            ctx.fillRect(segment.x + 5, segment.y + 2, 1, 1);
        } else {
            // Snake body - lighter green
            ctx.fillStyle = '#10b981';
            ctx.fillRect(segment.x + 1, segment.y + 1, 8, 8);
        }
    });
}

function drawFood() {
    // Simple red food
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(food.x + 1, food.y + 1, 8, 8);
    
    // Small highlight
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(food.x + 2, food.y + 2, 2, 2);
}

function updateGameState() {
    if (!gameRunning) return;

    // Move snake
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
    }

    switch (direction) {
        case 'up': snake[0].y -= 10; break;
        case 'down': snake[0].y += 10; break;
        case 'left': snake[0].x -= 10; break;
        case 'right': snake[0].x += 10; break;
    }

    // Check food collision
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        document.getElementById('score').textContent = score;
        
        // Grow snake
        snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
        
        // Generate new food (avoid snake body)
        do {
            food = { 
                x: Math.floor(Math.random() * 40) * 10, 
                y: Math.floor(Math.random() * 40) * 10 
            };
        } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    }

    // Check wall collisions
    if (snake[0].x < 0 || snake[0].x >= canvas.width || 
        snake[0].y < 0 || snake[0].y >= canvas.height) {
        gameOver();
        return;
    }

    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            gameOver();
            return;
        }
    }
}

function gameOver() {
    gameRunning = false;
    
    // Update high score
    const newRecord = score > highScore;
    if (newRecord) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore.toString());
        document.getElementById('high-score').textContent = highScore;
    }
    
    // Show game over screen
    document.getElementById('final-score').textContent = score;
    const newRecordElement = document.getElementById('new-record');
    if (newRecord) {
        newRecordElement.style.display = 'block';
    } else {
        newRecordElement.style.display = 'none';
    }
    document.getElementById('game-over').style.display = 'flex';
}

function restartGame() {
    snake = [{ x: 200, y: 200 }, { x: 190, y: 200 }, { x: 180, y: 200 }];
    food = { x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10 };
    score = 0;
    direction = 'right';
    gameRunning = true;
    
    document.getElementById('score').textContent = score;
    document.getElementById('game-over').style.display = 'none';
}

// Controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Game loop
function gameLoop() {
    drawBoard();
    drawSnake();
    drawFood();
    updateGameState();
}

// Start game
setInterval(gameLoop, 150);
const canvas = document.getElementById('gameCanvas');
const player = document.getElementById('player');
const scoreBoard = document.getElementById('scoreBoard');
const levelBoard = document.createElement('div');
levelBoard.id = 'levelBoard';
levelBoard.textContent = 'Level: 1';
canvas.appendChild(levelBoard);

let playerX = window.innerWidth / 2 - 25;
let bullets = [];
let enemies = [];
let enemyBullets = [];
let score = 0;
let level = 1;
let enemySpeed = 2;
let spawnInterval = 2000; // milliseconds
let levelUpInterval = 10000; // milliseconds
let enemySpawnTypes = ['basic', 'fast', 'shooting'];
let gameOver = false;
let gameInterval;
let levelUpIntervalId;

function updateScore(newScore) {
    score = newScore;
    scoreBoard.textContent = 'Score: ' + score;
}

function updateLevel(newLevel) {
    level = newLevel;
    levelBoard.textContent = 'Level: ' + level;
    enemySpeed += 0.5; // Increase enemy speed with each level
    spawnInterval = Math.max(1000, spawnInterval - 200); // Decrease spawn interval but not below 1000ms
}

function spawnEnemy() {
    if (gameOver) return; // Stop spawning enemies if the game is over

    const type = enemySpawnTypes[Math.floor(Math.random() * enemySpawnTypes.length)];
    const enemy = document.createElement('div');
    enemy.className = `enemy ${type}`;
    enemy.style.left = Math.random() * (window.innerWidth - 50) + 'px';
    enemy.style.top = '-50px';
    canvas.appendChild(enemy);
    enemies.push({ element: enemy, type });

    if (type === 'shooting') {
        setInterval(() => {
            if (enemies.includes({ element: enemy, type })) {
                shootEnemyBullet(enemy);
            }
        }, 2000); // Shooting enemy fires bullets every 2 seconds
    }
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        let top = parseFloat(enemy.element.style.top);
        if (top < window.innerHeight) {
            enemy.element.style.top = top + enemySpeed + 'px';
        } else {
            canvas.removeChild(enemy.element);
            enemies.splice(index, 1);
            updateScore(score - 10);
        }
    });
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        let top = parseFloat(bullet.style.top);
        if (top > 0) {
            bullet.style.top = top - 5 + 'px';
        } else {
            canvas.removeChild(bullet);
            bullets.splice(index, 1);
        }
    });
}

function moveEnemyBullets() {
    enemyBullets.forEach((bullet, index) => {
        let top = parseFloat(bullet.style.top);
        if (top < window.innerHeight) {
            bullet.style.top = top + 5 + 'px';
        } else {
            canvas.removeChild(bullet);
            enemyBullets.splice(index, 1);
        }
    });
}

function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            const bulletRect = bullet.getBoundingClientRect();
            const enemyRect = enemy.element.getBoundingClientRect();

            if (
                bulletRect.left < enemyRect.right &&
                bulletRect.right > enemyRect.left &&
                bulletRect.top < enemyRect.bottom &&
                bulletRect.bottom > enemyRect.top
            ) {
                // Extra points for hitting 'fast' enemies
                const points = enemy.type === 'fast' ? 50 : 10;

                canvas.removeChild(bullet);
                canvas.removeChild(enemy.element);
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                updateScore(score + points);
            }
        });
    });

    // Check collisions between player and enemy bullets
    enemyBullets.forEach((bullet, bulletIndex) => {
        const bulletRect = bullet.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (
            bulletRect.left < playerRect.right &&
            bulletRect.right > playerRect.left &&
            bulletRect.top < playerRect.bottom &&
            bulletRect.bottom > playerRect.top
        ) {
            canvas.removeChild(bullet);
            enemyBullets.splice(bulletIndex, 1);
            updateScore(score - 50); // Penalty for getting hit
        }
    });

    // Check collision between player and enemies
    enemies.forEach((enemy, enemyIndex) => {
        const enemyRect = enemy.element.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (
            enemyRect.left < playerRect.right &&
            enemyRect.right > playerRect.left &&
            enemyRect.top < playerRect.bottom &&
            enemyRect.bottom > playerRect.top
        ) {
            gameOver = true;
            endGame();
        }
    });
}

function shootBullet() {
    if (!gameOver) {
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        bullet.style.left = playerX + 22.5 + 'px';
        bullet.style.top = window.innerHeight - 70 + 'px';
        canvas.appendChild(bullet);
        bullets.push(bullet);
    }
}

function shootEnemyBullet(enemy) {
    const bullet = document.createElement('div');
    bullet.className = 'enemyBullet';
    const enemyRect = enemy.element.getBoundingClientRect();
    bullet.style.left = enemyRect.left + 22.5 + 'px';
    bullet.style.top = enemyRect.bottom + 'px';
    canvas.appendChild(bullet);
    enemyBullets.push(bullet);
}

function endGame() {
    // Stop all game activities
    clearInterval(gameInterval);
    clearInterval(levelUpIntervalId);

    // Display game over message
    const gameOverMessage = document.createElement('div');
    gameOverMessage.id = 'gameOverMessage';
    gameOverMessage.textContent = 'Game Over! Click to Restart';
    gameOverMessage.style.position = 'absolute';
    gameOverMessage.style.top = '50%';
    gameOverMessage.style.left = '50%';
    gameOverMessage.style.transform = 'translate(-50%, -50%)';
    gameOverMessage.style.color = '#fff';
    gameOverMessage.style.fontSize = '30px';
    gameOverMessage.style.background = 'rgba(0, 0, 0, 0.7)';
    gameOverMessage.style.padding = '20px';
    gameOverMessage.style.borderRadius = '10px';
    canvas.appendChild(gameOverMessage);

    canvas.addEventListener('click', restartGame, { once: true });
}

function restartGame() {
    // Remove game over message
    const gameOverMessage = document.getElementById('gameOverMessage');
    if (gameOverMessage) {
        canvas.removeChild(gameOverMessage);
    }

    // Reset game variables
    playerX = window.innerWidth / 2 - 25;
    bullets = [];
    enemies = [];
    enemyBullets = [];
    score = 0;
    level = 1;
    enemySpeed = 2;
    spawnInterval = 2000;
    gameOver = false;

    // Clear score and level display
    updateScore(score);
    updateLevel(level);

    // Remove all enemies and bullets from the canvas
    document.querySelectorAll('.enemy, .bullet, .enemyBullet').forEach(el => el.remove());

    // Restart game intervals
    gameInterval = setInterval(() => {
        if (!gameOver) {
            spawnEnemy();
        }
    }, spawnInterval);

    levelUpIntervalId = setInterval(() => {
        if (!gameOver) {
            updateLevel(level + 1);
        }
    }, levelUpInterval);

    update();
}

document.addEventListener('mousemove', (event) => {
    if (!gameOver) {
        playerX = event.clientX - 25;
        player.style.left = playerX + 'px';
    }
});

document.addEventListener('click', shootBullet);

gameInterval = setInterval(() => {
    if (!gameOver) {
        spawnEnemy();
    }
}, spawnInterval);

levelUpIntervalId = setInterval(() => {
    if (!gameOver) {
        updateLevel(level + 1);
    }
}, levelUpInterval);

function update() {
    if (!gameOver) {
        moveEnemies();
        moveBullets();
        moveEnemyBullets();
        checkCollisions();
        requestAnimationFrame(update);
    }
}

update();

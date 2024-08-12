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
let score = 0;
let level = 1;
let enemySpeed = 2;
let spawnInterval = 2000; // milliseconds
let levelUpInterval = 10000; // milliseconds

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
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.style.left = Math.random() * (window.innerWidth - 50) + 'px';
    enemy.style.top = '-50px';
    canvas.appendChild(enemy);
    enemies.push(enemy);
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        let top = parseFloat(enemy.style.top);
        if (top < window.innerHeight) {
            enemy.style.top = top + enemySpeed + 'px';
        } else {
            canvas.removeChild(enemy);
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

function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            const bulletRect = bullet.getBoundingClientRect();
            const enemyRect = enemy.getBoundingClientRect();

            if (
                bulletRect.left < enemyRect.right &&
                bulletRect.right > enemyRect.left &&
                bulletRect.top < enemyRect.bottom &&
                bulletRect.bottom > enemyRect.top
            ) {
                canvas.removeChild(bullet);
                canvas.removeChild(enemy);
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                updateScore(score + 10);
            }
        });
    });
}

function update() {
    moveEnemies();
    moveBullets();
    checkCollisions();
    requestAnimationFrame(update);
}

function shootBullet() {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = playerX + 22.5 + 'px';
    bullet.style.top = window.innerHeight - 70 + 'px';
    canvas.appendChild(bullet);
    bullets.push(bullet);
}

document.addEventListener('mousemove', (event) => {
    playerX = event.clientX - 25;
    player.style.left = playerX + 'px';
});

document.addEventListener('click', shootBullet);

setInterval(spawnEnemy, spawnInterval);

// Level up mechanism
setInterval(() => {
    updateLevel(level + 1);
}, levelUpInterval);

update();

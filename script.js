const canvas = document.getElementById('gameCanvas');
const player = document.createElement('div');
player.className = 'player';
canvas.appendChild(player);

let playerX = window.innerWidth / 2 - 25;
let bullets = [];
let enemies = [];
let score = 0;

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
            enemy.style.top = top + 2 + 'px';
        } else {
            canvas.removeChild(enemy);
            enemies.splice(index, 1);
            score -= 10;
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
                score += 10;
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

setInterval(spawnEnemy, 2000);
update();

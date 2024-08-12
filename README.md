# player-controlled-shooter

A simple shooting game using HTML, CSS, and JavaScript. This game will feature a player-controlled shooter at the bottom of the screen and enemies falling from the top. The player can shoot bullets to hit the enemies.

# Explanation

1. HTML: Sets up a container for the game canvas.
2. CSS: Styles the player, bullets, and enemies.
3. JavaScript:
`player` is the shooter controlled by mouse movement.
`bullets` array keeps track of bullets shot by the player.
`enemies` array keeps track of falling enemies.
`spawnEnemy` creates a new enemy at a random position.
`moveEnemies` and moveBullets update positions of enemies and bullets, respectively.
`checkCollisions` detects collisions between bullets and enemies.
`shootBullet` creates a new bullet when the player clicks.
`update` is the main game loop that keeps everything moving and checking for collisions.



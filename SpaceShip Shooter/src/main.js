// Menu scene
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.video('space', 'assets/background.mp4', 'loadeddata', false, true);
    }

    create() {
        // background video
        const spaceVideo = this.add.video(config.width/2, config.height/2, 'space');
        spaceVideo.setDisplaySize(config.width, config.height);  
        spaceVideo.play(true);  
        spaceVideo.setDepth(-1);
        // Title
        const titleText = this.add.text(config.width/2, config.height/3, 'SPACE WAR', {
            fontSize: '64px',
            fill: '#dd6600',
            fontFamily: 'verdana',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Instructions
        const instructionsText = this.add.text(config.width / 2, config.height - 100, 'Arrows to move, Space to shoot, Q for special attack', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'verdana',
            align: 'center'
        }).setOrigin(0.5);

        // Single Player Button
        const playButton = this.add.text(config.width/2, config.height/2, 'Play', {
            fontSize: '36px',
            fill: '#dd6600',
            fontFamily: 'verdana'
        }).setOrigin(0.5);
        playButton.setInteractive();
        playButton.on('pointerover', () => playButton.setStyle({ fill: '#ff3300' }));
        playButton.on('pointerout', () => playButton.setStyle({ fill: '#dd6600' }));
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Credits Button
        const creditsButton = this.add.text(config.width/2, config.height/2 + 70, 'Credits', {
            fontSize: '36px',
            fill: '#dd6600',
            fontFamily: 'verdana'
        }).setOrigin(0.5);
        creditsButton.setInteractive();
        creditsButton.on('pointerover', () => creditsButton.setStyle({ fill: '#ff3300' }));
        creditsButton.on('pointerout', () => creditsButton.setStyle({ fill: '#dd6600' }));
        creditsButton.on('pointerdown', () => showCredits(this));
    }
}

// Game Scene
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.video('space', 'assets/background.mp4', 'loadeddata', false, true);
        this.load.image('ship', 'assets/ship.PNG');
        this.load.image('enemy1', 'assets/enemy1.PNG');
        this.load.image('enemy2', 'assets/enemy2.PNG');
        this.load.image('boss1', 'assets/boss1.PNG');
        this.load.image('boss2', 'assets/boss2.PNG');
        this.load.image('simpleFire', 'assets/simpleFire.png');
        this.load.image('ore', 'assets/ore.png');
        this.load.image('fire', 'assets/fire.png');
        this.load.image('enemyFire', 'assets/enemyFire.png');

        // Sound loading
        this.load.audio('music', 'assets/music.mp3');
        this.load.audio('audio_simpleFire', 'assets/simpleFire.mp3');
        this.load.audio('audio_fire', 'assets/fire.mp3');
        this.load.audio('audio_ore', 'assets/ore.mp3');
        this.load.audio('audio_enemyFire', 'assets/enemyFire.wav');
        this.load.audio('explosionEnemy', 'assets/explosionEnemy.wav');
        this.load.audio('explosionBoss', 'assets/explosionBoss.wav');

        this.load.spritesheet('explosion', 'assets/explosion.png', {
            frameWidth: 154,
            frameHeight: 160,
            margin: 0,
            spacing: 0
        });
    }

    create() {
        const spaceVideo = this.add.video(config.width/2, config.height/2, 'space');
        spaceVideo.setDisplaySize(config.width, config.height);  
        spaceVideo.play(true);  
        spaceVideo.setDepth(-1);  

        // Sound configuration
        music = this.sound.add('music', {
            volume: 0.5,
            loop: true
        });
        music.play();

        simpleFireSound = this.sound.add('audio_simpleFire');
        fireSound = this.sound.add('audio_fire');
        oreSound = this.sound.add('audio_ore'); 
        enemyFireSound = this.sound.add('audio_enemyFire');
        explosionEnemy = this.sound.add('explosionEnemy');
        explosionBoss = this.sound.add('explosionBoss');
        simpleFireSound.setVolume(1.5);  
        fireSound.setVolume(1.5);        
        oreSound.setVolume(2); 
        enemyFireSound.setVolume(1);   
        explosionEnemy.setVolume(1);
        explosionBoss.setVolume(0.3);

        player = this.physics.add.sprite(100, 360, 'ship');
        player.setCollideWorldBounds(true); 
        player.angle = 90; 
        player.setScale(0.5); 

        sFire = this.physics.add.group({
            defaultKey: 'simpleFire',
            maxSize: 30
        });

        enhancedFire = this.physics.add.group({
            defaultKey: 'fire',
            maxSize: 30
        });

        enemyBullets = this.physics.add.group({
            defaultKey: 'enemyFire',
            maxSize: 40
        });

        enemies = this.physics.add.group();
        boss1 = this.physics.add.group();
        ores = this.physics.add.group();

        cursors = this.input.keyboard.createCursorKeys();
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        switchKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

        this.physics.add.collider(sFire, enemies, destroyBoth, null, this);
        this.physics.add.collider(sFire, boss1, destroyBoth, null, this);
        this.physics.add.collider(enhancedFire, enemies, destroyBoth, null, this);
        this.physics.add.collider(enhancedFire, boss1, destroyBoth, null, this);
        this.physics.add.overlap(player, ores, collectOre, null, this);
        
        this.physics.add.overlap(player, enemies, playerDamage, null, this);
        this.physics.add.overlap(player, boss1, playerDamage, null, this);
        this.physics.add.overlap(player, enemyBullets, bulletDamage, null, this);

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 6
            }),
            frameRate: 15,
            repeat: 0
        });

        pointsText = this.add.text(16, 16, 'Puntos: 0', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'verdana'
        });
        healthText = this.add.text(16, 60, 'Vidas: 3', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'verdana'
        });

        this.isInvulnerable = false;
    }

    update(time) {
        if (!playerAlive) return;

        if (cursors.left.isDown) {
            player.setVelocityX(-300);
        } else if (cursors.right.isDown) {
            player.setVelocityX(300);
        } else {
            player.setVelocityX(0);
        }

        if (cursors.up.isDown) {
            player.setVelocityY(-300);
        } else if (cursors.down.isDown) {
            player.setVelocityY(300);
        } else {
            player.setVelocityY(0);
        }

        if (spaceKey.isDown && time > lastFired) {
            const simpleFire = sFire.get();
            if (simpleFire) {
                simpleFireSound.play();
                simpleFire.setPosition(player.x + 100, player.y);
                simpleFire.setVelocityX(600);
                simpleFire.setActive(true);
                simpleFire.setVisible(true);
                simpleFire.setScale(0.5);
            }
            lastFired = time + 150;
        }

        if (hasOreWeapon && this.input.keyboard.checkDown(switchKey, 0) && time > lastQFired) {
            const fire = enhancedFire.get();
            if (fire) {
                fireSound.play();
                fire.setPosition(player.x + 100, player.y);
                fire.setVelocityX(600);
                fire.setActive(true);
                fire.setVisible(true);
                fire.setScale(0.2);
            }
            lastQFired = time + 500;
        }

        enemies.children.each(function(enemy) {
            if (enemy.isBoss && (!enemy.lastFired || time > enemy.lastFired)) {
                enemyShoot(enemy, time);
                enemy.lastFired = time + 2000;
            }
            else if (!enemy.isBoss && (!enemy.lastFired || time > enemy.lastFired)) {
                enemyShoot(enemy, time);
                enemy.lastFired = time + 3000;
            }
        
            if (enemy.x < -50) {
                enemy.destroy();
            }
        });

        enemyBullets.children.each(function(bullet) {
            if (bullet.x < -50 || bullet.x > config.width + 50 || 
                bullet.y < -50 || bullet.y > config.height + 50) {
                bullet.setActive(false);
                bullet.setVisible(false);
            }
        });

        spawnEnemy(time);

        sFire.children.each(function(simpleFire) {
            if (simpleFire.x > config.width) {
                simpleFire.setActive(false);
                simpleFire.setVisible(false);
            }
        });

        enhancedFire.children.each(function(fire) {
            if (fire.x > config.width) {
                fire.setActive(false);
                fire.setVisible(false);
            }
        });

        enemies.children.each(function(enemy) {
            if (enemy.x < -50) {
                enemy.destroy();
            }
        });
    }
}

// Global variables
// Player
let player;
let playerhealth = 3;
let playerAlive = true;

// Controls
let cursors;
let spaceKey;
let switchKey;

// Shooting system
let sFire;
let lastFired = 0;
let lastQFired = 0;
let enhancedFire;
let hasOreWeapon = false;

// Enemies
let enemies;
let enemyBullets;
let lastEnemySpawn = 0;

// Bosses
let boss1;
let bossSummoned1 = false;
let bossSummoned2 = false;

// Collectibles
let ores;
let giveOre = false;

// Interface/HUD
let points = 0;
let pointsText;
let healthText;

// Sounds
let simpleFireSound;
let fireSound;
let oreSound;
let explosionEnemy;
let explosionBoss;
let enemyFireSound;
let music;

// Game state
let win = false;

// Game configuration
const config = {
    type: Phaser.AUTO,     
    width: 1280,           
    height: 720,            
    physics: {              
        default: 'arcade',  
        arcade: {
            gravity: { y: 0 }, 
            debug: false            
        }
    },
    scene: [MenuScene, GameScene]
};

const game = new Phaser.Game(config);

function playerDamage(player, enemy) {
    if (this.isInvulnerable) return;
    
    if(enemy.isBoss) {
        playerhealth = 0;
    } else {
        playerhealth = playerhealth - 1;
    }

    if (playerhealth > 0) {
        healthText.setText('Vidas: ' + playerhealth);
        
        this.isInvulnerable = true;
        
        let blinkCount = 0;
        const blinkInterval = this.time.addEvent({
            delay: 200,
            callback: () => {
                player.alpha = player.alpha === 1 ? 0.5 : 1;
                blinkCount++;
                if (blinkCount >= 15) {
                    blinkInterval.remove();
                    player.alpha = 1;
                    this.isInvulnerable = false;
                }
            },
            loop: true
        });
    } else {
        playerAlive = false;
        this.physics.pause();
        
        player.setTint(0xff0000);
        player.setVelocity(0, 0);

        enemies.children.each(function(enemy) {
            enemy.setVelocity(0, 0);
        });

        enemyBullets.children.each(function(bullet) {
            bullet.setVelocity(0, 0);
        });
        sFire.children.each(function(bullet) {
            bullet.setVelocity(0, 0);
        });
        enhancedFire.children.each(function(bullet) {
            bullet.setVelocity(0, 0);
        });

        showloseMenu(this);
    }
}

function bulletDamage(player, bullet) {
    if (this.isInvulnerable) return; // Skip processing if the player is invulnerable

    bullet.destroy(); // Destroy the bullet

    if (playerhealth > 1) {
        playerhealth = playerhealth - 1;
        healthText.setText('Vidas: ' + playerhealth); 

        this.isInvulnerable = true; // Activate temporary invulnerability
        let blinkCount = 0;

        // Blinking effect for invulnerability
        const blinkInterval = this.time.addEvent({
            delay: 200, // Blink every 200ms
            callback: () => {
                player.alpha = player.alpha === 1 ? 0.5 : 1; // Toggle visibility
                blinkCount++;
                if (blinkCount >= 15) {
                    blinkInterval.remove(); 
                    player.alpha = 1; 
                    this.isInvulnerable = false; 
                }
            },
            loop: true
        });
    } else {
        playerhealth = 0; 
        playerAlive = false; 
        this.physics.pause(); 

        player.setTint(0xff0000); 
        player.setVelocity(0, 0); 

        // Stop movement of all enemies and bullets
        enemies.children.each(function(enemy) { enemy.setVelocity(0, 0); });
        enemyBullets.children.each(function(bullet) { bullet.setVelocity(0, 0); });
        sFire.children.each(function(bullet) { bullet.setVelocity(0, 0); });
        enhancedFire.children.each(function(bullet) { bullet.setVelocity(0, 0); });

        showloseMenu(this); // Trigger the lose menu
    }
}


function collectOre(player, ore) {
    ore.destroy();
    points += 2000;
    playerhealth = 3;
    pointsText.setText('Puntos: ' + points);
    healthText.setText('Vidas: ' + playerhealth);
    hasOreWeapon = true;
    giveOre = true;
    oreSound.play();
}

function destroyBoth(bullet, enemy) {
    bullet.destroy(); // Destroy the bullet

    if (enemy.isBoss) {
        // Handle boss behavior when hit
        if (!enemy.health) {
            // Initialize health for the boss if not set
            enemy.health = enemy.bossType === 'boss2' ? 550 : 350;
        }
        enemy.health--; // Decrease health

        enemy.setTint(0xff0000);  // Apply red tint on damage
        setTimeout(() => {
            enemy.clearTint();  // Remove red tint after 100ms
        }, 100);

        if (enemy.health <= 0) {
            // If health <= 0, handle boss defeat
            if (enemy.bossType === 'boss1') {
                // Boss1 drops ore and adds points
                const ore = ores.create(100, 350, 'ore');
                ore.setScale(0.01);
                ore.setVelocity(0, 0);
                ore.body.setSize(50, 50);
                giveOre = true;
                explosionBoss.play();
                points += 1000;
            } else if (enemy.bossType === 'boss2') {
                // Boss2 adds more points and triggers victory
                points += 2000;
                explosionBoss.play();
                this.physics.pause();  // Pause physics
                player.setVelocity(0, 0);  // Stop player movement

                showVictoryMenu(this);  // Show victory menu


            }
            enemy.destroy();  // Destroy the boss
            pointsText.setText('Puntos: ' + points);  // Update score display
        }
    } else {
        // Regular enemy behavior when hit
        enemy.setVelocityX(200); // Push the enemy back
        playExplosion.call(this, enemy.x, enemy.y);  // Play explosion effect

        // Delay before destroying the regular enemy
        this.time.delayedCall(100, () => {
            enemy.destroy(); // Destroy regular enemy
            points += 10;  // Add points for regular enemy
            pointsText.setText('Puntos: ' + points);  // Update score display
        });
    }
}


function playExplosion(x, y) {
    let explosion = this.add.sprite(x, y, 'explosion');
    explosion.play('explode');

    explosion.on('animationcomplete', () => {
        explosion.destroy();
    });
    explosionEnemy.play();
}

function spawnEnemy(time) {
    if (time > lastEnemySpawn) {
        const randomY = Phaser.Math.Between(50, config.height - 50);

        // Spawn boss2 if points >= 3500 and not already summoned
        if (points >= 3500 && !bossSummoned2) {  
            const enemy = enemies.create(config.width, config.height / 2, 'boss2');
            enemy.setScale(1.5);
            enemy.angle = -90;
            enemy.setVelocityX(-40);
            enemy.health = 150;
            enemy.setImmovable(true);
            enemy.isBoss = true;
            enemy.bossType = 'boss2';
            enemy.body.setSize(100, 1000);
            enemy.body.setOffset(300, 100);
            bossSummoned2 = true;
            lastEnemySpawn = time + 3000;
        } 
        // Spawn boss1 if points >= 100 and not already summoned
        else if (points >= 100 && !bossSummoned1) {  
            const enemy = enemies.create(config.width, config.height / 2, 'boss1');
            enemy.setScale(1.5);
            enemy.angle = -90;
            enemy.setVelocityX(-40);
            enemy.health = 80;
            enemy.setImmovable(true);
            enemy.isBoss = true;
            enemy.bossType = 'boss1';
            enemy.body.setSize(50, 200);
            bossSummoned1 = true;
            lastEnemySpawn = time + 3000;
        } 
        // Spawn regular enemies if no bosses are summoned
        else if (!bossSummoned2 || !bossSummoned1) {  
            const enemyType = Math.random() < 0.5 ? 'enemy1' : 'enemy2';
            const enemy = enemies.create(config.width + 50, randomY, enemyType);
            enemy.setScale(0.5);
            enemy.angle = -90;
            enemy.setVelocityX(-200);
            lastEnemySpawn = time + Phaser.Math.Between(500, 1500);
        }
    }
}


function enemyShoot(enemy, time) {
    if (enemy.isBoss) {
        // Boss shooting patterns
        if (!enemy.patternSwitch) {
            // First pattern: Spread bullets in a fan shape
            for (let i = -4; i <= 4; i++) {
                const bullet = enemyBullets.get();
                if (bullet) {
                    const spread = 10; // Angle between bullets
                    const angle = Math.PI + (i * spread * Math.PI / 180); // Spread calculation
                    const velocity = 500;
                    bullet.setPosition(enemy.x - 50, enemy.y);
                    bullet.setVelocity(
                        velocity * Math.cos(angle),
                        velocity * Math.sin(angle)
                    );
                    bullet.setActive(true);
                    bullet.setVisible(true);
                    bullet.setScale(0.5);
                    bullet.rotation = angle; // Set rotation to match direction
                }
            }
        } else {
            // Second pattern: Circular bullets
            for (let i = 0; i < 12; i++) {
                const bullet = enemyBullets.get();
                if (bullet) {
                    const angle = (i * Math.PI * 2 / 12); // Full circle
                    const velocity = 1000;
                    bullet.setPosition(enemy.x - 50, enemy.y);
                    bullet.setVelocity(
                        velocity * Math.cos(angle),
                        velocity * Math.sin(angle)
                    );
                    bullet.setActive(true);
                    bullet.setVisible(true);
                    bullet.setScale(0.5);
                    bullet.rotation = angle; // Set rotation to match direction
                }
            }
        }
        // Switch boss pattern for next shot
        enemy.patternSwitch = !enemy.patternSwitch;
    } else {
        // Regular enemy shooting straight bullets
        const bullet = enemyBullets.get();
        if (bullet) {
            const velocity = 500;
            bullet.setPosition(enemy.x - 20, enemy.y);
            bullet.setVelocityX(-velocity); // Straight movement
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setScale(0.5);
            bullet.rotation = Math.PI; // Face the left direction
        }
    }
    
    enemyFireSound.play(); // Play shooting sound
}


function showVictoryMenu(scene) {
    // Pause all physics in the game
    scene.physics.pause();
    
    // Disable player's ability to shoot and move
    playerAlive = false;  
    player.setVelocity(0, 0);

    // Stop all enemies movement
    enemies.children.each(function(enemy) {
        enemy.setVelocity(0, 0);
    });

    // Freeze all types of projectiles in place
    sFire.children.each(function(bullet) {  
        bullet.setVelocity(0, 0);
    });
    enhancedFire.children.each(function(bullet) {  
        bullet.setVelocity(0, 0);
    });
    enemyBullets.children.each(function(bullet) {  
        bullet.setVelocity(0, 0);
    });

    // Create a group for the victory menu elements
    let menuGroup = scene.add.group();
    music.stop();  // Stop background music
    
    // Add semi-transparent black overlay
    const overlay = scene.add.rectangle(0, 0, config.width, config.height, 0x000000, 0.5);
    overlay.setOrigin(0, 0);
    menuGroup.add(overlay);

    // Add victory title text
    const titleText = scene.add.text(config.width/2, config.height/3, '¡YOU WIN!', {
        fontSize: '64px',
        fill: '#00ff00',
        fontFamily: 'verdana',
        fontWeight: 'bold'
    }).setOrigin(0.5);
    menuGroup.add(titleText);

    // Display final score
    const scoreText = scene.add.text(config.width/2, config.height/3 + 80, 'FINAL SCOREl: ' + points, {
        fontSize: '32px',
        fill: '#ffffff',
        fontFamily: 'verdana'
    }).setOrigin(0.5);
    menuGroup.add(scoreText);

    // Add play again button with hover effects
    const playButton = scene.add.text(config.width/2, config.height/2 + 50, '¡PLAY!', {
        fontSize: '36px',
        fill: '#ffffff',
        fontFamily: 'verdana'
    }).setOrigin(0.5);
    playButton.setInteractive();
    playButton.on('pointerover', () => playButton.setStyle({ fill: '#ff3300' }));
    playButton.on('pointerout', () => playButton.setStyle({ fill: '#ffffff' }));

    // Reset game state when clicking play again
    playButton.on('pointerdown', () => {
        menuGroup.destroy(true);               
        scene.scene.start('MenuScene');  

        // Reset all game variables
        playerhealth = 3;
        points = 0;
        playerAlive = true;
        bossSummoned1 = false;
        bossSummoned2 = false;
        hasOreWeapon = false;
    });
    menuGroup.add(playButton);
}

function showloseMenu(scene) {
    let menuGroup = scene.add.group();
    music.stop();
    const overlay = scene.add.rectangle(0, 0, config.width, config.height, 0x000000, 0.3);
    overlay.setOrigin(0, 0);
    menuGroup.add(overlay);

    const titleText = scene.add.text(config.width/2, config.height/3, '¡YOU LOST!', {
        fontSize: '64px',
        fill: '#dc0000',
        fontFamily: 'verdana',
        fontWeight: 'bold'
    }).setOrigin(0.5);
    menuGroup.add(titleText);

    const scoreText = scene.add.text(config.width/2, config.height/3 + 80, 'FINAL SCORE: ' + points, {
        fontSize: '32px',
        fill: '#ffffff',
        fontFamily: 'verdana'
    }).setOrigin(0.5);
    menuGroup.add(scoreText);

    const playButton = scene.add.text(config.width/2, config.height/2 + 50, 'PLAY', {
        fontSize: '36px',
        fill: '#ffffff',
        fontFamily: 'verdana'
    }).setOrigin(0.5);
    playButton.setInteractive();
    playButton.on('pointerover', () => playButton.setStyle({ fill: '#ff3300' }));
    playButton.on('pointerout', () => playButton.setStyle({ fill: '#ffffff' }));
    playButton.on('pointerdown', () => {
        menuGroup.destroy(true);
        scene.scene.start('MenuScene');
        playerhealth = 3;
        points = 0;
        playerAlive = true;
        bossSummoned1 = false;
        bossSummoned2 = false;
        hasOreWeapon = false;
    });
    menuGroup.add(playButton);

    const creditsButton = scene.add.text(config.width/2, config.height/2 + 120, 'CREDITS', {
        fontSize: '36px',
        fill: '#ffffff',
        fontFamily: 'verdana'
    }).setOrigin(0.5);
    creditsButton.setInteractive();
    creditsButton.on('pointerover', () => creditsButton.setStyle({ fill: '#ff3300' }));
    creditsButton.on('pointerout', () => creditsButton.setStyle({ fill: '#ffffff' }));
    creditsButton.on('pointerdown', () => showCredits(scene, menuGroup));
    menuGroup.add(creditsButton);
}

function showCredits(scene, menuGroup = null) {
    if (menuGroup) menuGroup.destroy(true);

    let creditsGroup = scene.add.group();

    const overlay = scene.add.rectangle(0, 0, config.width, config.height, 0x000000, 0.9);
    overlay.setOrigin(0, 0);
    creditsGroup.add(overlay);

    const titleText = scene.add.text(config.width/2, 100, 'CREDITS', {
        fontSize: '48px',
        fill: '#ffffff',
        fontFamily: 'verdana'
    }).setOrigin(0.5);
    creditsGroup.add(titleText);

    const creditsContent = [
        'Design and Programming',
        'Santiago Granado Piñero',
        '',
        'Project DAW',
        'IES Albarregas'
    ];

    let yPosition = 200;
    creditsContent.forEach(line => {
        const creditText = scene.add.text(config.width/2, yPosition, line, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'verdana'
        }).setOrigin(0.5);
        creditsGroup.add(creditText);
        yPosition += 40;
    });

    const backButton = scene.add.text(config.width/2, config.height - 100, 'BACK', {
        fontSize: '36px',
        fill: '#ffffff',
        fontFamily: 'verdana'
    }).setOrigin(0.5);
    backButton.setInteractive();
    backButton.on('pointerover', () => backButton.setStyle({ fill: '#ff3300' }));
    backButton.on('pointerout', () => backButton.setStyle({ fill: '#ffffff' }));
    backButton.on('pointerdown', () => {
        creditsGroup.destroy(true);
        scene.scene.start('MenuScene');
    });
    creditsGroup.add(backButton);
}
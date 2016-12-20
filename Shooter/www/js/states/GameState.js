var Shooter = Shooter || {};

Shooter.GameState = {
    
    // Initiate game settings
    init: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.PLAYER_SPEED = 200;
        this.BULLET_SPEED = -1000;
    },
    
    // Load the game assets before the game starts
    preload: function() {
        this.load.image('space', 'assets/images/space.png');
        this.load.image('player', 'assets/images/player.png');
        this.load.image('bullet', 'assets/images/bullet.png');
        this.load.image('enemyParticle', 'assets/images/enemyParticle.png');
        this.load.spritesheet('yellowEnemy', 'assets/images/yellow_enemy.png', 50, 46, 3, 1, 1);
        this.load.spritesheet('redEnemy', 'assets/images/red_enemy.png', 50, 46, 3, 1, 1);
        this.load.spritesheet('greenEnemy', 'assets/images/green_enemy.png', 50, 46, 3, 1, 1);
    },
    
    // Executed after everything is loaded
    create: function(){
        // tile sprite (a sprite that repeats it self within the area specified)
        // Moving stars background
        this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');
        
        this.background.autoScroll(0, 30);
        
        // Player
        
        this.player = this.add.sprite(this.game.world.centerX, this.game.world.height - 50, 'player');
        this.player.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this.player); // adding ability to collide
        this.player.body.collideWorldBounds = true; // cannot leave the edges of the screen
        
        // Bullets (pool of objects)
        this.initBullets();
        this.shootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND / 5, this.createPlayerBullet, this);
        
        // Initiate Enemies
        this.initEnemies();
        
        // Load level
        this.loadLevel();
    },
    
    update: function() {
        
        this.game.physics.arcade.overlap(this.playerBullets, this.enemies, this.damageEnemy, null, this);
        
        this.game.physics.arcade.overlap(this.enemyBullets, this.player, this.killPlayer, null, this);
        // player speed at init and it also stops from continuous movement with one touch/click
        this.player.body.velocity.x = 0;
        // user event listeners
        if (this.game.input.activePointer.isDown) {
            // This is the x position of the user touch
            var targetX = this.game.input.activePointer.position.x;
            // direction will be 1 if right, -1 if left
            var direction = targetX >= this.game.world.centerX ? 1 : -1;
            // Moving player
            this.player.body.velocity.x = direction * this.PLAYER_SPEED;
        }
    },
    
    initBullets: function() {
        this.playerBullets = this.add.group();
        // enabling physics for groups (pool of objects)
        this.playerBullets.enableBody = true;
    },
    
    createPlayerBullet: function() {
        // finding first dead bullet
        var bullet = this.playerBullets.getFirstExists(false);
        
        if (!bullet){
            bullet = new Shooter.PlayerBullet(this.game, this.player.x, this.player.top);
            // adding it to the group in initBullets
            this.playerBullets.add(bullet);
            
        } else {
            // reset position back to the player
            bullet.reset(this.player.x, this.player.top);
        }
        
        // set velocity
        bullet.body.velocity.y = this.BULLET_SPEED;
        
        
    },
    initEnemies: function() {
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        
        this.enemyBullets = this.add.group();
        this.enemyBullets.enableBody = true;
        
    },
    
    damageEnemy: function(bullet, enemy) {
        enemy.damage(1);
        
        bullet.kill();
    },
    
    killPlayer: function() {
        this.player.kill();
        
        this.game.state.start('GameState');
    },
    
    createEnemy: function(x, y, health, key, scale, speedX, speedY) {
        var enemy = this.enemies.getFirstExists(false);
        
        if (!enemy) {
            enemy = new Shooter.Enemy(this.game, x, y, key, health, this.enemyBullets);
            this.enemies.add(enemy);
        }
        
        enemy.reset(x, y, health, key, scale, speedX, speedY);
    },
    
    loadLevel: function() {
        this.currentEnemyIndex = 0;
        this.levelData = {
          "duration": 35,
          "enemies": 
          [
            {
              "time": 1,
              "x": 0.05,
              "health": 6,
              "speedX": 20, 
              "speedY": 50,
              "key": "greenEnemy",
              "scale": 3
            },
            {
              "time": 2,
              "x": 0.1,
              "health": 3,
              "speedX": 50, 
              "speedY": 50,
              "key": "greenEnemy",
              "scale": 1
            },
            {
              "time": 3,
              "x": 0.1,
              "health": 3,
              "speedX": 50, 
              "speedY": 50,
              "key": "greenEnemy",
              "scale": 1
            },
            {
              "time": 4,
              "x": 0.1,
              "health": 3,
              "speedX": 50, 
              "speedY": 50,
              "key": "greenEnemy",
              "scale": 1
            },
            {
              "time": 5,
              "x": 0.1,
              "health": 3,
              "speedX": 50, 
              "speedY": 50,
              "key": "greenEnemy",
              "scale": 1
            },
            {
              "time": 6,
              "x": 0.1,
              "health": 6,
              "speedX": 50, 
              "speedY": 50,
              "key": "greenEnemy",
              "scale": 3
            },
            {
              "time": 7,
              "x": 0.9,
              "health": 3,
              "speedX": -50, 
              "speedY": 50,
              "key": "redEnemy",
              "scale": 2
            },
            {
              "time": 8,
              "x": 0.9,
              "health": 3,
              "speedX": -50, 
              "speedY": 50,
              "key": "redEnemy",
              "scale": 1
            },
            {
              "time": 9,
              "x": 0.9,
              "health": 3,
              "speedX": -50, 
              "speedY": 50,
              "key": "redEnemy",
              "scale": 1
            },
            {
              "time": 10,
              "x": 0.9,
              "health": 3,
              "speedX": -50, 
              "speedY": 50,
              "key": "redEnemy",
              "scale": 1
            },
            {
              "time": 11,
              "x": 0.9,
              "health": 3,
              "speedX": -50, 
              "speedY": 50,
              "key": "redEnemy",
              "scale": 1
            },
            {
              "time": 12,
              "x": 0.9,
              "health": 6,
              "speedX": -50, 
              "speedY": 50,
              "key": "redEnemy",
              "scale": 3
            },
            {
              "time": 13,
              "x": 0.1,
              "health": 3,
              "speedX": 100, 
              "speedY": 20,
              "key": "greenEnemy",
              "scale": 1
            },
            {
              "time": 14,
              "x": 0.1,
              "health": 3,
              "speedX": 100, 
              "speedY": 20,
              "key": "yellowEnemy",
              "scale": 1
            },
            {
              "time": 15,
              "x": 0.1,
              "health": 3,
              "speedX": 100, 
              "speedY": 20,
              "key": "yellowEnemy",
              "scale": 1
            },
            {
              "time": 16,
              "x": 0.1,
              "health": 3,
              "speedX": 100, 
              "speedY": 20,
              "key": "yellowEnemy",
              "scale": 1
            },
            {
              "time": 17,
              "x": 0.1,
              "health": 3,
              "speedX": 100, 
              "speedY": 20,
              "key": "yellowEnemy",
              "scale": 1
            },
            {
              "time": 18,
              "x": 0.1,
              "health": 12,
              "speedX": 120, 
              "speedY": 50,
              "key": "yellowEnemy",
              "scale": 5
            }
          ]
        };
        
        this.scheduleNextEnemy();
    },
    
    scheduleNextEnemy: function() {
        var nextEnemy = this.levelData.enemies[this.currentEnemyIndex];
        
        if (nextEnemy) {
            //         - in ms so multiply by 1000 for seconds
            var nextTime = 1000 * ( nextEnemy.time - (this.currentEnemyIndex == 0 ? 0 : this.levelData.enemies[this.currentEnemyIndex - 1].time));
            this.nextEnemyTimer = this.game.time.events.add(nextTime, function() {
                this.createEnemy(nextEnemy.x * this.game.world.width, -100, nextEnemy.health, nextEnemy.key, nextEnemy.scale, nextEnemy.speedX, nextEnemy.speedY);
                
                this.currentEnemyIndex++;
                this.scheduleNextEnemy();
            }, this)
        }
    }
    
};
//














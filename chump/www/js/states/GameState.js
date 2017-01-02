var Chump = Chump || {};

Chump.GameState = {
    
    init: function(currentLevel, currentScore) {
        this.BACKGROUND_SPEED = 2;
        this.PLAYER_SPEED = 2;
        this.FOOD_SPEED = 2;
        this.ENEMY_SPEED = 1;
        this.numLevels = 2;
        
//      if level is entered, use that level, if not start at level 1
        this.currentLevel = currentLevel ? currentLevel : 1;
        this.currentScore = currentScore ? currentScore : 0;
    },

    create: function() {
        this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background');
        this.background.inputEnabled = true;
        this.background.events.onInputDown.add(this.placeFood, this);
        
        this.player = this.game.add.sprite(65, 320, 'player');
        this.player.anchor.setTo(0.5);
        this.player.scale.setTo(0.5, 0.5);
        
        this.player.customParams = {};
        this.player.customParams.dead = false;
        this.player.customParams.powerUp = false;
        
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.game.camera.follow(this.player);
        
        var scoreStyle = {
            font: '20px Arial',
            fill: '#fff'
        };
        
        var s1 = this.game.add.text(this.game.world.width * 0.035, this.game.world.height * 0.025, 'Score: ', scoreStyle);
        s1.fixedToCamera = true;
        
        
        
        var s2 = this.scoreText = this.game.add.text(this.game.world.width * 0.225, this.game.world.height * 0.025, '', scoreStyle);
        s2.fixedToCamera = true;

        var eating = this.player.animations.add('eating', [5, 7, 5], 3, false);
        this.player.animations.add('flying', [1, 2, 3, 4, 5], 6, true); // 7 frames per second
        this.player.animations.play('flying');

        this.uiBlocked = false;
        
        this.initFood();
        this.initEnemies();
        this.initPowerUps();
        this.loadLevel();
        this.showLevelText();
        
    },
    
    update: function() {
        this.background.tilePosition.x -= this.BACKGROUND_SPEED;
        this.player.position.x -= this.PLAYER_SPEED;
//        this.enemy.position.x -= this.ENEMY_SPEED;
        if (this.player.customParams.dead) {
            this.player.frame = 7; // this should be the frame in the spritesheet that shows the pet hitting something and dying (x_x)
            this.uiBlocked = true;
            this.player.position.y += 2;
            
            this.game.time.events.add(2000, this.gameOver, this);
        };
        
        this.game.physics.arcade.collide(this.player, this.food, this.eatFood);
        this.game.physics.arcade.collide(this.player, this.enemies, this.killPlayerEnemy);
        this.game.physics.arcade.collide(this.player, this.powerUps, this.powerUpPlayer);

        if (this.food.children.length > 0) {
            if (this.food.children[this.food.children.length - 1].customParams.eaten) {
                this.uiBlocked = false;
            } else if (!this.food.children[this.food.children.length - 1].customParams.eaten) {
                this.uiBlocked = true;
            };
        };
        
        // Power up animation
        
        if (this.player.customParams.powerUp) {
            this.player.animations.stop('flying')
            this.player.frame = 6;
            this.player.angle = 20;

            var powerTimer = this.game.time.create(true);
            powerTimer.add(3000, function() {
                this.player.animations.play('flying');
                this.player.customParams.powerUp = false;
                this.player.angle = 0;
            }, this);
            powerTimer.start();
        };
        
        
        this.increaseScore();
        this.refreshScore();

    },
    
    increaseScore: function() {
        this.currentScore += Math.ceil(this.game.time.totalElapsedSeconds()/100);
    },
    
    refreshScore: function() {
        this.scoreText.text = this.currentScore;    
    },
    
    gameOver: function() {
        this.state.start('HomeState', true, false, 'GAME OVER', this.currentScore);// true for refresh everything, false for keep the cache, message variable
    },
    
    placeFood: function(sprite, event) {
        if (!this.uiBlocked) {
            var x = event.position.x;
            var y = event.position.y;
            console.log('x', x);
            console.log('y', y);
            
            if (this.player.position.x <= event.position.x) {
                var newFood = this.food.getFirstExists(false);
            
                if (!newFood) {
                    newFood = new Chump.Food(this.game, x, y, "powerFood");
                    this.food.add(newFood);
                    this.uiBlocked = true;
                };

                newFood.reset(x, y, "food", false, this.FOOD_SPEED); // false is to reset food with eaten boolean set to false


                var playerMovement = this.game.add.tween(this.player);
                
                // Bird going up or down depending on where user clicked
                if (event.position.y >= this.player.position.y + 10) {
                    this.player.angle += 25;
                    this.BACKGROUND_SPEED = 3;
                    playerMovement.to({ y: y }, 700); // { x: x, y: y } if the bird is to move to the exact point
                } else if (event.position.y <= this.player.position.y - 10) {
                    this.player.angle -= 25;
                    this.BACKGROUND_SPEED = 3;
                    playerMovement.to({ y: y }, 700); // { x: x, y: y } if the bird is to move to the exact point
                } else {
                    this.BACKGROUND_SPEED = 3;
                    playerMovement.to({ y: y }, 700); // { x: x, y: y } if the bird is to move to the exact point
                };
                // Bird back to stationary angle upon complete
                playerMovement.onComplete.add(function() {
                    this.player.angle = 0;
//                    this.uiBlocked = false;
                    this.BACKGROUND_SPEED = 2;
    //                this.player.animations.play('eating');

                }, this);

                playerMovement.start();
            };
        };    
    },
    
    killPlayerEnemy: function(player, enemy) {
        if (!player.customParams.powerUp){
            player.angle += 2;
            enemy.frame = 6;
            enemy.angle -= 1;
            enemy.position.y += 2;
            player.customParams.dead = true;
        } else {
            enemy.frame = 6;
            enemy.angle -= 1;
            enemy.position.y += 2;
            console.log('killing when powered');
            enemy.customParams.dead = true;
            
            var killTime = Chump.game.time.create(true);
            killTime.add(1000, function() {
                enemy.kill();    
            }, this);
            killTime.start();
        };
        
    },
    
    initEnemies: function() {
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
    },
    
    createEnemy: function(x, y, key, speedX) {
        var enemy = this.enemies.getFirstExists(false);
        
        if (!enemy) {
            enemy = new Chump.Enemy(this.game, x, y, key);
            this.enemies.add(enemy)
        };
        
        enemy.reset(x, y, key, false, speedX); // the false here is to reset the enemy with dead boolean set to false
    },
    
    initFood: function() {
        this.food = this.add.group();
        this.food.enableBody = true;
    },
    
    initPowerUps: function() {
        this.powerUps = this.add.group();
        this.powerUps.enableBody = true;
    },
    
    createPowerUp: function(x, y, key, scale, speedX) {
        var powerUp = this.powerUps.getFirstExists(false);
        
        if (!powerUp) {
            powerUp = new Chump.PowerUp(this.game, x, y, key, scale);
            this.powerUps.add(powerUp);
        };
        
        powerUp.reset(x, y, key, false, scale, speedX);
    },
    
    loadLevel: function() {
        this.currentEnemyIndex = 0;
        this.currentPowerUpIndex = 0;
        
        // Parsing the json level data
        this.levelData = JSON.parse(this.game.cache.getText('level' + this.currentLevel));
        
        // End of level timer
        this.endOfLevelTimer = this.game.time.events.add(this.levelData.duration * 1000, function() {
            // which level should it go to now
            if (this.currentLevel < this.numLevels) {
                this.currentLevel++;
            } else {
                this.currentLevel = 1;
            };
            
//            console.log('this.current Score', this.currentScore);
            if (!this.player.customParams.dead) {
                this.game.state.start('GameState', true, false, this.currentLevel, this.currentScore);    
            };
            
            
        }, this);
        
        this.scheduleNextEnemy();
        this.scheduleNextPowerUp();
    },
    
    showLevelText: function() {
        
        var style = {
            font: '35px Arial',
            fill: '#fff',
            align: 'center'
        };
        
        this.levelText = this.game.add.text(this.game.width / 2, this.game.height / 2, '', style);
        this.levelText.anchor.setTo(0.5);
        this.levelText.setText('Level: ' + this.currentLevel);
        this.levelText.visible = true;
        this.time.events.add(1000, this.removeLevelText, this);
        
    },
    
    removeLevelText: function() {
    
        this.levelText.visible = false;
        
    },
    
    scheduleNextEnemy: function() {
        var nextEnemy = this.levelData.enemies[this.currentEnemyIndex];
        
        if (nextEnemy) {
            var nextTime = 1000 * (nextEnemy.time - (this.currentEnemyIndex == 0 ? 0 : this.levelData.enemies[this.currentEnemyIndex - 1].time));
            
            this.nextEnemyTimer = this.game.time.events.add(nextTime, function() {
                this.createEnemy(320, nextEnemy.y * this.game.world.height, nextEnemy.key, nextEnemy.speedX);
                this.currentEnemyIndex++;
                this.scheduleNextEnemy();
            }, this);
        };
    },
    
    scheduleNextPowerUp: function() {
        var nextPowerUp = this.levelData.powerUps[this.currentPowerUpIndex];
        
        if (nextPowerUp) {
            var nextTime = 1000 * (nextPowerUp.time - (this.currentPowerUpIndex == 0 ? 0 : this.levelData.powerUps[this.currentPowerUpIndex - 1].time));
            
            this.nextPowerUpTimer = this.game.time.events.add(nextTime, function() {
                this.createPowerUp(320, nextPowerUp.y * this.game.world.height, nextPowerUp.key, nextPowerUp.scale, nextPowerUp.speedX);
                this.currentPowerUpIndex++;
                this.scheduleNextPowerUp();
            }, this);
        };
    },
    
    eatFood: function(player, food) {
        player.animations.play('eating', false);
        food.customParams.eaten = true;
        food.kill();
         Chump.GameState.uiBlocked = false;
    },
    
    powerUpPlayer: function(player, powerUp) {
        this.emitter = Chump.game.add.emitter(player.position.x, player.position.y, 100);
        this.emitter.makeParticles('powerParticle');
        // --- (x & y) particles go everywhere for -200 to 200
        this.emitter.minParticleSpeed.setTo(-200, -200);
        this.emitter.maxParticleSpeed.setTo(200, 200);
        this.emitter.gravity = 0;
        // (all particles release at once, lifespan of particles in ms, frequency(5 particles/second) how many particles released)
//        emitter.start(true, 500, null, 100);
        // Particle explosion upon power up ---- end
        this.emitter.start(true, 1000, null, 100);
        player.customParams.powerUp = true;
        powerUp.kill();
        
    }
    
};

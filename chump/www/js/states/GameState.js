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
        
        this.player = this.game.add.sprite(65, this.game.world.height * 0.45, 'player');
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

        var graphicStyle = {
            font: '10px Arial',
            fill: '#fff'
        };
        
        var graphics0 = this.game.add.graphics(0, 0);
//        graphics0.beginFill(0xFF3300);
        graphics0.lineStyle(3, 0xffd900);
        graphics0.lineTo(this.game.world.width, 0);
        var graphics0text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0, '0%', graphicStyle);
        graphics0text.fixedToCamera = true;

        var graphics5 = this.game.add.graphics(0, this.game.world.height * 0.05);
//        graphics5.beginFill(0xFF3300);
        graphics5.lineStyle(3, 0xffd900);
        graphics5.lineTo(this.game.world.width, 0);
        var graphics5text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.05, '5%', graphicStyle);
        graphics5text.fixedToCamera = true;

        var graphics10 = this.game.add.graphics(0, this.game.world.height * 0.1);
//        graphics10.beginFill(0xFF3300);
        graphics10.lineStyle(3, 0xffd900);
        graphics10.lineTo(this.game.world.width, 0);
        var graphics10text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.1, '10%', graphicStyle);
        graphics10text.fixedToCamera = true;

        var graphics15 = this.game.add.graphics(0, this.game.world.height * 0.15);
//        graphics15.beginFill(0xFF3300);
        graphics15.lineStyle(3, 0xffd900);
        graphics15.lineTo(this.game.world.width, 0);
        var graphics15text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.15, '15%', graphicStyle);
        graphics15text.fixedToCamera = true;

        var graphics20 = this.game.add.graphics(0, this.game.world.height * 0.2);
//        graphics20.beginFill(0xFF3300);
        graphics20.lineStyle(3, 0xffd900);
        graphics20.lineTo(this.game.world.width, 0);
        var graphics20text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.2, '20%', graphicStyle);
        graphics20text.fixedToCamera = true;

        var graphics25 = this.game.add.graphics(0, this.game.world.height * 0.25);
//        graphics25.beginFill(0xFF3300);
        graphics25.lineStyle(3, 0xffd900);
        graphics25.lineTo(this.game.world.width, 0);
        var graphics25text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.25, '25%', graphicStyle);
        graphics25text.fixedToCamera = true;

        var graphics30 = this.game.add.graphics(0, this.game.world.height * 0.3);
//        graphics30.beginFill(0xFF3300);
        graphics30.lineStyle(3, 0xffd900);
        graphics30.lineTo(this.game.world.width, 0);
        var graphics30text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.3, '30%', graphicStyle);
        graphics30text.fixedToCamera = true;

        var graphics35 = this.game.add.graphics(0, this.game.world.height * 0.35);
//        graphics35.beginFill(0xFF3300);
        graphics35.lineStyle(3, 0xffd900);
        graphics35.lineTo(this.game.world.width, 0);
        var graphics35text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.35, '35%', graphicStyle);
        graphics35text.fixedToCamera = true;

        var graphics40 = this.game.add.graphics(0, this.game.world.height * 0.4);
//        graphics40.beginFill(0xFF3300);
        graphics40.lineStyle(3, 0xffd900);
        graphics40.lineTo(this.game.world.width, 0);
        var graphics40text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.4, '40%', graphicStyle);
        graphics40text.fixedToCamera = true;

        var graphics45 = this.game.add.graphics(0, this.game.world.height * 0.45);
//        graphics45.beginFill(0xFF3300);
        graphics45.lineStyle(3, 0xffd900);
        graphics45.lineTo(this.game.world.width, 0);
        var graphics45text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.45, '45%', graphicStyle);
        graphics45text.fixedToCamera = true;

        var graphics50 = this.game.add.graphics(0, this.game.world.height * 0.5);
//        graphics50.beginFill(0xFF3300);
        graphics50.lineStyle(3, 0xffd900);
        graphics50.lineTo(this.game.world.width, 0);
        var graphics50text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.5, '50%', graphicStyle);
        graphics50text.fixedToCamera = true;

        var graphics55 = this.game.add.graphics(0, this.game.world.height * 0.55);
//        graphics55.beginFill(0xFF3300);
        graphics55.lineStyle(3, 0xffd900);
        graphics55.lineTo(this.game.world.width, 0);
        var graphics55text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.55, '55%', graphicStyle);
        graphics55text.fixedToCamera = true;

        var graphics60 = this.game.add.graphics(0, this.game.world.height * 0.6);
//        graphics60.beginFill(0xFF3300);
        graphics60.lineStyle(3, 0xffd900);
        graphics60.lineTo(this.game.world.width, 0);
        var graphics60text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.6, '60%', graphicStyle);
        graphics60text.fixedToCamera = true;

        var graphics65 = this.game.add.graphics(0, this.game.world.height * 0.65);
//        graphics65.beginFill(0xFF3300);
        graphics65.lineStyle(3, 0xffd900);
        graphics65.lineTo(this.game.world.width, 0);
        var graphics65text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.65, '65%', graphicStyle);
        graphics65text.fixedToCamera = true;

        var graphics70 = this.game.add.graphics(0, this.game.world.height * 0.7);
//        graphics70.beginFill(0xFF3300);
        graphics70.lineStyle(3, 0xffd900);
        graphics70.lineTo(this.game.world.width, 0);
        var graphics70text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.7, '70%', graphicStyle);
        graphics70text.fixedToCamera = true;

        var graphics75 = this.game.add.graphics(0, this.game.world.height * 0.75);
//        graphics75.beginFill(0xFF3300);
        graphics75.lineStyle(3, 0xffd900);
        graphics75.lineTo(this.game.world.width, 0);
        var graphics75text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.75, '75%', graphicStyle);
        graphics75text.fixedToCamera = true;

        var graphics80 = this.game.add.graphics(0, this.game.world.height * 0.8);
//        graphics80.beginFill(0xFF3300);
        graphics80.lineStyle(3, 0xffd900);
        graphics80.lineTo(this.game.world.width, 0);
        var graphics80text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.8, '80%', graphicStyle);
        graphics80text.fixedToCamera = true;

        var graphics85 = this.game.add.graphics(0, this.game.world.height * 0.85);
//        graphics85.beginFill(0xFF3300);
        graphics85.lineStyle(3, 0xffd900);
        graphics85.lineTo(this.game.world.width, 0);
        var graphics85text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.85, '85%', graphicStyle);
        graphics85text.fixedToCamera = true;

        var graphics90 = this.game.add.graphics(0, this.game.world.height * 0.9);
//        graphics90.beginFill(0xFF3300);
        graphics90.lineStyle(3, 0xffd900);
        graphics90.lineTo(this.game.world.width, 0);
        var graphics90text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.9, '90%', graphicStyle);
        graphics90text.fixedToCamera = true;

        var graphics95 = this.game.add.graphics(0, this.game.world.height * 0.95);
//        graphics95.beginFill(0xFF3300);
        graphics95.lineStyle(3, 0xffd900);
        graphics95.lineTo(this.game.world.width, 0);
        var graphics95text = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.95, '95%', graphicStyle);
        graphics95text.fixedToCamera = true;



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
                console.log('enemyY', nextEnemy.y)
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

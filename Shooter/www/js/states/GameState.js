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
        
        var enemy = new Shooter.Enemy(this.game, 100, 100, 'greenEnemy', 10, []);
        this.game.add.existing(enemy);
        
    },
    
    update: function() {
        // player speed at init and it also stops from continuous movement with one touch/click
        this.player.body.velocity.x = 0;
        // event listeners
        if (this.game.input.activePointer.isDown) {
            // This is the x position of the user touch
            var targetX = this.game.input.activePointer.position.x;
            // direction will be 1 if right, -1 if left
            var direction = targetX >= this.game.world.centerX ? 1 : -1;
            
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
            bullet.reset(this.player.x, this.player.top);
        }
        
        // set velocity
        bullet.body.velocity.y = this.BULLET_SPEED;
        
        
    }
    
};














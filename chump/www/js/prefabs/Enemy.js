var Chump = Chump || {};

Chump.Enemy = function(game, x, y, key) {
    Phaser.Sprite.call(this, game, x, y, key);
    
    // adding physics -- collision
    this.game = game;
    this.game.physics.arcade.enable(this);
    this.customParams = {};
    this.customParams.dead = false;
    
    this.animations.add('flying', [0, 1, 2, 3, 4, 5], 6, true);
    this.anchor.setTo(0.5);
    
    this.enemyTimer = this.game.time.create(false); // Should timer destroy itself after 1 go round?
    this.enemyTimer.start();
};

Chump.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Chump.Enemy.prototype.constructor = Chump.Enemy;

Chump.Enemy.prototype.update = function() {
    
    if (this.right <= 0) {
        this.customParams.dead = true;
        this.kill();
    }
    
};

Chump.Enemy.prototype.dead = function() {
    
    this.position.y += 2;
    
};

Chump.Enemy.prototype.reset = function(x, y, key, dead, speedX) {
    
    Phaser.Sprite.prototype.reset.call(this, x, y);
    
    this.loadTexture(key);
    this.scale.setTo(-0.75, 0.75);
    this.body.velocity.x = -speedX * 30;
    this.customParams.dead = false;
    this.play('flying');
    
    this.enemyTimer.resume(); // when enemy dies it pauses the timer in the damage method above. It recalls the killed enemy and resumes the timer
    
};

var Chump = Chump || {};

Chump.PowerUp = function(game, x, y, key, scale) {

    Phaser.Sprite.call(this, game, x, y, key, scale);
    
    this.game = game;
    this.game.physics.arcade.enable(this);
    this.customParams = {};
    this.customParams.eaten = false;
    
    this.anchor.setTo(0.5);
    
};

Chump.PowerUp.prototype = Object.create(Phaser.Sprite.prototype);
Chump.PowerUp.prototype.constructor = Chump.PowerUp;

Chump.PowerUp.prototype.update = function() {
    
    if (this.right <= 0) {
        this.customParams.eaten = false;
    }
    
};

Chump.PowerUp.prototype.reset = function(x, y, key, eaten, scale, speedX) {
    
    Phaser.Sprite.prototype.reset.call(this, x, y);
    
    this.loadTexture(key);
    this.scale.setTo(2, 2);
    this.body.velocity.x = -speedX * 30;
    this.customParams.eaten = eaten;
    
};
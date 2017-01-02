var Chump = Chump || {};

Chump.Food = function(game, x, y, key) {
    
    Phaser.Sprite.call(this, game, x, y, key);
    
    this.game = game;
    this.game.physics.arcade.enable(this);
    this.customParams = {}
    this.customParams.eaten = false;
//    this.customParams.dead = false;
    this.anchor.setTo(0.5);
    
};

Chump.Food.prototype = Object.create(Phaser.Sprite.prototype);
Chump.Food.prototype.constructor = Chump.Food;

Chump.Food.prototype.update = function() {
    
    if (this.right <= 0) {
        this.customParams.eaten = false;
        this.kill();
    }

    // if (this.customParams.eaten) {
    //     Chump.GameState.uiBlocked = false;
    // } 
    // problem -- if first food is eaten ui is unblocked after first can place as many food pellets as user wants.
    
};

Chump.Food.prototype.reset = function(x, y, key, eaten, speedX) {
    Phaser.Sprite.prototype.reset.call(this, x, y);
    
    this.loadTexture(key);
    if (key == 'powerFood') {
        this.scale.setTo(1.5, 1.5)
    }
    this.body.velocity.x = -speedX * 30;
    this.customParams.eaten = eaten;
    
};
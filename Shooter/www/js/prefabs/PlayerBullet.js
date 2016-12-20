var Shooter = Shooter || {};

// The player bullet needs to behave like a sprite in all ways so it will inherit from phaser.sprite object (class)... damn... inheritance in js suuucks

Shooter.PlayerBullet = function(game, x, y) {
    // When we create a playerBullet, this creates a sprite with the parameters
    Phaser.Sprite.call(this, game, x, y, 'bullet');
    
    this.anchor.setTo(0.5);
    
//    kill the bullet when it leaves the screen (not delete, but kill so that it can be reused)
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    
    // to check to see if the bullets are being recycled, in devtools `Shooter.GameState.playerBullets.children. at any one time there are only 3 bullets in memory
    // woo for recycling! 
};

Shooter.PlayerBullet.prototype = Object.create(Phaser.Sprite.prototype);
Shooter.PlayerBullet.prototype.constructor = Shooter.PlayerBullet;
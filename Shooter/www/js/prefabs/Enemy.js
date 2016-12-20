var Shooter = Shooter || {};

Shooter.Enemy = function(game, x, y, key, health, enemyBullets) {
    Phaser.Sprite.call(this, game, x, y, key);
    
    // added physics -- for velocity, collision etc
    this.game = game;
    this.game.physics.arcade.enable(this);
    
    this.animations.add('getHit', [0, 1, 2, 1, 0], 25, false);
    this.anchor.setTo(0.5);
    this.health = health;
};

Shooter.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Shooter.Enemy.prototype.constructor = Shooter.Enemy;

Shooter.Enemy.prototype.update = function(){
    // if the enemies hit the edges of the screen it changes the velocity to negative so it switches directions
    if (this.x < 0.05 * this.game.world.width){
        this.x = 0.05 * this.game.world.width + 2;
        this.body.velocity.x *= -1;
    } else if (this.x > 0.95 * this.game.world.width){
        this.x = 0.95 * this.game.world.width - 2;
        this.body.velocity.x *= -1;
    }
    
    if (this.top > this.game.world.height) {
        this.kill();
    }
};

Shooter.Enemy.prototype.damage = function(amount) {
    Phaser.Sprite.prototype.damage.call(this, amount);
    
    this.play('getHit');
};
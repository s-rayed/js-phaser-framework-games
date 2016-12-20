var Shooter = Shooter || {};

Shooter.Enemy = function(game, x, y, key, health, enemyBullets) {
    Phaser.Sprite.call(this, game, x, y, key);
    
    this.animations.add('getHit', [0, 1, 2, 1, 0], 25, false);
    this.anchor.setTo(0.5);
    this.health = health;
};

Shooter.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Shooter.Enemy.prototype.constructor = Shooter.Enemy;
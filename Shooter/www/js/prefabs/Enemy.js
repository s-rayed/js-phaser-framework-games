var Shooter = Shooter || {};

Shooter.Enemy = function(game, x, y, key, health, enemyBullets) {
    Phaser.Sprite.call(this, game, x, y, key);
    
    // added physics -- for velocity, collision etc
    this.game = game;
    this.game.physics.arcade.enable(this);
    
    this.animations.add('getHit', [0, 1, 2, 1, 0], 25, false);
    this.anchor.setTo(0.5);
    this.health = health;
    
    this.enemyBullets = enemyBullets;
    // ------------------------------------(should timer destroy itself after 1 go round?)
    this.enemyTimer = this.game.time.create(false);
    this.enemyTimer.start();
    
    this.scheduleShooting();
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
    
    // Particle explosion when enemy dies
    if (this.health <= 0) {
        // phaser method ------------------(x and y position, # of particles to appear)
        var emitter = this.game.add.emitter(this.x, this.y, 100);
        emitter.makeParticles('enemyParticle');
        // ----------------------(x and y) particles go everywhere from -200 to 200
        emitter.minParticleSpeed.setTo(-200, -200);
        emitter.maxParticleSpeed.setTo(200, 200);
        emitter.gravity = 0;
        // ----------(all particles released at once (explosion)?, lifespan of particles in ms, frequency (5particles every 5 seconds for example), how many particles released)
        emitter.start(true, 500, null, 100);
        
        this.enemyTimer.pause();
    }
};
// custom reset function for easily changing enemies position, health, key, size and speed
Shooter.Enemy.prototype.reset = function(x, y, health, key, scale, speedX, speedY) {
    Phaser.Sprite.prototype.reset.call(this, x, y, health);
    
    this.loadTexture(key);
    this.scale.setTo(scale);
    this.body.velocity.x = speedX;
    this.body.velocity.y = speedY;
    
    // when enemy dies it pauses the timer in the damage method above. here it recalls the killed enemy and resumes the time.
    this.enemyTimer.resume();
};

Shooter.Enemy.prototype.scheduleShooting = function() {
    this.shoot();
    
    this.enemyTimer.add(Phaser.Timer.SECOND * 2, this.scheduleShooting, this);
};

Shooter.Enemy.prototype.shoot = function() {
    var bullet = this.enemyBullets.getFirstExists(false);
    
    if(!bullet) {
        bullet = new Shooter.EnemyBullet(this.game, this.x, this.bottom);
        this.enemyBullets.add(bullet);
    } else {
        bullet.reset(this.x, this.y);
    }
    
    bullet.body.velocity.y = 100;
};
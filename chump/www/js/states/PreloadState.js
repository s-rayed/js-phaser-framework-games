var Chump = Chump || {};

Chump.PreloadState = {
    
    preload: function() {
        this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.logo.anchor.setTo(0.5);
        
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadBar');
        this.preloadBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.preloadBar);
        
        this.load.image('background', 'assets/images/background.png');
//        this.load.image('enemy', 'assets/images/gorilla3.png');
        this.load.image('food', 'assets/images/bird_food_sprite.png');
        this.load.image('powerFood', 'assets/images/bird_power_food_sprite.png');
        this.load.image('powerParticle', 'assets/images/powerParticle.png');
        this.load.spritesheet('player', 'assets/images/good_bird_spritesheet_w_powerup.png', 115, 88, 8);
        this.load.spritesheet('enemy', 'assets/images/evil_bird_spritesheet.png', 96, 64, 7);// width, height, #of frames
        
        // Load level data
        this.load.text('level1', 'assets/data/level1.json');
        this.load.text('level2', 'assets/data/level2.json');
    },
    
    create: function() {
        this.state.start('HomeState');
    }
    
};
var Match3 = Match3 || {};

// Loading the game assets

Match3.PreloadState = {
    
    preload: function() {
        //Show loading screen
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bar');
        this.preloadBar.anchor.setTo(0.5);
        this.preloadBar.scale.setTo(100, 1);
        this.load.setPreloadSprite(this.preloadBar);
        
        // Load game assets
        this.load.image('block1', 'assets/images/gem_blue.png');
        this.load.image('block2', 'assets/images/gem_green.png');
        this.load.image('block3', 'assets/images/gem_orange.png');
        this.load.image('block4', 'assets/images/gem_pink.png');
        this.load.image('block5', 'assets/images/gem_purple.png');
        this.load.image('block6', 'assets/images/gem_yellow.png');
        this.load.image('block7', 'assets/images/gem_red.png');
        this.load.image('block8', 'assets/images/gem_white.png');
//        this.load.image('deadBlock', 'assets/images/gem_dead.png');
        this.load.image('background', 'assets/images/backyard2.png');
    },
    
    create: function() {
        this.state.start('Game');
    }
    
};
var Match3 = Match3 || {};

// setting game configuration and loading assets for loading screen

Match3.BootState = {
    
    init: function() {
        // Loading screen will have a white background
        this.game.stage.backgroundColor = '#fff';
        
        // Scaling options
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        // Have the game centered Horizontally!
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    },
    
    preload: function() {
        // Assets we'll use in the loading screen
        this.load.image('bar', 'assets/images/preloader-bar.png');
    },
    
    create: function() {
        this.state.start('Preload');    
    }
    
};
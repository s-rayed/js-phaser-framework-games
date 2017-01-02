var Chump = Chump || {};

Chump.BootState = {
    init: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0,0, 360, 700);
    },
    
    preload: function() {
        this.load.image('preloadBar', 'assets/images/preloader-bar.png');
        this.load.image('logo', 'assets/images/logo.png');
    },
    
    create: function() {
        this.game.stage.backgroundColor = '#fff';
        
        this.state.start('PreloadState');
    }
};
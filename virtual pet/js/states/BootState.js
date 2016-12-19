// This is the BootState executed when preload finishes
var BootState = {
  // initiate some game-level settings
  init: function() {
    // for responsiveness according to dimensions identified in game object
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  },

  preload: function() {
    this.load.image('preloadBar', 'assets/images/bar.png');
    this.load.image('logo', 'assets/images/rubber_duck.png');
  },

  create: function() {
    this.game.stage.backgroundColor = '#fff';

    this.state.start('PreloadState');
  }
};
// creating a new game instance that is 640x360
// the last param is saying if a webGL is available
// use it, if not default to the canvas 
var game = new Phaser.Game(640, 360, Phaser.AUTO);

// first loads, then uses it to create then updates
// continuously (running game)
var GameState = {
  preload: function(){
    this.load.image('background', 'assets/images/background.png');
    this.load.image('chicken', 'assets/images/chicken.png');
    this.load.image('horse', 'assets/images/horse.png');
    this.load.image('pig', 'assets/images/pig.png');
    this.load.image('sheep', 'assets/images/sheep3.png');
    this.load.image('arrow', 'assets/images/arrow.png');
  },
  create: function(){

    //--These 3 lines scale the game for all devices (responsive)-
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageVertically = true;
    // --------------------------------------------------

    // create a sprite for the background
    this.background = this.game.add.sprite(0, 0, 'background');

    var animalData = [
      { key: 'chicken', text: 'CHICKEN' },
      { key: 'horse', text: 'HORSE' },
      { key: 'pig', text: 'PIG' },
      { key: 'sheep', text: 'SHEEP' }
    ];

    this.animals = this.game.add.group();

    var self = this;

    animalData.forEach(function(element){
      animal = self.animals.create(-1000, self.game.world.centerY, element.key);

      animal.customParams = { text: element.text };
      animal.anchor.setTo(0.5);

      animal.inputEnabled = true;
      animal.input.pixelPerfectClick = true;
      animal.events.onInputDown.add(self.animateAnimal, self);
    });

    // the next() method is a built in phaser group method animalData is a group
    this.currentAnimal = this.animals.next();
    this.currentAnimal.position.setTo(this.game.world.centerX, this.game.world.centerY);

    /*--------------------------
    // center of the world
    this.chicken = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'chicken');
    // place a sprite by its center, not default top-left corner
    this.chicken.anchor.setTo(0.5, 0.5);
    this.chicken.scale.setTo(2,1);

    this.horse = this.game.add.sprite(120, 10, 'horse');
    this.horse.scale.setTo(0.5, 0.5);

    this.pig = this.game.add.sprite(500, 300, 'pig');
    this.pig.anchor.setTo(0.5, 0.5);
    // flipping images horizontally 
    // this.pig.scale.setTo(-1, 1); // to flip vertically use -1 on y

    this.sheep = this.game.add.sprite(100, 250, 'sheep');
    this.sheep.scale.setTo(0.5, 0.5);
    // rotating around anchor (default at top left corner)
    this.sheep.angle = 90;
    // if you wanna rotate around center then set anchor to 0.5
    this.sheep.anchor.setTo(0.5, 0.5);

    // enable user input on sprite
    this.pig.inputEnabled = true;
    this.pig.input.pixelPerfectClick = true;
    this.pig.events.onInputDown.add(this.animateAnimal, this);

  ------------ */

    // left arrow
    this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
    this.leftArrow.anchor.setTo(0.5);
    this.leftArrow.scale.x = -1;
    this.leftArrow.customParams = { direction: -1 };

    // left arrow allow user input
    this.leftArrow.inputEnabled = true;
    // pixel perfect checking is to make the touch/click inputs on the image only it self not the entire rectangle of the image.
    this.leftArrow.input.pixelPerfectClick = true;
    this.leftArrow.events.onInputDown.add(this.switchAnimal, this);

    // right arrow
    this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, 'arrow');
    this.rightArrow.anchor.setTo(0.5);
    this.rightArrow.customParams = { direction: 1 }; 
    this.rightArrow.inputEnabled = true;
    this.rightArrow.input.pixelPerfectClick = true;
    this.rightArrow.events.onInputDown.add(this.switchAnimal, this);

  },
  // update is called many times per second
  update: function(){
    // this.sheep.angle += 0.5;

  },
  animateAnimal: function(sprite, event) {
    console.log('animate animal');
  },
  switchAnimal: function(sprite, event){
    
  }
};

game.state.add("GameState", GameState);
game.state.start("GameState");

// to show images, first you load it in preload, then create a sprite in create.

// the anchor point is a point of reference in the image you are using to position the image on your canvas.
// for the chicken its anchor point is set to 0.5 0.5, 50% of its X (width), 50% of its height (Y). so the image is positioned at the center of the background relative to the center of the image.

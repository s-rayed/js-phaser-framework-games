// creating a new game instance that is 640x360
// the last param is saying if a webGL is available
// use it, if not default to the canvas 
var game = new Phaser.Game(640, 360, Phaser.AUTO);

// first loads, then uses it to create then updates
// continuously (running game)
var GameState = {
  preload: function(){
    this.load.image('background', 'assets/images/background.png');
    this.load.image('arrow', 'assets/images/arrow.png');

    this.load.spritesheet('chicken', 'assets/images/chicken_spritesheet.png', 131, 200, 3);
    this.load.spritesheet('horse', 'assets/images/horse_spritesheet.png', 212, 200, 3);
    this.load.spritesheet('pig', 'assets/images/pig_spritesheet.png', 297, 200, 3);
    this.load.spritesheet('sheep', 'assets/images/sheep_spritesheet.png', 244, 200, 3);

    this.load.audio('chickenSound', ['assets/audio/chicken.ogg', 'assets/audio/chicken.mp3']);
    this.load.audio('horseSound', ['assets/audio/horse.ogg', 'assets/audio/horse.mp3']);
    this.load.audio('pigSound', ['assets/audio/pig.ogg', 'assets/audio/pig.mp3']);
    this.load.audio('sheepSound', ['assets/audio/sheep.ogg', 'assets/audio/sheep.mp3']);
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
      { key: 'chicken', text: 'CHICKEN', audio: 'chickenSound' },
      { key: 'horse', text: 'HORSE', audio: 'horseSound' },
      { key: 'pig', text: 'PIG', audio: 'pigSound' },
      { key: 'sheep', text: 'SHEEP', audio: 'sheepSound' }
    ];
    //create a group to store all animals
    this.animals = this.game.add.group();

    var self = this;

    animalData.forEach(function(element){
      // create each animal and save its properties
      animal = self.animals.create(-1000, self.game.world.centerY, element.key, 0);// the 0 at the end is which frame it uses from the sprite to create the animal

      // I'm saving everything that's not Phaser-related in an object
      animal.customParams = { text: element.text, sound: self.game.add.audio(element.audio) };
      // anchor point set to the center of the sprite
      animal.anchor.setTo(0.5);

      // creating animal animation -- 
      //   add animation('name', order of frames, frames/second, if animation should continue forever)
      animal.animations.add('animate', [0,1,2,1,0,1], 3, false);


      // enable input so we can touch it
      animal.inputEnabled = true;
      animal.input.pixelPerfectClick = true;
      animal.events.onInputDown.add(self.animateAnimal, self);
    });

    // the next() method is a built in phaser group method animalData is a group -- this places first animal in the middle
    this.currentAnimal = this.animals.next();
    this.currentAnimal.position.setTo(this.game.world.centerX, this.game.world.centerY);

    // show Animal text
    this.showText(this.currentAnimal);

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
    sprite.play('animate');
    sprite.customParams.sound.play();
  },
  switchAnimal: function(sprite, event){

    if(this.isMoving){
      return false;
    }

    this.isMoving = true;

    // hide text
    this.animalText.visible = false;

    var newAnimal, endX;

    // get the direction of the arrow
    if (sprite.customParams.direction > 0) {
      newAnimal = this.animals.next();
      newAnimal.x = -newAnimal.width / 2;
      endX = 640 + this.currentAnimal.width / 2;
    } else {
      newAnimal = this.animals.previous();
      newAnimal.x = 640 + newAnimal.width / 2;
      endX = -this.currentAnimal.width / 2;
    }

    newAnimalMovement = this.game.add.tween(newAnimal);
    newAnimalMovement.to({ x: this.game.world.centerX }, 1000);
    newAnimalMovement.onComplete.add(function(){
      this.isMoving = false;
      this.showText(newAnimal);
    }, this);
    newAnimalMovement.start();

    currentAnimalMovement = this.game.add.tween(this.currentAnimal);
    currentAnimalMovement.to({ x: endX }, 1000);
    currentAnimalMovement.start();



    this.currentAnimal = newAnimal;
  },
  showText: function(animal) {
    if (!this.animalText){
      var style = {
        font: 'bold 30pt Arial',
        fill: '#D0171B',
        align: 'center'
      }
      this.animalText = this.game.add.text(this.game.width / 2, this.game.height * 0.85, '', style);
      this.animalText.anchor.setTo(0.5);
    }

    this.animalText.setText(animal.customParams.text);
    this.animalText.visible = true;
  }
};

game.state.add("GameState", GameState);
game.state.start("GameState");

// to show images, first you load it in preload, then create a sprite in create.

// the anchor point is a point of reference in the image you are using to position the image on your canvas.
// for the chicken its anchor point is set to 0.5 0.5, 50% of its X (width), 50% of its height (Y). so the image is positioned at the center of the background relative to the center of the image.

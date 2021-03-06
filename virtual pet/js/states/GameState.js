// This is the GameState
var GameState = {

  // executed after everything is loaded
  create: function() {
    this.background = this.game.add.sprite(0,0, 'backyard');
    this.background.inputEnabled = true;
    this.background.events.onInputDown.add(this.placeItem, this);


    this.pet = this.game.add.sprite(100, 400, 'pet');
    this.pet.anchor.setTo(0.5);

    // spritesheet animation
    this.pet.animations.add('funnyfaces', [1, 2, 3, 2, 1], 7, false);

    // custom properties
    this.pet.customParams = { health: 100, fun: 100 };

    // draggable pet
    this.pet.inputEnabled = true;
    this.pet.input.enableDrag();

    this.apple = this.game.add.sprite(72, 570, 'apple');
    this.apple.anchor.setTo(0.5);
    this.apple.inputEnabled = true;
    this.apple.customParams = { health: 20 };
    this.apple.events.onInputDown.add(this.pickItem, this);
    this.candy = this.game.add.sprite(144, 570, 'candy');

    this.candy.anchor.setTo(0.5);
    this.candy.inputEnabled = true;
    this.candy.customParams = { health: -10, fun: 10 };
    this.candy.events.onInputDown.add(this.pickItem, this);

    this.toy = this.game.add.sprite(216, 570, 'toy');
    this.toy.anchor.setTo(0.5);
    this.toy.inputEnabled = true;
    this.toy.customParams = { fun: 20 };
    this.toy.events.onInputDown.add(this.pickItem, this);

    this.rotate = this.game.add.sprite(288, 570, 'rotate');
    this.rotate.anchor.setTo(0.5);
    this.rotate.inputEnabled = true;
    this.rotate.events.onInputDown.add(this.rotatePet, this);

    this.buttons = [this.apple, this.candy, this.toy, this.rotate];

    // nothing is selected
    this.selectedItem = null;
    // the UI is not blocked at the beginning
    this.uiBlocked = false;

    var style = {
      font: '20px Arial',
      fill: '#fff'
    };
    this.game.add.text(10, 20, 'Health: ', style);
    this.game.add.text(140, 20, 'Fun: ', style);

    this.healthText = this.game.add.text(80, 20, '', style);
    this.funText = this.game.add.text(185, 20, '', style);

    this.refreshStats();

    // decrease health every 5 seconds
    this.statsDecreaser = this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.reduceProperties, this)
  },

  pickItem: function(sprite, event) {
    if (!this.uiBlocked){
      console.log('pick item');

      this.clearSelection();

      // semi-transparent sprite
      sprite.alpha = 0.4;

      this.selectedItem = sprite;
    }
    
  },

  rotatePet: function(sprite, event){
    if (!this.uiBlocked){
      // Blocking UI until rotation ends
      this.uiBlocked = true;

      this.clearSelection();
      // Alpha to indicate selection and make transparent
      sprite.alpha = 0.4;

      // Adding tween animation (rotating pet)
      var petRotation = this.game.add.tween(this.pet);

      petRotation.to({ angle: '+720' }, 1000);
      // when rotation completed clear transparency, unblock ui, increase fun
      petRotation.onComplete.add(function(){
        this.uiBlocked = false;

        sprite.alpha = 1;

        this.pet.customParams.fun += 10;
        console.log('fun is now', this.pet.customParams.fun);

        this.refreshStats();

      }, this);

      petRotation.start();

    }
  },

  clearSelection: function() {
    this.buttons.forEach(function(element, index){
      element.alpha = 1;
    });

    this.selectedItem = null;
  },

  placeItem: function(sprite, event){

    if (this.selectedItem && !this.uiBlocked){
      var x = event.position.x;
      var y = event.position.y;

      var newItem = this.game.add.sprite(x, y, this.selectedItem.key);
      newItem.anchor.setTo(0.5);
      newItem.customParams = this.selectedItem.customParams;

      this.uiBlocked = true;

      // move the pet towards the item
      var petMovement = this.game.add.tween(this.pet);
      petMovement.to({ x: x, y: y }, 700);
      petMovement.onComplete.add(function(){
        // destroy the item (eating it)
        newItem.destroy();

        // play the animation
        this.pet.animations.play('funnyfaces');

        // release the ui
        this.uiBlocked = false;

        var stat;

        for(stat in newItem.customParams){
          // this if check is just in case there is a stat in the prototype of the object. not necessary but good to do
          if (newItem.customParams.hasOwnProperty(stat)){
            console.log(stat);
            this.pet.customParams[stat] += newItem.customParams[stat];
          }
        }

        // update the stats and display
        this.refreshStats();

      }, this);
      // starting tween animation
      petMovement.start();
    }

  },

  refreshStats: function() {
    this.healthText.text = this.pet.customParams.health;
    this.funText.text = this.pet.customParams.fun;
  },

  reduceProperties: function() {
    this.pet.customParams.health -= 10;
    this.pet.customParams.fun -= 15;
    this.refreshStats();
  },

  // this is in every phaser game and is executed multiple times per second
  update: function() {
    if (this.pet.customParams.health <= 0 || this.pet.customParams.fun <= 0) {
      this.pet.frame = 4;
      this.uiBlocked = true;

      this.game.time.events.add(2000, this.gameOver, this);
    }
  },

  gameOver: function() {
    // state to home(which state, true means refresh everything, false because we want to keep the game cache, passing in variable which is the message)
    this.state.start('HomeState', true, false, 'GAME OVER');
  }

};
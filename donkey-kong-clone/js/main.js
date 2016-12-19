// One state game
var GameState = {

  // initiate game settings
  init: function() {
    // adapt game to screen size
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    // Enabling Physics (Gravity etc)
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    // the 1000 says basically the "strength" of gravity
    this.game.physics.arcade.gravity.y = 1000;

    // keyboard listeners
    this.cursors = this.game.input.keyboard.createCursorKeys();

    // setting world boundaries(starts at (0,0) coordinates, width+height of game screen)
    this.game.world.setBounds(0, 0, 360, 700);

    this.RUNNING_SPEED = 180;
    this.JUMPING_SPEED = 550;

  },

  // load game assets before the game starts
  preload: function() {
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('platform', 'assets/images/platform.png');
    this.load.image('goal', 'assets/images/gorilla3.png');
    this.load.image('arrowButton', 'assets/images/arrowButton.png');
    this.load.image('actionButton', 'assets/images/actionButton.png');
    this.load.image('barrel', 'assets/images/barrel.png');

    this.load.spritesheet('player', 'assets/images/player_spritesheet.png', 28, 30, 5, 1, 1);
    this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', 20, 21, 2, 1, 1);

    this.load.text('level', 'assets/data/level.json');
  },

  // executed after everything is loaded
  create: function() {

    this.ground = this.add.sprite(0, 638, 'ground');
    // applying the physics to each sprite that needs it
    this.game.physics.arcade.enable(this.ground);
    // this is so that the ground is stationary
    this.ground.body.allowGravity = false;
    // this is so that ground doesnt move down when the player steps/jumps on it
    this.ground.body.immovable = true;

    // parse the json level data file, so we can treat it as an object-- were using the cache which is loaded at start
    this.levelData = JSON.parse(this.game.cache.getText('level'));


    this.platforms = this.add.group();
    // by adding enable body all of the elements will have physics enabled
    this.platforms.enableBody = true;

    this.levelData.platformData.forEach(function(element) {
      this.platforms.create(element.x, element.y, 'platform');
    }, this);

    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.allowGravity', false); // explanations for these 2 are below in the comments

    // fires
    this.fires = this.add.group();
    this.fires.enableBody = true; // enable physics -- enableBody is for GROUPS -- just enable such as when creating
    // gorilla we use jjust enable

    var fire;
    this.levelData.fireData.forEach(function(element) {
      fire = this.fires.create(element.x, element.y, 'fire');
      fire.animations.add('fire', [0, 1], 4, true);
      fire.play('fire');
    }, this);

    this.fires.setAll('body.allowGravity', false);

/*
    this.platform = this.add.sprite(0, 300, 'platform');
    // applying physics to platform
    this.game.physics.arcade.enable(this.platform);
    // this is so that the platform is stationary and not moving down by itself
    this.platform.body.allowGravity = false;
    // this is so that platform doesnt move down when the player steps/jumps on it
    this.platform.body.immovable = true;
*/

    // create goal (gorilla)
    this.goal = this.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'goal');
    this.game.physics.arcade.enable(this.goal);
    this.goal.body.allowGravity = false;


    // create player
    this.player = this.add.sprite(this.levelData.playerStart.x, this.levelData.playerStart.y, 'player', 3);
    this.player.anchor.setTo(0.5);
    this.player.animations.add('walking', [0, 1, 2, 1], 6, true);
    // applying physics to player
    this.game.physics.arcade.enable(this.player);
    
    this.player.customParams = {};

    // this follows the player wherever he goes
    this.game.camera.follow(this.player);

    this.createOnscreenControls();

    // create barrels (pool of objects)
    this.barrels = this.add.group();
    this.barrels.enableBody = true;

    this.barrelCreator = this.game.time.events.loop(Phaser.Timer.SECOND * this.levelData.barrelFrequency, this.createBarrel, this);


  },

  update: function(){
    // collision detection
    // physics ( which 2 items are colliding)
    this.game.physics.arcade.collide(this.player, this.ground);
    // collide is when you want 2 elements to effect each others velocities, momentum etc
    // overlap is when you want to check when 2 elements are in the same space but those 2 dont interfere with eachother
    // in both cases you can pass a callback function such as this.landed below.
    this.game.physics.arcade.collide(this.player, this.platforms/*, this.landed */);

    // fire collision
    this.game.physics.arcade.overlap(this.player, this.fires, this.killPlayer);

    // gorilla collision
    this.game.physics.arcade.overlap(this.player, this.goal, this.win);


    // for keyboard listeners
    // platformer games work this way. elements have a horizontal speed of 0 and is changed when we want it to
    this.player.body.velocity.x = 0;

    if (this.cursors.left.isDown || this.player.customParams.isMovingLeft) {
      this.player.body.velocity.x = -this.RUNNING_SPEED;
      // this.is to flip the player spritesheet back to left
      this.player.scale.setTo(1, 1);
      this.player.play('walking');
    } else if (this.cursors.right.isDown || this.player.customParams.isMovingRight) {
      this.player.body.velocity.x = this.RUNNING_SPEED;
      // this is to flip the player sprite sheet since we only have sprite sheet on 1 direction
      this.player.scale.setTo(-1, 1);
      this.player.play('walking');
    } else {
      this.player.animations.stop();
      this.player.frame = 3;
    }

    // this.player.body.touching.down checks whether the player is touching the ground or any solid surface. so it cant jump infinitely
    if ((this.cursors.up.isDown || this.player.customParams.mustJump)&& this.player.body.touching.down) {
      this.player.body.velocity.y = -this.JUMPING_SPEED;
      this.player.customParams.mustJump = false;
    }


  },

  createOnscreenControls: function() {
    this.leftArrow = this.add.button(20, 535, 'arrowButton');
    this.rightArrow = this.add.button(110, 535, 'arrowButton');
    this.actionButton = this.add.button(280, 535, 'actionButton');

    // making buttons transparent
    this.leftArrow.alpha = 0.5;
    this.rightArrow.alpha = 0.5;
    this.actionButton.alpha = 0.5;

    // this is to make sure the buttons on screen do not move while the player moves.
    this.leftArrow.fixedToCamera = true;
    this.rightArrow.fixedToCamera = true;
    this.actionButton.fixedToCamera = true;

    // Button even listeners

    // Jump up
    this.actionButton.events.onInputDown.add(function(){
      this.player.customParams.mustJump = true;
    }, this)

    this.actionButton.events.onInputUp.add(function(){
      this.player.customParams.mustJump = false;
    }, this)

    // these 2 are for performance on phones -- its for hovering over
    this.actionButton.events.onInputOver.add(function(){
      this.player.customParams.mustJump = true;
    }, this)

    this.actionButton.events.onInputOut.add(function(){
      this.player.customParams.mustJump = false;
    }, this)

    // left
    this.leftArrow.events.onInputDown.add(function() {
      this.player.customParams.isMovingLeft = true;
    }, this);

    this.leftArrow.events.onInputUp.add(function() {
      this.player.customParams.isMovingLeft = false;
    }, this);

    // these 2 are for performance on phones -- its for hovering over
    this.leftArrow.events.onInputOver.add(function() {
      this.player.customParams.isMovingLeft = true;
    }, this);

    this.leftArrow.events.onInputOut.add(function() {
      this.player.customParams.isMovingLeft = false;
    }, this);

    // right
    this.rightArrow.events.onInputDown.add(function() {
      this.player.customParams.isMovingRight = true;
    }, this);

    this.rightArrow.events.onInputUp.add(function() {
      this.player.customParams.isMovingRight = false;
    }, this);

    // these 2 are for performance on phones -- its for hovering over
    this.rightArrow.events.onInputOver.add(function() {
      this.player.customParams.isMovingRight = true;
    }, this);

    this.rightArrow.events.onInputOut.add(function() {
      this.player.customParams.isMovingRight = false;
    }, this);
  },

  createBarrel: function() {
    // Phaser keeps track of dead and alive sprites. we can reuse the dead ones. This is recycling dead barrels so
    // there isnt a memory leak, where elements are just taking up memory over and over causing device crash eventually.
    // We recycle because deleting objects can cause the GC to slow down your game. A pool of objects is used (it is a group where you reuse the dead objects instead of creating new ones)
    var barrel = this.barrels.getFirstExist(false); // this gives the first dead sprite if any

    // if no dead sprites
    if (!barrel) {
      barrel = this.barrels.create(0, 0, 'barrel');
    }

    barrel.reset(this.levelData.goal.x, this.levelData.goal.y);
  },

  killPlayer: function(player, fire) {
    console.log('Ouch!');
    game.state.start('GameState');
  },

  win: function(player, goal) {
    console.log("YOU WIN");
    game.state.start('GameState');
  }

  // landed: function(player, ground) {
  //   // console.log('landed');
  // }

};

// initiate the Phaser framework
var game = new Phaser.Game(360, 592, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');
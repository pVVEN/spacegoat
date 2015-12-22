var Game = function(){};

Game.prototype = {
  init: function()
  {
    console.log("Game state - init");
    this.txt_progress = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    this.spr_loadingBar = game.make.sprite(game.world.centerX-(360/2), 420, 'loadingbar');
    Helper.centerGameObjects([this.txt_progress]);
  },

  preload: function()
  {
    console.log("Game state - preload");
    game.add.existing(this.spr_loadingBar);
    game.add.existing(this.txt_progress);
    this.load.setPreloadSprite(this.spr_loadingBar);

    this.loadScripts();
    this.loadFonts();
    this.loadImages();
    this.loadAudio();
  },

  loadScripts: function()
  {
    console.log("Game state - loadScripts");
    game.load.script('Camera', 'js/utils/Camera.js');
    game.load.script('LevelGenerator', 'js/utils/LevelGenerator.js');
  },

  loadFonts: function()
  {
    //
  },

  loadImages: function()
  {
    game.load.image('bg_background', 'img/background.png');
    game.load.image('img_leveltiles', 'img/tile_sheet.png');
  },

  loadAudio: function()
  {
    //
  },

  addStates: function()
  {
    //
  },

  addAudio: function()
  {
    //
  }, 

  create: function()
  {
    console.log("Game state - create");

    var lvl = new LevelGenerator(2048, 2048);
    lvl.init();
    lvl.create();

    Camera.init();
  },

  update: function()
  {
      Camera.update();
  }
};
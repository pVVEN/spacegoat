var Splash = function(){};

Splash.prototype = {
  init: function()
  {
    this.spr_logo = game.make.sprite(game.world.centerX, 200, 'logo');
    this.txt_progress = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    this.spr_loadingBar = game.make.sprite(game.world.centerX-(360/2), 420, 'loadingbar');

    Helper.centerGameObjects([this.spr_logo, this.txt_progress]);
  },

  preload: function()
  {
    game.add.sprite(0, 0, 'bg_splash');
    game.add.existing(this.spr_logo);
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
    game.load.script('MenuSystem', 'js/states/MenuSystem.js');
    game.load.script('MainMenu', 'js/states/MainMenu.js');
    game.load.script('Options', 'js/states/Options.js');
    game.load.script('Game', 'js/states/Game.js');
  },

  loadFonts: function()
  {
    //
  },

  loadImages: function()
  {
    game.load.image('bg_menu', 'img/bg_menu.png');
    game.load.image('bg_options', 'img/bg_options.png');
    game.load.image('bg_game', 'img/bg_game.png');
  },

  loadAudio: function()
  {
    //
  },

  addStates: function()
  {
    game.state.add('MenuSystem', MenuSystem);
    game.state.add('MainMenu', MainMenu);
    game.state.add('Options', Options);
    game.state.add('Game', Game);
  },

  addAudio: function()
  {
    //
  },

  create: function()
  {
    this.txt_progress.setText('Ready!');
    this.addStates();
    this.addAudio();

    setTimeout(function ()
    {
      game.state.start("MainMenu");
    }, 1000);
  }
};
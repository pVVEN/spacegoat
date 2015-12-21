var Game = function(){};

Game.prototype = {
  init: function()
  {
    //
  },

  preload: function()
  {
    //

    this.loadScripts();
    this.loadFonts();
    this.loadImages();
    this.loadAudio();
  },

  loadScripts: function()
  {
    game.load.script('LevelGenerator', 'js/utils/LevelGenerator.js');
  },

  loadFonts: function()
  {
    //
  },

  loadImages: function()
  {
    //
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
    //
  }
};
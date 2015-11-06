var Options = function(){};

Options.prototype = {
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
    //
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

Phaser.Utils.mixinPrototype(Options.prototype, Mixins);
var MainMenu = function(){};

MainMenu.prototype = {
  menuConfig: {
    startY: 260,
    startX: 30
  },

  init: function()
  {
    this.txt_title = game.make.text(game.world.centerX, 100, "The Adventures of Space Goat", {
      font: 'bold 32pt', 
      fill: '#ffffff', 
      align: 'center'
    });
    this.txt_title.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 5);
    this.txt_title.anchor.set(0.5);
    this.optionCount = 1;
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
    game.stage.disableVisibilityChange = true; //set to false to enable pausing when losing focus
    game.add.sprite(0, 0, 'bg_menu');
    game.add.existing(this.txt_title);

    this.addMenuOption('Play', function(){
      game.state.start('Game');
    });

    this.addMenuOption('Options', function(){
      game.state.start('Options');
    });
  }
};

Phaser.Utils.mixinPrototype(MainMenu.prototype, Mixins);
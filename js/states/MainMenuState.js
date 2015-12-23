var SpaceGoat = SpaceGoat || {};

SpaceGoat.MainMenuState = function()
{
  "use strict";
  Phaser.State.call(this);
  console.log("MainMenuState instantiated");
};

SpaceGoat.MainMenuState.prototype = Object.create(Phaser.State.prototype);
SpaceGoat.MainMenuState.prototype.constructor = SpaceGoat.MainMenuState;

SpaceGoat.MainMenuState.prototype.init = function()
{
  "use strict";
  this.txt_title = this.make.text(this.world.centerX, 100, "The Adventures of Space Goat", {
    font: 'bold 32pt', 
    fill: '#ffffff', 
    align: 'center'
  });
  this.txt_title.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 5);
  this.txt_title.anchor.set(0.5);
}

SpaceGoat.MainMenuState.prototype.preload = function()
{
  "use strict";
};

SpaceGoat.MainMenuState.prototype.create = function ()
{
  "use strict";
  this.stage.disableVisibilityChange = true; //set to false to enable pausing when losing focus
  this.add.sprite(0, 0, 'bg_menu');
  this.add.existing(this.txt_title);

  /*
  this.addMenuOption('Play', function(){
    this.state.start('GameState');
  });

  this.addMenuOption('OptionsState', function(){
    this.state.start('OptionsState');
  });
  */

  var btn_play = new MenuButton(this, "btn_play", {x: 100, y: 100}, {text: "Play", styleClass: "", callback: function(){
    this.state.start('GameState');
  }});
};
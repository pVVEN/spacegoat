var SpaceGoat = SpaceGoat || {};

//https://github.com/MattMcFarland/phaser-menu-system/tree/master/game/states

SpaceGoat.SplashState = function()
{
  "use strict";
  Phaser.State.call(this);
};

SpaceGoat.SplashState.prototype = Object.create(Phaser.State.prototype);
SpaceGoat.SplashState.prototype.constructor = SpaceGoat.SplashState;

SpaceGoat.SplashState.prototype.init = function()
{
  "use strict";
  this.spr_logo = this.make.sprite(this.world.centerX, 200, 'logo');
  this.txt_progress = this.make.text(this.world.centerX, 380, 'Loading...', {fill: 'white'});
  this.spr_loadingBar = this.make.sprite(this.world.centerX-(360/2), 420, 'loadingbar');

  Helper.centerGameObjects([this.spr_logo, this.txt_progress]);
}

SpaceGoat.SplashState.prototype.preload = function()
{
  "use strict";
  this.add.sprite(0, 0, 'bg_splash');
  this.add.existing(this.spr_logo);
  this.add.existing(this.spr_loadingBar);
  this.add.existing(this.txt_progress);
  this.load.setPreloadSprite(this.spr_loadingBar);

  //Load menu assets
  this.load.image('bg_menu', 'img/bg_menu.png');
  this.load.image('bg_options', 'img/bg_options.png');
  this.load.script('MenuButton', 'js/prefabs/MenuButton.js');
  this.load.script('MainMenuState', 'js/states/MainMenuState.js');
  this.load.script('OptionsState', 'js/states/OptionsState.js');
};

SpaceGoat.SplashState.prototype.create = function ()
{
  "use strict";
  this.txt_progress.setText('Ready!');
  this.state.add('MainMenuState', new SpaceGoat.MainMenuState());
  this.time.events.add(Phaser.Timer.SECOND, this.loadMenuState, this);
};

SpaceGoat.SplashState.prototype.loadMenuState = function()
{
  this.state.start('MainMenuState');
};
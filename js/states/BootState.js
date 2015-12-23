var SpaceGoat = SpaceGoat || {};

/*
FOR SETTING UP THE CORE GAME ENVIRONMENT (screen size, etc.)
*/

SpaceGoat.BootState = function()
{
	"use strict";
	Phaser.State.call(this);
};

SpaceGoat.BootState.prototype = Object.create(Phaser.State.prototype);
SpaceGoat.BootState.prototype.constructor = SpaceGoat.BootState;

SpaceGoat.BootState.prototype.init = function()
{
	"use strict";
}

SpaceGoat.BootState.prototype.preload = function()
{
	"use strict";
	//Load assets for next state
	this.load.image('bg_splash', 'img/bg_splash.png');
	this.load.image('loadingbar', 'img/loadingbar.png');
	this.load.image('logo', 'img/logo.png');

	this.load.script('Helper', 'js/utils/Helper.js');
	this.load.script('Mixins', 'js/utils/Mixins.js');
	this.load.script('SplashState', 'js/states/SplashState.js');
};

SpaceGoat.BootState.prototype.create = function ()
{
	"use strict";
	this.state.add('SplashState', new SpaceGoat.SplashState());
	this.state.start('SplashState');
};

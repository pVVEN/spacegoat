var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
var Main = function () {};

Main.prototype = {
	preload: function ()
	{
		game.load.image('bg_splash', 'img/bg_splash.png');
		game.load.image('loadingbar', 'img/loadingbar.png');
		game.load.image('logo', 'img/logo.png');
		game.load.script('Helper', 'js/utils/Helper.js');
		game.load.script('Mixins', 'js/utils/Mixins.js');
		game.load.script('Styles', 'js/styles/Styles.js');
		game.load.script('Splash', 'js/states/Splash.js');
	},

	create: function ()
	{
		game.state.add('Splash', Splash);
		game.state.start('Splash');
	}
};

game.state.add('Main', Main);
game.state.start('Main');
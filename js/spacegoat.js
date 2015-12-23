var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
game.state.add('BootState', new SpaceGoat.BootState());
game.state.start('BootState');
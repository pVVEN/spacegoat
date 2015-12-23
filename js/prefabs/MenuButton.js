var SpaceGoat = SpaceGoat || {};

var MenuButton = function (game_state, name, position, properties) {
    "use strict";
    Phaser.Sprite.call(this, game_state.game, position.x, position.y, properties.texture);
	
	//part of how Styles work, investigate later
    //properties.styleClass || (properties.styleClass = this.menuConfig.className || 'default');
    properties.styleClass || (properties.styleClass = 'default');

    var txt = game_state.add.text(
      0,
      0,
      properties.text,
      Styles.navitem[properties.styleClass]
    );

    txt.inputEnabled = true;

    txt.events.onInputUp.add(properties.callback);
    txt.events.onInputOver.add(function (target)
    {
      target.setStyle(Styles.navitem.hover);
    });

    txt.events.onInputOut.add(function (target)
    {
      target.setStyle(Styles.navitem[properties.styleClass]);
    });
};

MenuButton.prototype = Object.create(Prefab.prototype);
MenuButton.prototype.constructor = MenuButton;
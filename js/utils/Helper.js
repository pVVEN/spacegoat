var Helper = {
	//beep boop boop beep boop
  centerGameObjects: function (objects) {
    objects.forEach(function (object) {
      object.anchor.setTo(0.5);
    })
  }
};
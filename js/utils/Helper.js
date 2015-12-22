var Helper = {
	//beep boop boop beep boop
	centerGameObjects: function (objects) {
		console.log("Helper - centerGameObjects");
		objects.forEach(function (object) {
			object.anchor.setTo(0.5);
		})
	}, 
	random: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
};
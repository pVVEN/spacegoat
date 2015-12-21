//Constants
var TILE_SIZE = 32;
var WIDTH_RATIO = 0.45;
var HEIGHT_RATIO = 0.45;
var ITERATIONS = 4;
var mainRoom = undefined;
var levelArr, decorationsArr, obstaclesArr, mobsArr, itemsArr = [];
var map = undefined;

var LevelGenerator = function (){
	this.levelWidth = 0;
	this.levelHeight = 0;
	this.tilesPerRow = 0;
	this.tilesPerColumn = 0;
	this.roomTree = undefined;
	this.rooms = [];
};

LevelGenerator.prototype = {
	init: function(levelWidth, levelHeight)
	{
		//console.log("LevelGenerator.js - init("+levelWidth+", "+levelHeight+")");
		this.levelWidth = levelWidth;
		this.levelHeight = levelHeight;

		this.tilesPerRow = levelWidth/TILE_SIZE;
		this.tilesPerColumn = levelHeight/TILE_SIZE;
		//console.log("    tilesPerRow: "+this.tilesPerRow+", tilesPerColumn: "+this.tilesPerColumn);

		mainRoom = new RoomContainer(0, 0, this.levelWidth, this.levelHeight);

		levelArr = new Array(this.tilesPerColumn);
		for(var i = 0; i < this.tilesPerColumn; i++)
		{
			levelArr[i] = new Array(this.tilesPerColumn);
		}

		for(var c = 0; c < this.tilesPerColumn; c++)
		{
			for(var r = 0; r < this.tilesPerRow; r++)
			{
				levelArr[c][r] = 0;
			}
		}

		//console.log(levelArr.toString());
	},

	preload: function()
	{
		//console.log("LevelGenerator.js - preload()");
		//game.load.image('img_leveltiles_test', 'leveltiles_test.png');
	},

	create: function()
	{
		//console.log("LevelGenerator.js - create()");
		game.add.sprite(0, 0, 'bg_background');

		Camera.init();

		console.log("splitting up level");
		this.roomTree = splitRoom(mainRoom, ITERATIONS);
		console.log("rearranging rooms");
		this.growRooms();
		console.log("building paths");

		this.buildPaths(this.roomTree);
		this.drawTiles();

		//this.drawGrid();
		this.drawPartitions();
		this.drawRooms();
	},

	update: function()
	{
		Camera.update();
	},

	growRooms: function()
	{
		var leafs = this.roomTree.getLeaves();

		console.log("growRooms - "+leafs.length+" rooms");
		for(var i = 0; i < leafs.length; i++)
		{
			//leafs[i].setCenter();
			leafs[i].growRoom();
			this.rooms.push(leafs[i].room);
		}
	},

	buildPaths: function(tree)
	{
		if(tree.lChild !== undefined && tree.rChild !== undefined)
		{
			/*
			if(tree.lChild.leaf.room !== undefined && tree.rChild.leaf.room !== undefined)
			{
				console.log("left room: ");
				console.log(tree.lChild.leaf.room);
				console.log("right room: ");
				console.log(tree.rChild.leaf.room);
				tree.lChild.leaf.room.buildPath(tree.rChild.leaf.room.center);
			}
			*/
			console.log(tree.lChild.leaf);
			console.log(tree.rChild.leaf);
			console.log("--------------");
			tree.lChild.leaf.buildPath(tree.rChild.leaf.center);

			this.buildPaths(tree.lChild);
			this.buildPaths(tree.rChild);
		}
	},

	drawGrid: function()
	{
		//draw grid
		var bmd_gridLine = game.add.bitmapData(this.levelWidth, this.levelHeight);
		for(var v = 0; v < this.tilesPerRow; v++)
		{
			bmd_gridLine.line(v*TILE_SIZE, 0, v*TILE_SIZE, this.levelHeight);
		}
		for(var h = 0; h < this.tilesPerColumn; h++)
		{
			bmd_gridLine.line(0, h*TILE_SIZE, this.levelWidth, h*TILE_SIZE);
		}
	    game.add.sprite(0, 0, bmd_gridLine);
	},

	drawPartitions: function()
	{
		this.roomTree.paint();
	},

	drawRooms: function()
	{
		for(var i = 0; i < this.rooms.length; i++)
		{
			this.rooms[i].paint();
		}
	},

	drawTiles: function()
	{
		//console.log("drawTiles()");

		var levelStr = '';

	    for (var c = 0; c < this.tilesPerColumn; c++)
	    {
	        for (var r = 0; r < this.tilesPerRow; r++)
	        {
	        	var temp = levelArr[c][r].toString();
	            levelStr += temp;

	            if (r < this.tilesPerRow-1)
	            {
	                levelStr += ',';
	            }
	        }

	        if (c < this.tilesPerColumn-1)
	        {
	            levelStr += '\n';
	        }
	    }

	    //console.log(levelStr);
		game.cache.addTilemap('test', null, levelStr, Phaser.Tilemap.CSV);
		map = game.add.tilemap('test', TILE_SIZE, TILE_SIZE, this.levelWidth/TILE_SIZE, this.levelHeight/TILE_SIZE);
		map.addTilesetImage('tileimage', 'img_leveltiles', TILE_SIZE, TILE_SIZE);

		var layer = map.createLayer(0);
		layer.resizeWorld();
	}
};

//====================================================
//		TREE STUFF
//====================================================

var Tree = function(leaf)
{
	this.leaf = leaf;
	this.lChild = undefined;
	this.rChild = undefined;
};

Tree.prototype = {
	getLeaves: function()
	{
		if(this.lChild === undefined && this.rChild === undefined)
		{
			return [this.leaf];
		}else{
			return [].concat(this.lChild.getLeaves(), this.rChild.getLeaves());
		}
	},

	getLevel: function(level, queue)
	{
		if(queue === undefined)
		{
			queue = [];
		}

		if(level == 1)
		{
			queue.push(this);
		}else{
			if(this.lChild !== undefined)
			{
				this.lChild.getLevel(level-1, queue);
			}

			if(this.rChild !== undefined)
			{
				this.rChild.getLevel(level-1, queue);
			}
		}

		return queue;
	},

	paint: function()
	{
		this.leaf.paint();

		if(this.lChild !== undefined)
		{
			this.lChild.paint();
		}

		if(this.rChild !== undefined)
		{
			this.rChild.paint();
		}
	}
};

//====================================================
//		ROOM CONTAINER STUFF
//====================================================

var RoomContainer = function(x, y, w, h)
{
	//Room.call(this, x, y, w, h);
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.center = new Point(this.x + this.w/2, this.y + this.h/2);
	this.room = undefined;
};

//RoomContainer.prototype = Object.create(Room.prototype);
//RoomContainer.prototype.constructor = RoomContainer;
RoomContainer.prototype = {
	/*
	setCenter: function()
	{
		this.center = new Point(this.x + this.w/2, this.y + this.h/2);
		console.log("roomContainer center after: "+this.center.x+", "+this.center.y);
	},
*/
	growRoom: function()
	{
		var x, y, w, h, padX, padY, sizeX, sizeY, randWOne, randHOne, tileX, tileY, tileW, tileH;

		//rooms given random padding
		padX = random(1, 3) * TILE_SIZE; //using 1 instead of 0 because we don't want walls to touch
		padY = random(1, 3) * TILE_SIZE;
		x = this.x + padX;
		y = this.y + padY;
		w = this.w - (x - this.x);
		h = this.h - (y - this.y);
		sizeX = random(1, 3) * TILE_SIZE;
		sizeY = random(1, 3) * TILE_SIZE;
		w -= sizeX;
		h -= sizeY;

		//update level array
		tileX = (x/TILE_SIZE);//-1; //removing the -1 part fits tiles within drawn borders
		tileY = (y/TILE_SIZE);//-1;
		tileW = (w/TILE_SIZE)+tileX;
		tileH = (h/TILE_SIZE)+tileY;
		for(var c = tileY; c < tileH; c++)
		{
			for(var r = tileX; r < tileW; r++)
			{
				levelArr[c][r] = 1;
			}
		}

		this.room = new Room(x, y, w, h);
	},

	buildPath: function(roomCenter)
	{
		//DRAW ROOM LEAF/ROOMCONTAINER CENTER TO OTHER LEAF/ROOMCONTAINER CENTER
		console.log("RoomContainer.buildPath - from ("+this.center.x+", "+this.center.y+") to ("+roomCenter.x+", "+roomCenter.y+")");
		var thisCenterTileX = Math.floor(this.center.x / TILE_SIZE);
		var thisCenterTileY = Math.floor(this.center.y / TILE_SIZE);
		var roomCenterTileX = Math.floor(roomCenter.x / TILE_SIZE);
		var roomCenterTileY = Math.floor(roomCenter.y / TILE_SIZE);

		var newWidth;
		var newHeight;

		if(thisCenterTileX == roomCenterTileX)
		{
			newWidth = (roomCenterTileX - thisCenterTileX) + 1;
			newHeight = roomCenterTileY - thisCenterTileY;

			for(var v = thisCenterTileY; v < roomCenterTileY; v++)
			{
				if(levelArr[v][roomCenterTileX] == 0)
				{
					levelArr[v][roomCenterTileX] = 1;
				}
			}
		}else if(thisCenterTileY == roomCenterTileY){
			newWidth = roomCenterTileX - thisCenterTileX;
			newHeight = (roomCenterTileY - thisCenterTileY) + 1;

			for(var h = thisCenterTileX; h < roomCenterTileX; h++)
			{
				if(levelArr[roomCenterTileY][h] == 0)
				{
					levelArr[roomCenterTileY][h] = 1;
				}
			}
		}

		/*
		console.log("    newWidth: "+newWidth+", newHeight: "+newHeight);
		var bmd_blueBorder = game.add.bitmapData(newWidth * TILE_SIZE, newHeight * TILE_SIZE);
		bmd_blueBorder.rect(0, 0, newWidth * TILE_SIZE, newHeight * TILE_SIZE);
		bmd_blueBorder.fill(255, 0, 0);
		//bmd_blueBorder.clear(1, 1, newWidth-2, newHeight-2);
		game.add.sprite(thisCenterTileX * TILE_SIZE, thisCenterTileY * TILE_SIZE, bmd_blueBorder);
		*/
	},

	paint: function()
	{
		if(this.room != undefined)
		{
			//console.log("RoomContainer.paint() - drawing "+this.w+" x "+this.h+" room at "+this.x+", "+this.y);
			var bmd_greenBorder = game.add.bitmapData(this.w, this.h);
			bmd_greenBorder.rect(0, 0, this.w, this.h);
			bmd_greenBorder.fill(51, 204, 51);
			bmd_greenBorder.clear(1, 1, this.w-2, this.h-2);
			game.add.sprite(this.x, this.y, bmd_greenBorder);

			var bmd_greenSquare = game.add.bitmapData(8, 8);
			bmd_greenSquare.rect(0, 0, 8, 8);
			bmd_greenSquare.fill(51, 204, 51);
			//console.log("adding green square to "+(this.center.x-4)+", "+(this.center.y-4));
			game.add.sprite(this.center.x-4, this.center.y-4, bmd_greenSquare);
		}
	}
};

//====================================================
//		ROOM STUFF
//====================================================

var Room = function(x, y, w, h)
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.center = new Point(this.x + this.w/2, this.y + this.h/2);
};

Room.prototype = {
	buildPath: function(roomCenter)
	{
		//DRAW ROOM LEAF/ROOMCONTAINER CENTER TO OTHER LEAF/ROOMCONTAINER CENTER
		console.log("Room.buildPath - from ("+this.center.x+", "+this.center.y+") to ("+roomCenter.x+", "+roomCenter.y+")");
		var bmd_blueBorder = game.add.bitmapData(this.center.x, this.center.y);
		bmd_blueBorder.rect(0, 0, roomCenter.x-this.center.x, (roomCenter.y-this.center.y)+1);
		bmd_blueBorder.fill(0, 102, 255);
		//bmd_blueBorder.clear(1, 1, this.w-2, this.h-2);
		game.add.sprite(this.center.x, this.center.y, bmd_blueBorder);
	},

	paint: function()
	{
		//console.log("Room.paint() - drawing "+this.w+" x "+this.h+" room at "+this.x+", "+this.y);
		var bmd_blueBorder = game.add.bitmapData(this.w, this.h);
		bmd_blueBorder.rect(0, 0, this.w, this.h);
		bmd_blueBorder.fill(0, 102, 255);
		bmd_blueBorder.clear(1, 1, this.w-2, this.h-2);
		game.add.sprite(this.x, this.y, bmd_blueBorder);

		var bmd_blueSquare = game.add.bitmapData(8, 8);
		bmd_blueSquare.rect(0, 0, 8, 8);
		bmd_blueSquare.fill(0, 102, 255);
		console.log("adding blue square to "+(this.center.x-4)+", "+(this.center.y-4));
		game.add.sprite(this.center.x-4, this.center.y-4, bmd_blueSquare);
	}
};

//====================================================
//		FUNCTIONS
//====================================================

var Point = function(x, y)
{
    this.x = x;
    this.y = y;
};

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

function splitRoom(room, iteration)
{
	var root = new Tree(room);

	//console.log("SPLIT "+iteration+": room x: "+room.x+", y: "+room.y+", w: "+room.w+", h: "+room.h);
	if(iteration != 0)
	{
		var split = randomSplit(room);
		root.lChild = splitRoom(split[0], iteration-1);
		root.rChild = splitRoom(split[1], iteration-1);
	}

	return root;
};

function randomSplit(room)
{
	var roomOne, roomTwo, randOne, randTwo;

	if(random(0, 1) == 0)
	{
		//Vertical
		randOne = random(1, (room.w/TILE_SIZE));
		roomOne = new RoomContainer(
			room.x, 			//roomOne.x
			room.y, 			//roomOne.y
			randOne*TILE_SIZE, 	//roomOne.w
			room.h 				//roomOne.h
		);

		roomTwo = new RoomContainer(
			room.x + roomOne.w, //roomTwo.x
			room.y, 			//roomTwo.y
			room.w - roomOne.w, //roomTwo.w
			room.h 				//roomTwo.h
		);
		// console.log("randomSplit() vertical");
		// console.log("    room One x: "+room.x+", y: "+room.y+", w: "+(randOne*TILE_SIZE)+", h: "+room.h);
		// console.log("    randOne: "+randOne+", w % TILE_SIZE: "+(randOne*TILE_SIZE)%TILE_SIZE);
		// console.log("    room Two x: "+(room.x + roomOne.w)+", y: "+room.y+", w: "+(room.w - roomOne.w)+", h: "+room.h);

		var roomOneWidthRatio = roomOne.w / roomOne.h;
		var roomTwoWidthRatio = roomTwo.w / roomTwo.h;

		if(roomOneWidthRatio < WIDTH_RATIO || roomTwoWidthRatio < WIDTH_RATIO)
		{
			return randomSplit(room);
		}
	}else{
		//Horizontal
		randTwo = random(1, (room.h/TILE_SIZE));
		roomOne = new RoomContainer(
			room.x, 			//roomOne.x
			room.y, 			//roomOne.y
			room.w, 			//roomOne.w
			randTwo*TILE_SIZE	//roomOne.h
		);

		roomTwo = new RoomContainer(
			room.x, 			//roomTwo.x
			room.y + roomOne.h, //roomTwo.y
			room.w, 			//roomTwo.w
			room.h - roomOne.h 	//roomTwo.h
		);
		// console.log("randomSplit() horizontal");
		// console.log("    room One x: "+room.x+", y: "+room.y+", w: "+room.w+", h: "+(randTwo*TILE_SIZE));
		// console.log("    randTwo: "+randTwo+", h % TILE_SIZE: "+(randTwo*TILE_SIZE)%TILE_SIZE);
		// console.log("    room Two x: "+room.x+", y: "+(room.y + roomOne.h)+", w: "+room.w+", h: "+(room.h - roomOne.h));

		var roomOneHeightRatio = roomOne.h / roomOne.w;
		var roomTwoHeightRatio = roomTwo.h / roomTwo.w;

		if(roomOneHeightRatio < HEIGHT_RATIO || roomTwoHeightRatio < HEIGHT_RATIO)
		{
			return randomSplit(room);
		}
	}

	return [roomOne, roomTwo];
};
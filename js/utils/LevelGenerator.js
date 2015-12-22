//See also: http://perplexingtech.weebly.com/game-dev-blog/a-random-dungeon-generator-for-phaserjs

//Constants
var TILE_SIZE = 32;
var WIDTH_RATIO = 0.45;
var HEIGHT_RATIO = 0.45;
var ITERATIONS = 4;
var map = undefined;

var LevelGenerator = function (levelWidth, levelHeight){
	console.log("LevelGenerator.js - constructor");
	this.levelWidth = levelWidth;
	this.levelHeight = levelHeight;
	this.tilesPerRow = 0;
	this.tilesPerColumn = 0;
	this.mainRoom = undefined;
	this.roomTree = undefined;
	this.rooms = [];
	this.levelArr = [];
	this.decorationsArr = [];
	this.obstaclesArr = [];
	this.mobsArr = [];
	this.itemsArr = [];
};

LevelGenerator.prototype = {
	init: function()
	{
	    this.tilesPerRow = this.levelWidth/TILE_SIZE;
		this.tilesPerColumn = this.levelHeight/TILE_SIZE;

		this.mainRoom = new RoomContainer(0, 0, this.levelWidth, this.levelHeight);

		this.levelArr = new Array(this.tilesPerColumn);
		for(var i = 0; i < this.tilesPerColumn; i++)
		{
			this.levelArr[i] = new Array(this.tilesPerColumn);
		}

		for(var c = 0; c < this.tilesPerColumn; c++)
		{
			for(var r = 0; r < this.tilesPerRow; r++)
			{
				this.levelArr[c][r] = 0;
			}
		}
	},

	preload: function()
	{
		//console.log("LevelGenerator.js - preload");
	},

	create: function()
	{
		game.add.sprite(0, 0, 'bg_background');

		this.roomTree = this.splitRoom(this.mainRoom, ITERATIONS);
		this.growRooms();
		this.buildPaths(this.roomTree);
		this.drawTiles();

		//this.drawGrid();
		//this.drawPartitions();
		//this.drawRooms();
	},

	splitRoom: function(room, iteration)
	{
		var root = new Tree(room);

		if(iteration != 0)
		{
			var split = this.randomSplit(room);
			root.lChild = this.splitRoom(split[0], iteration-1);
			root.rChild = this.splitRoom(split[1], iteration-1);
		}

		return root;
	},

	randomSplit: function(room)
	{
		var roomOne, roomTwo, randOne, randTwo;

		if(Helper.random(0, 1) == 0)
		{
			//Vertical
			randOne = Helper.random(1, (room.w/TILE_SIZE));
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

			var roomOneWidthRatio = roomOne.w / roomOne.h;
			var roomTwoWidthRatio = roomTwo.w / roomTwo.h;

			if(roomOneWidthRatio < WIDTH_RATIO || roomTwoWidthRatio < WIDTH_RATIO)
			{
				return this.randomSplit(room);
			}
		}else{
			//Horizontal
			randTwo = Helper.random(1, (room.h/TILE_SIZE));
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

			var roomOneHeightRatio = roomOne.h / roomOne.w;
			var roomTwoHeightRatio = roomTwo.h / roomTwo.w;

			if(roomOneHeightRatio < HEIGHT_RATIO || roomTwoHeightRatio < HEIGHT_RATIO)
			{
				return this.randomSplit(room);
			}
		}

		return [roomOne, roomTwo];
	},

	growRooms: function()
	{
		var leafs = this.roomTree.getLeaves();

		console.log("growRooms - "+leafs.length+" rooms");
		for(var i = 0; i < leafs.length; i++)
		{
			//leafs[i].setCenter();
			leafs[i].growRoom(this.levelArr);
			this.rooms.push(leafs[i].room);
		}
	},

	buildPaths: function(tree)
	{
		if(tree.lChild !== undefined && tree.rChild !== undefined)
		{
			tree.lChild.leaf.buildPath(this.levelArr, tree.rChild.leaf.center);

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
		var levelStr = '';

	    for (var c = 0; c < this.tilesPerColumn; c++)
	    {
	        for (var r = 0; r < this.tilesPerRow; r++)
	        {
	        	var temp = this.levelArr[c][r].toString();
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
	this.center = {x: this.x + this.w/2, y: this.y + this.h/2};
	this.room = undefined;
};

//RoomContainer.prototype = Object.create(Room.prototype);
//RoomContainer.prototype.constructor = RoomContainer;
RoomContainer.prototype = {
	growRoom: function(lvlArr)
	{
		var x, y, w, h, padX, padY, sizeX, sizeY, randWOne, randHOne, tileX, tileY, tileW, tileH;

		//rooms given random padding
		padX = Helper.random(1, 3) * TILE_SIZE; //using 1 instead of 0 because we don't want walls to touch
		padY = Helper.random(1, 3) * TILE_SIZE;
		x = this.x + padX;
		y = this.y + padY;
		w = this.w - (x - this.x);
		h = this.h - (y - this.y);
		sizeX = Helper.random(1, 3) * TILE_SIZE;
		sizeY = Helper.random(1, 3) * TILE_SIZE;
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
				if(c == tileY && r == tileX)
				{
					//UPPER LEFT CORNER
					lvlArr[c][r] = 9;
				}else if(c == tileY && r > tileX && r < tileW-1){
					//TOP WALL
					lvlArr[c][r] = 10;
				}else if(c == tileY && r == tileW-1){
					//UPPER RIGHT CORNER
					lvlArr[c][r] = 11;
				}else if(c > tileY && c < tileH-1 && r == tileW-1){
					//RIGHT WALL
					lvlArr[c][r] = 17;
				}else if(c == tileH-1 && r == tileW-1){
					//LOWER RIGHT CORNER
					lvlArr[c][r] = 23;
				}else if(c == tileH-1 && r > tileX && r < tileW-1){
					//BOTTOM WALL
					lvlArr[c][r] = 22;
				}else if(c > tileY && c < tileH-1 && r == tileX){
					//LEFT WALL
					lvlArr[c][r] = 15;
				}else if(c == tileH-1 && r == tileX){
					//LOWER LEFT CORNER
					lvlArr[c][r] = 21;
				}else{
					lvlArr[c][r] = 16;
				}
			}
		}

		this.room = new Room(x, y, w, h);
	},

	buildPath: function(lvlArr, roomCenter)
	{
		//DRAW ROOM LEAF/ROOMCONTAINER CENTER TO OTHER LEAF/ROOMCONTAINER CENTER
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
				if(lvlArr[v][roomCenterTileX] != 16)
				{
					if(lvlArr[v][roomCenterTileX] != 0)
					{
						//add door
					}

					lvlArr[v][roomCenterTileX] = 16;
				}
			}
		}else if(thisCenterTileY == roomCenterTileY){
			newWidth = roomCenterTileX - thisCenterTileX;
			newHeight = (roomCenterTileY - thisCenterTileY) + 1;

			for(var h = thisCenterTileX; h < roomCenterTileX; h++)
			{
				if(lvlArr[roomCenterTileY][h] != 16)
				{
					if(lvlArr[roomCenterTileY][h] != 0)
					{
						//add door
					}

					lvlArr[roomCenterTileY][h] = 16;
				}
			}
		}
	},

	paint: function()
	{
		if(this.room != undefined)
		{
			var bmd_greenBorder = game.add.bitmapData(this.w, this.h);
			bmd_greenBorder.rect(0, 0, this.w, this.h);
			bmd_greenBorder.fill(51, 204, 51);
			bmd_greenBorder.clear(1, 1, this.w-2, this.h-2);
			game.add.sprite(this.x, this.y, bmd_greenBorder);

			var bmd_greenSquare = game.add.bitmapData(8, 8);
			bmd_greenSquare.rect(0, 0, 8, 8);
			bmd_greenSquare.fill(51, 204, 51);
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
	this.center = {x: this.x + this.w/2, y: this.y + this.h/2};
};

Room.prototype = {
	buildPath: function(roomCenter)
	{
		//DRAW ROOM LEAF/ROOMCONTAINER CENTER TO OTHER LEAF/ROOMCONTAINER CENTER
		console.log("Room.buildPath - from ("+this.center.x+", "+this.center.y+") to ("+roomCenter.x+", "+roomCenter.y+")");
		var bmd_blueBorder = game.add.bitmapData(this.center.x, this.center.y);
		bmd_blueBorder.rect(0, 0, roomCenter.x-this.center.x, (roomCenter.y-this.center.y)+1);
		bmd_blueBorder.fill(0, 102, 255);
		game.add.sprite(this.center.x, this.center.y, bmd_blueBorder);
	},

	paint: function()
	{
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
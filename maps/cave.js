
Lootr.Map.Cave = function(player) {

	this._width = 100;
	this._height = 100;

	// Build Map
	var tiles = this._generateLevel();

	// Call the Map constructor
	Lootr.Map.call(this, tiles);

	// Add the player
	this.addEntityAtRandomPosition(player);

	// Add random entities
	for(var i=0; i<100; i++) {
		var entity = Lootr.EntityRepository.createRandom();
        //var entity = Lootr.EntityRepository.create('bat');

		// Add a random entity
		this.addEntityAtRandomPosition(entity);
	}

	// Add random items
	for(var i=0; i<100; i++) {
		this.addItemAtRandomPosition(Lootr.ItemRepository.createRandom());
        //this.addItemAtRandomPosition(Lootr.ItemRepository.create('spike trap'));
	}

	// Add weapons and armor to the map
	/*var templates = ['dagger', 'club'];

	for(var i=0; i<templates.length; i++) {
		this.addItemAtRandomPosition(Lootr.ItemRepository.create(templates[i]));
	}*/

	// Add a hole
	//var holePosition = this.getRandomFloorPosition();
	//this._tiles[holePosition.x][holePosition.y] = Lootr.Tile.holeToCavernTile;
	//this._tiles[player.getX() + 3][player.getY() + 3] = new Lootr.Tile(Lootr.Tile.holeToCavernTile);
};

Lootr.Map.Cave.extend(Lootr.Map);

Lootr.Map.Cave.prototype._generateLevel = function() {
	// Create the empty map
    var map = new Array(this._width);
    for (var w = 0; w < this._width; w++) {
        map[w] = new Array(this._height);
    }

    // Setup the cave generator
    var generator = new ROT.Map.Cellular(this._width, this._height);
    generator.randomize(0.5);
    var totalIterations = 3;
    // Iteratively smoothen the map
    for (var i = 0; i < totalIterations - 1; i++) {
        generator.create();
    }
    // Smoothen it one last time and then update our map
    generator.create(function(x,y,v) {
        if (v === 1) {

            if(Math.floor(Math.random() * 100) >= 96) {
                map[x][y] = new Lootr.Tile(Lootr.Tile.waterTile);
            } else {
                map[x][y] = new Lootr.Tile(Lootr.Tile.floorTile);
            }

        } else {

            if(Math.floor(Math.random() * 10) >= 9) {
                map[x][y] = new Lootr.Tile(Lootr.Tile.wallGemTile);
            } else {
                map[x][y] = new Lootr.Tile(Lootr.Tile.wallTile);
            }
        }
    });
    return map;

    ///////////////////////////////
    // *** TESTING
 /*   var layout = [
    	[1,2,1,1,1],
    	[1,0,0,2,1],
    	[1,1,2,1,1]
    ];

    var map = new Array(layout.length);
	for (var y=0; y < layout.length; y++) {
		map[y] = new Array(layout[0].length);
	}

    for(var y=0; y<layout.length; y++) {
    	for(var x=0; x<layout[0].length; x++) {
    		if(layout[y][x] === 1) {
    			map[y][x] = new Lootr.Tile(Lootr.Tile.wallTile);
    		} else if(layout[y][x] === 2) {
    			map[y][x] = new Lootr.Tile(Lootr.Tile.waterTile);
    		} else if(layout[y][x] === 0) {
    			map[y][x] = new Lootr.Tile(Lootr.Tile.floorTile);
    		} else {
    			map[y][x] = Lootr.Tile.nullTile;
    		}
    	}
    }

    return map;*/
    // **** END TESTING


};

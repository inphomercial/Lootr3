
Lootr.Map.Overworld = function(player) {

	this._width = 100;
	this._height = 100;

	// Build Map
	var tiles = this._generateLevel();

	// Call the Map constructor
	Lootr.Map.call(this, tiles);

	// Add the player
	this.addEntityAtRandomPosition(player);

    // Add purposeful entities
    //var dragon = Lootr.EntityRepository.create('dragon');
    //this.addEntityAtRandomPosition(dragon);

	// Add random entities
	//for(var i=0; i<225; i++) {
		//var entity = Lootr.EntityRepository.createRandom();
        //var entity = Lootr.EntityRepository.create('ghost');

		// Add a random entity
		//this.addEntityAtRandomPosition(entity);
	//}

	// Add random items
	//for(var i=0; i<100; i++) {
		//this.addItemAtRandomPosition(Lootr.ItemRepository.createRandom());
        //this.addItemAtRandomPosition(Lootr.ItemRepository.create('spike trap'));
	//}

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

Lootr.Map.Overworld.extend(Lootr.Map);

Lootr.Map.Overworld.prototype._generateLevel = function() {
	// Create the empty map
    var layout = [
    	[1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,1,1],
        [1,1,1,0,1,1,1,0,1,1],
        [1,1,1,3,1,1,1,4,1,1],
        [1,1,1,1,1,1,1,1,1,1]       
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
            } else if(layout[y][x] === 3) {
                map[y][x] = new Lootr.Tile(Lootr.Tile.holeToCaveTile);            
            } else if(layout[y][x] === 4) {
                map[y][x] = new Lootr.Tile(Lootr.Tile.holeToDesertTile);            
    		} else {
    			map[y][x] = Lootr.Tile.nullTile;
    		}
    	}
    }

    return map;
};

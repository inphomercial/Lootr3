
Lootr.Map.Castle = function(player) {

	// Build Map
	var tiles = this._generateLevel();

	// Call the Map constructor
	Lootr.Map.call(this, tiles);

    // Try to add pool to level
    this.addSegment(new Lootr.BuilderTemplate(Lootr.Builder.Pool)
                             .generate(),
                             {x: 3, y: 3});

    this.addEntityByTypeAndAmount('slime', 5);

    this.addItemByTypeAndAmount('robe', 4);

	// Add the player
	//this.addEntityAt(10, 6, player);
    this.addEntityAtRandomPosition(player);    
};

Lootr.Map.Castle.extend(Lootr.Map);

Lootr.Map.Castle.prototype._generateLevel = function() {

	// Create the empty map
    var layout = [
	    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,0,0,0,2,0,0,0,1,1,0,0,0,2,0,0,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,0],
        [0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,0,0,0,2,0,0,0,1,1,0,0,0,2,0,0,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,0],
        [0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,0],
        [0,1,0,0,0,2,0,0,0,1,1,0,0,0,2,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    var map = new Array(layout.length);
	for (var y=0; y < layout.length; y++) {
		map[y] = new Array(layout[0].length);
	}

    for(var y=0; y<map.length; y++) {
    	for(var x=0; x<map[y].length; x++) {
    		if(layout[y][x] === 1) {
    			map[x][y] = new Lootr.Tile(Lootr.Tile.castleFloorTile);    		    		
            } else if(layout[y][x] === 0) {
                    map[x][y] = new Lootr.Tile(Lootr.Tile.castleWallTile);      
            } else if(layout[y][x] === 2) {
                    map[x][y] = new Lootr.Tile(Lootr.Tile.castleDoorTile);            
    		} else {
    			map[x][y] = Lootr.Tile.nullTile;
    		}
    	}
    }

    return map;
};

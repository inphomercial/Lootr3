
Lootr.Map.Overworld = function(player) {

	// Build Map
	var tiles = this._generateLevel();

	// Call the Map constructor
	Lootr.Map.call(this, tiles);

	// Add the player
	this.addEntityAt(10, 26, player);
};

Lootr.Map.Overworld.extend(Lootr.Map);

Lootr.Map.Overworld.prototype._generateLevel = function() {

	// Create the empty map
    var layout = [
	    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	    [0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,0,0],
    	[0,0,0,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,0,0,0],
	    [0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,3,0,0,0,4,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0],
	    [0,0,0,0,0,0,0,5,0,0,0,6,0,0,0,0,0,0,6,6,0,0,0,0],
	    [7,7,7,6,7,7,0,0,0,0,0,6,0,1,12,12,1,6,7,7,0,0,0,0],
	    [7,7,6,6,7,1,0,0,0,0,0,0,6,0,7,12,6,7,7,0,0,0,0,0],
    	[7,7,6,6,6,7,1,0,0,0,0,0,0,6,6,7,6,7,0,0,0,0,0,0],
    	[7,7,6,6,6,7,1,0,0,0,0,0,0,0,0,6,7,7,7,0,0,0,0,0],
        [7,6,6,6,6,7,7,0,0,0,0,0,0,0,0,6,7,1,0,0,0,0,0,0],
        [7,7,6,7,7,7,0,0,0,0,0,0,0,0,0,0,6,1,1,0,0,0,0,0],
        [7,7,7,3,7,0,0,4,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0],
        [1,7,7,7,7,1,1,0,0,0,7,0,1,7,7,6,1,1,0,1,0,0,0,0],
        [1,1,7,7,7,7,7,7,0,0,7,0,1,7,7,6,1,0,0,0,0,0,0,0],
        [1,7,7,7,7,7,7,1,7,0,7,0,7,7,7,6,1,0,0,0,0,0,0,0],
        [7,7,7,7,7,7,7,7,7,1,7,0,7,7,6,0,0,0,0,0,0,0,0,0],
        [7,7,7,7,7,7,7,7,7,1,7,0,7,6,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,7,1,1,7,7,7,7,7,0,7,6,7,7,7,7,7,7,7,7,7,7],
        [7,7,7,7,7,7,7,9,9,9,9,9,6,9,9,7,7,7,7,7,7,7,7,7],
        [7,9,9,9,9,9,9,9,9,9,9,6,6,6,9,9,9,7,7,7,7,7,7,7],
        [9,10,10,10,10,10,10,10,6,6,6,6,6,10,10,10,10,10,10,9,7,7,7,7],
        [10,10,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,9,9,0],
        [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
    ];

    var map = new Array(layout.length);
	for (var y=0; y < layout.length; y++) {
		map[y] = new Array(layout[0].length);
	}

    for(var y=0; y<map.length; y++) {
    	for(var x=0; x<map[y].length; x++) {
    		if(layout[y][x] === 1) {
    			map[x][y] = new Lootr.Tile(Lootr.Tile.treeTile);
    		} else if(layout[y][x] === 2) {
    			map[x][y] = new Lootr.Tile(Lootr.Tile.waterTile);
    		} else if(layout[y][x] === 0) {
    			map[x][y] = new Lootr.Tile(Lootr.Tile.roadTile);
            } else if(layout[y][x] === 3) {
                map[x][y] = new Lootr.Tile(Lootr.Tile.holeToCaveTile);
            } else if(layout[y][x] === 4) {
                map[x][y] = new Lootr.Tile(Lootr.Tile.holeToDesertTile);     
            } else if(layout[y][x] === 5) {
            	map[x][y] = new Lootr.Tile(Lootr.Tile.holeToBossCave);                  
            } else if(layout[y][x] === 6) {
                map[x][y] = new Lootr.Tile(Lootr.Tile.waterTile);    
            } else if(layout[y][x] === 7) {
            	map[x][y] = new Lootr.Tile(Lootr.Tile.grassTile);    
            } else if(layout[y][x] === 8) {
            	map[x][y] = new Lootr.Tile(Lootr.Tile.bridgeTile);        
           	} else if(layout[y][x] === 9) {
            	map[x][y] = new Lootr.Tile(Lootr.Tile.sandTile);
            } else if(layout[y][x] === 10) {
            	map[x][y] = new Lootr.Tile(Lootr.Tile.shallowWaterTile);  
            } else if(layout[y][x] === 11) {
                map[x][y] = new Lootr.Tile(Lootr.Tile.snowTile);    
            } else if(layout[y][x] === 12) {
                map[x][y] = new Lootr.Tile(Lootr.Tile.mountainTile);                
    		} else {
    			map[x][y] = Lootr.Tile.nullTile;
    		}
    	}
    }

    return map;
};

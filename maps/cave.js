
Lootr.Map.Cave = function(player) {

	this._width = 200;
	this._height = 200;

	// Build Map
	var tiles = this._generateLevel();

	// Call the Map constructor
	Lootr.Map.call(this, tiles);
	
    // Add exit back to overworld  
    var pos = this.getRandomFloorPosition();
    this._tiles[pos.x][pos.y] = new Lootr.Tile(Lootr.Tile.exitToOverworld);    

    // Try to add pool to level
    this.addSegment(new Lootr.Builder(Lootr.Builder.Pool).generateLayout());

    // Try to add pool to level
    this.addSegment(new Lootr.Builder(Lootr.Builder.GemTreasure).generateLayout());

    // Add the player
    this.addEntityAtRandomPosition(player);

    // Add entities
    this.addEntityByTypeAndAmount('bat', 1);
    this.addEntityByTypeAndAmount('spider', 10);
    this.addEntityByTypeAndAmount('slime', 50);

    // Add items
    this.addItemByTypeAndAmount('robe', 2);
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
};

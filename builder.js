/*Lootr.Builder = function(width, height) {
    this._width = width;
    this._height = height;
    this._tiles = new Array();
    
    // Create a new cave at each level
    this._tiles = this._generateLevel();
};

Lootr.Builder.prototype.getTiles = function () {
    return this._tiles;
};

Lootr.Builder.prototype.getWidth = function () {
    return this._width;
};

Lootr.Builder.prototype.getHeight = function () {
    return this._height;
};

Lootr.Builder.prototype._generateLevel = function() {
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
            map[x][y] = Lootr.Tile.floorTile;
        } else {
            map[x][y] = Lootr.Tile.wallTile;
        }
    });
    return map;
};*/


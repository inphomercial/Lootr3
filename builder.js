Lootr.Builder = function() {
  // this.template = template;

//   this._generateLevel(template);
};

Lootr.Builder.prototype._generateLevel = function() {
    // Create the empty map
    var pool = [        
        [3,3,3,3,3,3],
        [3,2,2,2,2,3],
        [3,2,1,1,2,3],
        [3,2,1,1,2,3],
        [3,2,2,2,2,3]       
    ];

    var map = new Array(pool.length);
    for (var y=0; y < pool.length; y++) {
        map[y] = new Array(pool[0].length);
    }

    for(var y=0; y<pool.length; y++) {
        for(var x=0; x<pool[0].length; x++) {
            if(pool[y][x] === 1) {
                map[y][x] = new Lootr.Tile(Lootr.Tile.treeTile);
            } else if(pool[y][x] === 2) {
                map[y][x] = new Lootr.Tile(Lootr.Tile.waterTile);
            } else if(pool[y][x] === 3) {
                map[y][x] = new Lootr.Tile(Lootr.Tile.wallTile);            
            } else {
                map[y][x] = Lootr.Tile.nullTile;
            }
        }
    }

    return map;
};

/*Lootr.Builder.prototype.getTiles = function () {
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
    return map;*/

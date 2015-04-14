
Lootr.Map.Desert = function(player) {

    this._width = 30;
    this._height = 30;

    // Build Map
    //var tiles = new Lootr.Builder(this._width, this._height).getTiles();
    var tiles = this._generateLevel();

    // Call the Map constructor
    Lootr.Map.call(this, tiles);

    // Add the player
    this.addEntityAtRandomPosition(player);

    // Add random entities
    for(var i=0; i<5; i++) {
        var entity = Lootr.EntityRepository.createRandom();

        // Add a random entity
        this.addEntityAtRandomPosition(entity);
    }

    // Add random items
    for(var i=0; i<50; i++) {
        this.addItemAtRandomPosition(Lootr.ItemRepository.createRandom());
    }

    // Add weapons and armor to the map
    var templates = ['dagger', 'club'];

    for(var i=0; i<templates.length; i++) {
        this.addItemAtRandomPosition(Lootr.ItemRepository.create(templates[i]));
    }

    // Add Orb
    this.addItemByTypeAndAmount('Yellow Orb', 1);

    // Add exit back to overworld
    var pos = this.getRandomFloorPosition();
    this._tiles[pos.x][pos.y] = new Lootr.Tile(Lootr.Tile.exitToOverworld);
};

Lootr.Map.Desert.extend(Lootr.Map);

Lootr.Map.Desert.prototype._generateLevel = function() {
    // Create the empty map
    var map = new Array(this._width);
    for (var w = 0; w < this._width; w++) {
        map[w] = new Array(this._height);
    }
    // Setup the cave generator
    var generator = new ROT.Map.Cellular(this._width, this._height);

    generator.randomize(0.7);


    var totalIterations = 3;
    // Iteratively smoothen the map
    for (var i = 0; i < totalIterations - 1; i++) {
        generator.create();
    }
    // Smoothen it one last time and then update our map
    generator.create(function(x,y,v) {
        if (v === 1) {
            map[x][y] = new Lootr.Tile(Lootr.Tile.sandTile);
        } else {
            map[x][y] = new Lootr.Tile(Lootr.Tile.rockTile);
        }
    });
    return map;
};
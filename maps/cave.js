
Lootr.Map.Cave = function(player) {

    this._width = 100;
    this._height = 200;

    // Build Map
    var tiles = this._generateLevel();

    // Call the Map constructor
    Lootr.Map.call(this, tiles);

    // Add exit back to overworld
    var pos = this.getRandomFloorPosition();
    this.setTile(pos.x, pos.y, new Lootr.Tile(Lootr.Tile.exitToOverworld));

    // Try to add graveyard to level
    //this.addSegment(new Lootr.BuilderTemplate(Lootr.Builder.Graveyard).generate());

    // Try to add gem treasure to level;
    //this.addSegment(new Lootr.BuilderTemplate(Lootr.Builder.GemTreasure).generate());

    // Try to add stream to level
    //this.addSegment(new Lootr.BuilderTemplate(Lootr.Builder.Stream).generate());

    // Add entities
    this.addEntityByTypeAndAmount('skeleton', 30);
    this.addEntityByTypeAndAmount('bat', 25);
    this.addEntityByTypeAndAmount('spider', 10);
    // this.addEntityByTypeAndAmount('spider nest', 20);
    this.addEntityByTypeAndAmount('slime', 25);
    //this.addEntityByTypeAndAmount('fungus', 30);
    //this.addEntityByTypeAndAmount('dragon', 10);

    // Add items
    //this.generateItemPoolByRarity(Lootr.ITEM_RARITY.COMMON, 50);
    //this.generateItemPoolByRarity(Lootr.ITEM_RARITY.MAGICAL, 20);
    //this.generateItemPoolByRarity(Lootr.ITEM_RARITY.RARE, 4);
    //this.generateItemPoolByRarity(Lootr.ITEM_RARITY.UNIQUE, 1);

    //this.addItemByTypeAndAmount('unidentified', 100);
    this.addItemByTypeAndAmount('potion', 25);
    this.addItemByTypeAndAmount('robe', 50);
    this.addItemByTypeAndAmount('apple', 50);
    //this.addItemByTypeAndAmount('dagger', 250);
    this.addItemByTypeAndAmount('gold', 50);
    //this.addItemByTypeAndAmount('metal helmet', 250);
    //this.addItemByTypeAndAmount('leather boots', 250);
    //this.addItemByTypeAndAmount('silver ring', 250);
    //this.addItemByTypeAndAmount('green ring', 250);
    this.addItemByTypeAndAmount('red ring', 25);

    // Add Traps
    //this.addItemByTypeAndAmount('spike trap', 70);

    // Add Orb
    this.addItemByTypeAndAmount('Red Orb', 1);

    // Add the player
    this.addEntityAtRandomPosition(player);
};
Lootr.Map.Cave.extend(Lootr.Map);

Lootr.Map.Cave.prototype._generateLevel = function() {

    this.createEmptyMap();
    var map = this.getEmptyMap();

    // Setup the cave generator
    var generator = new ROT.Map.Cellular(this._width, this._height);
    generator.randomize(0.5);

    // Iteratively smoothen the map
    var totalIterations = Lootr.getRandomInt(1, 10);
    for (var i = 0; i < totalIterations - 1; i++) {
        generator.create();
    }
    // Smoothen it one last time and then update our map
    generator.create(function(x, y, v) {
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

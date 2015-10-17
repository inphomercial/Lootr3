
Lootr.Builder = {};

Lootr.Builder = function(args) {

    var args = args || {};

    this.layout = args['layout'] || {};
    this.special = args['special'] || undefined;
    this.map = null;
};

Lootr.Builder.prototype.generate = function(global_map) {
    this._generateLayout();
    this._generateSpecial(global_map);

    return this.map;
};

Lootr.Builder.prototype._populateEmptyMapArray = function() {
    this.map = new Array(this.layout.length);

    for (var y = 0; y < this.layout.length; y++) {
        this.map[y] = new Array(this.layout[0].length);
    }
};

Lootr.Builder.prototype._generateLayout = function() {
    this._populateEmptyMapArray();

    for(var y = 0; y < this.layout.length; y++) {
        for(var x = 0; x < this.layout[0].length; x++) {

            switch(this.layout[y][x]) {
                case 0:
                    this.map[y][x] = new Lootr.Tile(Lootr.Tile.floorTile);
                    break;
                case 1:
                    this.map[y][x] = new Lootr.Tile(Lootr.Tile.wallTile);
                    break;
                case 2:
                    this.map[y][x] = new Lootr.Tile(Lootr.Tile.waterTile);
                    break;
                case 3:
                    this.map[y][x] = new Lootr.Tile(Lootr.Tile.treeTile);
                    break;
                case 4:
                    this.map[y][x] = new Lootr.Tile(Lootr.Tile.wallGemTile);
                    break;
                case 5:
                    this.map[y][x] = new Lootr.Tile(Lootr.Tile.tombstoneTile);
                    break;
                case 6:
                    this.map[y][x] = new Lootr.Tile(Lootr.Tile.grassTile);
                    break;

                default:
                    this.map[y][x] = Lootr.Tile.nullTile;
                    console.log("Tile not found in builder template");
            }
        }
    }

    return this;
};


Lootr.BuilderTemplate = function(args) {
    var args = args || {};

    // Call the glyphs constructor with our args
    Lootr.Builder.call(this, args);
};

// Make dynamic inherit all functionality from Builder
Lootr.BuilderTemplate.extend(Lootr.Builder);

Lootr.BuilderTemplate.prototype._generateSpecial = function(global_map) {
    if(this.special != undefined) {
        for(var i=0; i<this.special.length; i++) {
            //this.special[i].run(map_level);
            this.special[i].run(this.map, global_map);
        }
    }

    return this;
};

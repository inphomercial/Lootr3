Lootr.Builder = function(args) {
    
    args = args || {};

    this.layout = args['layout'] || {};
    this.special = args['special'] || undefined;

    // Completed item
    this.map;
};

Lootr.Builder.prototype.generate = function() {    
    this.generateLayout();
    this.generateSpecial();
    return this.map;
};

Lootr.Builder.prototype.generateLayout = function() {

    this.map = new Array(this.layout.length);
    for (var y=0; y < this.layout.length; y++) {
        this.map[y] = new Array(this.layout[0].length);
    }

    for(var y=0; y<this.layout.length; y++) {
        for(var x=0; x<this.layout[0].length; x++) {

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

                default:
                    this.map[y][x] = Lootr.Tile.nullTile;
                    console.log("Tile not found in builder template");
            }

        }
    }

    return this;
};


Lootr.BuilderTemplate = function(args) {
    args = args || {};

    // Call the glyphs constructor with our args
    Lootr.Builder.call(this, args);
}

// Make dynamic inherit all functionality from glyphs
Lootr.BuilderTemplate.extend(Lootr.Builder);

Lootr.BuilderTemplate.prototype.generateSpecial = function() {

    if(this.special != undefined) {
        for(var i=0; i<this.special.length; i++) {            
            //this.special[i].run(map_level);            
            this.special[i].run(this.map);            
        }    
    }
    
    return this;
};

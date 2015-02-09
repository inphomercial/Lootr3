Lootr.Builder = function(args) {
    
    this.args = args || {};

    this.layout = args['layout'];
};

Lootr.Builder.prototype.generateLayout = function() {

    var map = new Array(this.layout.length);
    for (var y=0; y < this.layout.length; y++) {
        map[y] = new Array(this.layout[0].length);
    }

    for(var y=0; y<this.layout.length; y++) {
        for(var x=0; x<this.layout[0].length; x++) {

            switch(this.layout[y][x]) {
                case 0:
                    map[y][x] = new Lootr.Tile(Lootr.Tile.floorTile);
                    break;
                case 1:
                    map[y][x] = new Lootr.Tile(Lootr.Tile.wallTile);
                    break;
                case 2:
                    map[y][x] = new Lootr.Tile(Lootr.Tile.waterTile);            
                    break;
                case 3:
                    map[y][x] = new Lootr.Tile(Lootr.Tile.treeTile);            
                    break;
                case 4:
                    map[y][x] = new Lootr.Tile(Lootr.Tile.wallGemTile);            
                    break;

                default:
                    map[y][x] = Lootr.Tile.nullTile;
                    console.log("Tile not found in builder template");
            }
        }
    }

    return map;
};

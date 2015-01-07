
// Tile builds off of a glyph for it's graphics
Lootr.Tile = function(args) {
	args = args || {};

	// Call Glyph constructor with our args
	Lootr.Glyph.call(this, args);

	// Setup the args, using false by default
	this._walkable = args['walkable'] || false;
	this._diggable = args['diggable'] || false;
	this._blocksLight = args['blocksLight'] == false ? false : true;
	this._description = args['description'] || '';
	this._ground = args['ground'] || false;
};

// Make all tiles inhert all the functionality of glyphs
Lootr.Tile.extend(Lootr.Glyph);

Lootr.Tile.prototype.isBlockingLight = function() {
	return this._blocksLight;
};

Lootr.Tile.prototype.isWalkable = function() {
	return this._walkable;
};

Lootr.Tile.prototype.isDiggable = function() {
	return this._diggable;
};

Lootr.Tile.prototype.getDescription = function() {
	return this._description;
};

Lootr.Tile.prototype.isGround = function() {
	return this._ground;
};

// Helper function
Lootr.getNeighborPositions = function(x, y) {
    var tiles = [];
    // Generate all possible offsets
    for (var dX = -1; dX < 2; dX ++) {
        for (var dY = -1; dY < 2; dY++) {
            // Make sure it isn't the same tile
            if (dX == 0 && dY == 0) {
                continue;
            }
            tiles.push({x: x + dX, y: y + dY});
        }
    }
    return tiles.randomize();
};

Lootr.Tile.nullTile = new Lootr.Tile({description: '(unknown)'});

Lootr.Tile.floorTile = {
	character: '.',
	walkable: true,
	blocksLight: false,
	ground: true,
	description: 'A cave floor'
};

Lootr.Tile.wallTile = {
	character: '#',
	foreground: 'goldenrod',	
	diggable: true,
	description: 'A Cave wall'
};

Lootr.Tile.sandTile = {
	character: '~',
	foreground: 'yellow',
	blocksLight: false,
	walkable: true,
	ground: true,
	description: 'Sand'
};

Lootr.Tile.rockTile = {
	character: '*',
	foreground: 'white',
	diggable: false,
	walkable: false,
	description: 'A rock'
};

Lootr.Tile.wallGemTile = {
	character: '#',
	foreground: 'aquamarine',
	diggable: false,
	description: 'A Gem'
};

Lootr.Tile.waterTile = {
	character: '~',
	foreground: '#00CCFF',
	walkable: false,
	ground: true,
	blocksLight: false,
	description: 'Murky water'
};

Lootr.Tile.holeToCavernTile = {
	character: 'O',
	foreground: 'white',
	walkable: true,
	blocksLight: false,
	description: 'A cave opening'
};
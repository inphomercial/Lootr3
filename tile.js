
// Tile builds off of a glyph for it's graphics
Lootr.Tile = function(args) {
	args = args || {};

	// Call Glyph constructor with our args
	Lootr.Glyph.call(this, args);

	// Setup the args, using false by default
	this._walkable = args['walkable'] || false;
	this._diggable = args['diggable'] || false;
	this._blocksLight = args['blocksLight'] == false ? false : true;
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

Lootr.Tile.nullTile = new Lootr.Tile(new Lootr.Glyph());

Lootr.Tile.floorTile = new Lootr.Tile({
	character: '.',
	walkable: true,
	blocksLight: false
});

Lootr.Tile.wallTile = new Lootr.Tile({
	character: '#',
	foreground: 'goldenrod',	
	diggable: true
});

Lootr.Tile.wallGemTile = new Lootr.Tile({
	character: '#',
	foreground: '#FF33CC',
	diggable: false
});

Lootr.Tile.waterTile = new Lootr.Tile({
	character: '~',
	foreground: '#00CCFF',
	walkable: false,
	blocksLight: false
});
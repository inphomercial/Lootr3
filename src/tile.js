
// Tile builds off of a glyph for it's graphics
Lootr.Tile = function(args) {
    args = args || {};

    // Call Glyph constructor with our args
    Lootr.Glyph.call(this, args);

    // Setup the args, using false by default
    this._walkable = args['walkable'] || false;
    this._diggable = args['diggable'] || false;
    this._blocksLight = args['blocksLight'] != false;
    this._description = args['description'] || '';
    this._ground = args['ground'] || false;
    this._itemSpawnable = args['itemSpawnable'] != false;
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

Lootr.Tile.prototype.isItemSpawnable = function() {
    return this._itemSpawnable;
};

Lootr.Tile.prototype.isGround = function() {
    return this._ground;
};
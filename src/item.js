
Lootr.Item = function(args) {
    args = args || {};

    // Call the Dynamicglyphs construct with our args
    Lootr.DynamicGlyph.call(this, args);

    // Instantiate any properties from the args
    this._name = args['name'];
    this._slot = args['slot'];
    this._rarity = args['rarity'] || Lootr.ITEM_RARITY.COMMON;
};

 // Items inhert all functionality of glyphs
Lootr.Item.extend(Lootr.DynamicGlyph);

Lootr.Item.prototype.pickup = function() {
    for(var i=0; i<this._attachedComponents.length; i++) {
        this._attachedComponents[i].pickup();
    }
}

Lootr.Item.prototype.getSlot = function() {
    return this._slot;
};
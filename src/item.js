
Lootr.Item = function(args) {
    args = args || {};

    // Call the Dynamicglyphs construct with our args
    Lootr.DynamicGlyph.call(this, args);

    // Instantiate any properties from the args
    this._name = args['name'];
    this._slot = args['slot'];
    this._rarity = args['rarity'] || Lootr.ITEM_RARITY.COMMON;
    this._worn = false;
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

Lootr.Item.prototype.setWorn = function(worn) {
    this._worn = worn;
};

Lootr.Item.prototype.getWorn = function() {
    return this._worn;
};

Lootr.Item.prototype.getRarity = function() {
    return this._rarity;
};

Lootr.Item.prototype.setRarity = function(rarity) {
    this._rarity = rarity;
};
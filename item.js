
Lootr.Item = function(args) {
	args = args || {};

	// Call the Dynamicglyphs construct with our args
	Lootr.DynamicGlyph.call(this, args);

	// Instantiate any properties from the args
	this._name = args['name'];
};

 // Items inhert all functionality of glyphs
Lootr.Item.extend(Lootr.DynamicGlyph);

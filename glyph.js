
Lootr.Glyph = function(args) {
	// Instantiate properties to default if they werent passed
	args = args || {};

	this._char = args['character'] || ' ';
	this._foreground = args['foreground'] || 'white';
	this._background = args['background'] || 'black';
};

Lootr.Glyph.prototype.getChar = function() {
	return this._char;
};

Lootr.Glyph.prototype.getForeground = function() {
	return this._foreground;
};

Lootr.Glyph.prototype.getBackground = function() {
	return this._background;
};

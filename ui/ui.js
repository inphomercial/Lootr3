
Lootr.UI = {};

Lootr.UI.HungerDisplay = {
	init: function(player, startX, startY, display) {
		this._display = display;
		this._player = player;
		this._startX = startX;
		this._startY = startY;

		this._buildHungerDisplay();
	},
	_buildHungerDisplay: function() {
		var amount;
        this._display.drawText(this._startX, this._startY++, "---------");
        this._colorBar(this._startX, this._startY);
        this._display.drawText(this._startX, this._startY, "---------");
	},
	_getPercentRemaining: function() {
		return 26;
		// return this._player.getPercentRemaining();
	},
	_colorBar: function(x, y) {
		percent = this._getPercentRemaining();

		if(percent <= 10 && percent > 5) {
	        this._display.drawText(this._startX, this._startY++, "%c{pink}%b{pink}[][]");
		} else if (percent <= 40 && percent > 10) {
	        this._display.drawText(this._startX, this._startY++, "%c{yellow}%b{yellow}[][]");
		} else if (percent > 40) {
	        this._display.drawText(this._startX, this._startY++, "%c{green}%b{green}[][][][][]");
		}
	}
}

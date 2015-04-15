
Lootr.UI = {};

Lootr.UI.NameDisplay = {
    init: function(player, startX, startY, display) {
        this._display = display;
        this._player = player;
        this._startX = startX;
        this._startY = startY;

        this._buildNameDisplay();
    },
    _buildNameDisplay: function() {
        var name = '%c{#91AA9D}%b{black} Name: %c{#CCB4B0}Inpho';
        this._display.drawText(this._startX, this._startY++, name);
    }
};

Lootr.UI.GoldDisplay = {
    init: function(player, startX, startY, display) {
        this._display = display;
        this._player = player;
        this._startX = startX;
        this._startY = startY;

        this._buildGoldDisplay();
    },
    _buildGoldDisplay: function() {
        var gold = '%c{#91AA9D}%b{black} GOLD: %c{gold}' + this._player.getGold();
        this._display.drawText(this._startX, this._startY, gold);
    }
};

Lootr.UI.HungerDisplay = {
    init: function(player, startX, startY, display) {
        this._display = display;
        this._player = player;
        this._startX = startX;
        this._startY = startY;

        this._offSet = 8;

        this._buildColorBar();
    },
    _buildColorBar: function() {
        percent = this._getPercentRemaining();

        this._startY++;

        this._display.drawText(this._startX, this._startY, '%c{#91AA9D}%b{black}HUNGER: %c{#FCFFF5}');

        var startX = this._startX + this._offSet;

        if (percent <= 5) {              
            this._display.drawText(startX, this._startY, "%c{grey}%b{grey}oooooo");   
            this._display.drawText(startX, this._startY, "%c{red}%b{red}o");  
        } else if (percent > 5 && percent <= 25) {
            this._display.drawText(startX, this._startY, "%c{grey}%b{grey}oooooo");   
            this._display.drawText(startX, this._startY, "%c{red}%b{red}oo");    
        } else if (percent > 25 && percent <= 50) {
            this._display.drawText(startX, this._startY, "%c{grey}%b{grey}oooooo");   
            this._display.drawText(startX, this._startY, "%c{pink}%b{pink}ooo");    
        } else if (percent > 50 && percent <= 75) {
            this._display.drawText(startX, this._startY, "%c{grey}%b{grey}oooooo");   
            this._display.drawText(startX, this._startY, "%c{yellow}%b{yellow}oooo");    
        } else if (percent > 75 && percent < 100) {
            this._display.drawText(startX, this._startY, "%c{grey}%b{grey}oooooo");   
            this._display.drawText(startX, this._startY, "%c{green}%b{green}ooooo");    
        } else if (percent == 100) {
            this._display.drawText(startX, this._startY, "%c{lightgreen}%b{lightgreen}oooooo");    
        }

        this._startY++;
    },
    _getPercentRemaining: function() {
        return this._player.getHungerPercent();
    }
};


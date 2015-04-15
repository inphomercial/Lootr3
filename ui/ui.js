
Lootr.UI = {};

Lootr.UI.NameDisplay = {
    init: function(player, startX, startY, display) {
        this._display = display;
        this._player = player;
        this._startX = startX;
        this._startY = startY;

        this._draw();
    },
    _draw: function() {
        var name = '%c{#91AA9D}%b{black} Name: %c{#CCB4B0}Inpho';
        this._display.drawText(this._startX, this._startY++, name);
    }
};

Lootr.UI.WearingDisplay = {
    init: function(player, startX, startY, display) {
        this._display = display;
        this._player = player;
        this._startX = startX;
        this._startY = startY;

        this._draw();
    },
    _draw: function() {
        var wearingString = '%c{#91AA9D}%b{black}';
        var wearing = this._player.getArmor();

        if(wearing) {
            wearingString += 'Wearing: %c{#7E7F7A}' + wearing.getName();
            this._display.drawText(this._startX, this._startY++, wearingString);
        } else {
            wearingString += "Wearing: %c{#7E7F7A}none";
            this._display.drawText(this._startX, this._startY++, wearingString);
        }
    }
};

Lootr.UI.WieldingDisplay = {
    init: function(player, startX, startY, display) {
        this._display = display;
        this._player = player;
        this._startX = startX;
        this._startY = startY;

        this._draw();
    },
    _draw: function() {
        var weaponString = '%c{#91AA9D}%b{black}';
        var weapon = this._player.getWeapon();

        if(weapon) {
           weaponString += 'Wielding: %c{#7E7F7A}' + weapon.getName();
           this._display.drawText(this._startX, this._startY++, weaponString);
        } else {
           weaponString += "Wielding: %c{#7E7F7A}none";
           this._display.drawText(this._startX, this._startY++, weaponString);
        }
    }
};

Lootr.UI.LevelDisplay = {
    init: function(player, startX, startY, display) {
        this._display = display;
        this._player = player;
        this._startX = startX;
        this._startY = startY;

        this._draw();
    },
    _draw: function() {
        var level = '%c{#91AA9D}%b{black}LVL: %c{#FCFFF5}' + this._player.getLevel();
        this._display.drawText(this._startX, this._startY++, level);
    }
}

Lootr.UI.StatusDisplay = {
    init: function(player, startX, startY, display) {
        this._display = display;
        this._player = player;
        this._startX = startX;
        this._startY = startY;    

        this._draw();    
    },
    _draw: function() {        
        var status = "%c{#91AA9D}%b{black}STATUS: %c{#FCFFF5}%c{yellow}%b{black}";
        if(this._player.hasComponent('Flight') && this._player.isFlying()) {
           status += 'Flying ';
        }
        if(this._player.hasComponent('Invisiblity') && this._player.isInvisible()) {
           status += 'Invisible ';
        }
        if(this._player.hasComponent('PassThroughWalls')) {
           status += 'Walls ';
        }

        this._display.drawText(this._startX, this._startY++, status);
    }
};

Lootr.UI.ExperienceDisplay = {
    init: function(player, startX, startY, display) {
        this._display = display;
        this._player = player;
        this._startX = startX;
        this._startY = startY;    

        this._draw();    
    },
    _draw: function() {
        var xp = '%c{#91AA9D}%b{black}XP: %c{#FCFFF5}' + this._player.getExperience();        
        this._display.drawText(this._startX, this._startY++, xp);
    }
};
        
Lootr.UI.HealthDisplay = {
    init: function(player, startX, startY, display) {
        this._display = display;
        this._player = player;
        this._startX = startX;
        this._startY = startY;

        this._draw();
    },
    _draw: function() {
        var hp = '%c{#91AA9D}%b{black} HP: %c{#FCFFF5}' + this._player.getHp() + '/' + this._player.getMaxHp();
        this._display.drawText(this._startX, this._startY++, hp);
    }
};

Lootr.UI.AttackValueDisplay = {
    init: function(player, startX, startY, display) {
        this._display = display;
        this._player = player;
        this._startX = startX;
        this._startY = startY;

        this._draw();
    },
    _draw: function() {
        var attack = '%c{#91AA9D}%b{black} ATK: %c{gold}' + this._player.getAttackValue();
        this._display.drawText(this._startX, this._startY, attack);
    }
};

Lootr.UI.GoldDisplay = {
    init: function(player, startX, startY, display) {
        this._display = display;
        this._player = player;
        this._startX = startX;
        this._startY = startY;

        this._draw();
    },
    _draw: function() {
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

        this._draw();
    },
    _draw: function() {
        percent = this._player.getHungerPercent();

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
    }
};


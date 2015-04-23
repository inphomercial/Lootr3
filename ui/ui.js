
Lootr.UI = {};

/*
 * Renders out the main games border window
 */
Lootr.UI.RenderGameBorder = function(display) {
    var screenWidth = Lootr._mapScreenWidth;
    var screenHeight = Lootr._mapScreenHeight;

    for(var x=0; x<=screenWidth; x++) {
        for(var y=0; y<=screenHeight; y++) {
            if(y == 0) {
                display.drawText(x, y, "%b{grey}%c{grey}*");
            }
            if(y == screenHeight) {
                display.drawText(x, y, "%b{grey}%c{grey}*");
            }
            if(x == 0) {
                display.drawText(x, y, "%b{grey}%c{grey}*");
            }
            if(x == screenWidth) {
                display.drawText(x, y, "%b{grey}%c{grey}*");
            }
        }
    }
};

/*
 * Renders the Game Messages window
 */
Lootr.UI.RenderGameMessages = function(player, startX, startY, display) {
   // Draw messages
    var messages = this._player.getMessages();
    for(var i=0; i<messages.length; i++) {
        // Draw each message adding the number of lines
        display.drawText(startX, startY, '%c{white}%b{black}' + messages[i]);
        startY++;
    }
};

/*
 * Renders out the Orbs GUI
 */
Lootr.UI.RenderOrbsGroup = function(player, startX, startY, display) {
    var orbs = player.hasOrbs();

    display.drawText(101 + startX, startY, "Orbs");

    if(orbs.red) {
        display.drawText(102 + startX, startY + 2, "%c{red}O");
    } else {
        display.drawText(102 + startX, startY + 2, "%c{grey}o");
    }

    if(orbs.yellow) {
        display.drawText(100 + startX, startY + 3, "%c{yellow}O");
    } else {
        display.drawText(100 + startX, startY + 3, "%c{grey}o");
    }

    if(orbs.green) {
        display.drawText(104 + startX, startY + 3, "%c{green}O");
    } else {
        display.drawText(104 + startX, startY + 3, "%c{grey}o");
    }

    if(orbs.blue) {
        display.drawText(102 + startX, startY + 4, "%c{blue}O");
    } else {
        display.drawText(102 + startX, startY + 4, "%c{grey}o");
    }
 };

/*
 * Renders out the entire stats GUI
 */
Lootr.UI.RenderStatsGroup = function(player, startX, startY, display) {
    Lootr.UI.NameDisplay(player, startX + 82, startY++, display);
    startY++;

    Lootr.UI.HealthDisplay(player, startX + 82, startY++, display);

    Lootr.UI.LevelDisplay(player, startX + 82, startY++, display);

    Lootr.UI.ExperienceDisplay(player, startX + 82, startY++, display);

    Lootr.UI.GoldDisplay(player, startX + 82, startY++, display);

    Lootr.UI.HungerDisplay(player, startX + 82, startY, display);
    startY=startY+3;

    Lootr.UI.WieldingDisplay(player, startX + 82, startY, display);
    startY++;

    Lootr.UI.WearingDisplay(player, startX + 82, startY, display);
    startY++;
    startY++;

    Lootr.UI.StatusDisplay(player, startX + 82, startY++, display);
    startY++;

    Lootr.UI.AttackValueDisplay(player, startX + 82, startY++, display);
};

Lootr.UI.NameDisplay = function(player, startX, startY, display) {
    var name = '%c{#91AA9D}%b{black} Name: %c{#CCB4B0}Inpho';
    display.drawText(startX, startY++, name);
};

Lootr.UI.WearingDisplay = function(player, startX, startY, display) {
    var wearingString = '%c{#91AA9D}%b{black}';
    var wearing = player.getArmor();

    if(wearing) {
        wearingString += 'Wearing: %c{#7E7F7A}' + wearing.getName();
        display.drawText(startX, startY++, wearingString);
    } else {
        wearingString += "Wearing: %c{#7E7F7A}none";
        display.drawText(startX, startY++, wearingString);
    }
};

Lootr.UI.WieldingDisplay = function(player, startX, startY, display) {
    var weaponString = '%c{#91AA9D}%b{black}';
    var weapon = player.getWeapon();

    if(weapon) {
       weaponString += 'Wielding: %c{#7E7F7A}' + weapon.getName();
       display.drawText(startX, startY++, weaponString);
    } else {
       weaponString += "Wielding: %c{#7E7F7A}none";
       display.drawText(startX, startY++, weaponString);
    }
};

Lootr.UI.LevelDisplay = function(player, startX, startY, display) {
    var level = '%c{#91AA9D}%b{black}LVL: %c{#FCFFF5}' + player.getLevel();
    display.drawText(startX, startY++, level);
};

Lootr.UI.StatusDisplay = function(player, startX, startY, display) {
    var status = "%c{#91AA9D}%b{black}STATUS: %c{#FCFFF5}%c{yellow}%b{black}";
    if(player.hasComponent('Flight') && player.isFlying()) {
       status += 'Flying ';
    }
    if(player.hasComponent('Invisiblity') && player.isInvisible()) {
       status += 'Invisible ';
    }
    if(player.hasComponent('PassThroughWalls')) {
       status += 'Walls ';
    }

    display.drawText(startX, startY++, status);
};

Lootr.UI.ExperienceDisplay = function(player, startX, startY, display) {
    var xp = '%c{#91AA9D}%b{black}XP: %c{#FCFFF5}' + player.getExperience();
    display.drawText(startX, startY++, xp);
};

Lootr.UI.HealthDisplay = function(player, startX, startY, display) {
    var hp = '%c{#91AA9D}%b{black} HP: %c{#FCFFF5}' + player.getHp() + '/' + player.getMaxHp();
    display.drawText(startX, startY++, hp);
};

Lootr.UI.AttackValueDisplay = function(player, startX, startY, display) {
    var attack = '%c{#91AA9D}%b{black} ATK: %c{gold}' + player.getAttackValue();
    display.drawText(startX, startY, attack);
};

Lootr.UI.GoldDisplay = function(player, startX, startY, display) {
    var gold = '%c{#91AA9D}%b{black} GOLD: %c{gold}' + player.getGold();
    display.drawText(startX, startY, gold);
};

Lootr.UI.HungerDisplay = function(player, startX, startY, display) {

    startY++;

    display.drawText(startX, startY, '%c{#91AA9D}%b{black}HUNGER: %c{#FCFFF5}');

    var offSet = 8;
    var percent = player.getHungerPercent();
    var startX = startX + offSet;

    if (percent <= 5) {
        display.drawText(startX, startY, "%c{grey}%b{grey}oooooo");
        display.drawText(startX, startY, "%c{red}%b{red}o");
    } else if (percent > 5 && percent <= 25) {
        display.drawText(startX, startY, "%c{grey}%b{grey}oooooo");
        display.drawText(startX, startY, "%c{red}%b{red}oo");
    } else if (percent > 25 && percent <= 50) {
        display.drawText(startX, startY, "%c{grey}%b{grey}oooooo");
        display.drawText(startX, startY, "%c{pink}%b{pink}ooo");
    } else if (percent > 50 && percent <= 75) {
        display.drawText(startX, startY, "%c{grey}%b{grey}oooooo");
        display.drawText(startX, startY, "%c{yellow}%b{yellow}oooo");
    } else if (percent > 75 && percent < 100) {
        display.drawText(startX, startY, "%c{grey}%b{grey}oooooo");
        display.drawText(startX, startY, "%c{green}%b{green}ooooo");
    } else if (percent == 100) {
        display.drawText(startX, startY, "%c{lightgreen}%b{lightgreen}oooooo");
    }

    startY++;
};


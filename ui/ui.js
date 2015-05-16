
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
    var messages = player.getMessages();
    for (var i = 0; i < messages.length; i++) {
        display.drawText(startX, startY, '%c{white}%b{black}' + messages[i]);
        startY++;
    }
};

/*
 * Renders out the Orbs GUI
 */
Lootr.UI.RenderOrbsGroup = function(player, startX, startY, display) {
    var orbs = player.hasOrbs();
    startY++;
    startY++;

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
    Lootr.UI.LootrDisplay(startX + 82, startY, display);
    startY++;
    startY++;

    Lootr.UI.NameDisplay(player, startX + 82, startY++, display);
    startY++;

    Lootr.UI.HealthDisplay(player, startX + 82, startY++, display);

    Lootr.UI.ManaDisplay(player, startX + 82, startY++, display);

    Lootr.UI.ClassDisplay(player, startX + 82, startY++, display);

    Lootr.UI.LevelDisplay(player, startX + 82, startY++, display);

    Lootr.UI.ExperienceDisplay(player, startX + 82, startY++, display);

    Lootr.UI.GoldDisplay(player, startX + 82, startY++, display);

    Lootr.UI.HungerDisplay(player, startX + 82, startY, display);
    startY=startY+3;

    startY = Lootr.UI.WieldingDisplay(player, startX + 82, startY, display);
    startY++;

    startY = Lootr.UI.WearingSlotDisplay(player, startX + 82, startY, display, Lootr.ITEM_SLOTS.HEAD);

    startY = Lootr.UI.WearingSlotDisplay(player, startX + 82, startY, display, Lootr.ITEM_SLOTS.BODY);

    startY = Lootr.UI.WearingSlotDisplay(player, startX + 82, startY, display, Lootr.ITEM_SLOTS.FINGER);

    startY = Lootr.UI.WearingSlotDisplay(player, startX + 82, startY, display, Lootr.ITEM_SLOTS.FEET);
    startY++;

    Lootr.UI.StatusDisplay(player, startX + 82, startY++, display);
    startY++;

    Lootr.UI.AttackValueDisplay(player, startX + 82, startY++, display);
    Lootr.UI.DefenseValueDisplay(player, startX + 82, startY, display);

    Lootr.UI.MovementSpeedDisplay(player, startX + 94, startY--, display);
    Lootr.UI.SightDisplay(player, startX + 94, startY++, display);
    startY++;
    startY++;

    Lootr.UI.StrDisplay(player, startX + 82, startY++, display);
    Lootr.UI.IntDisplay(player, startX + 82, startY++, display);
    Lootr.UI.DexDisplay(player, startX + 82, startY, display);

    startY--;
    startY--;
    Lootr.UI.SelectedSpellDisplay(player, startX + 94, startY++, display);
};

Lootr.UI.LootrDisplay = function(startX, startY, display) {
    display.drawText(startX, startY, "%c{yellow}L O O T r %c{white}");
};

Lootr.UI.HighScoreDisplay = function(startX, startY, display) {
    var score_text = '%c{#91AA9D}%b{black} Current High Score ';
    var record = Lootr.Storage.getRecord();

    display.drawText(startX, startY++, score_text);
    display.drawText(startX, startY++, "Level: " + record.level);
    display.drawText(startX, startY++, "Hp: " + record.hp + "/" + record.maxhp);
    display.drawText(startX, startY++, "Weapon: " + record.weapon);
    display.drawText(startX, startY++, "Armor: " + record.armor);
};

Lootr.UI.NameDisplay = function(player, startX, startY, display) {
    var name = '%c{#91AA9D}%b{black} Name: %c{#CCB4B0}Inpho';
    display.drawText(startX, startY++, name);
};

Lootr.UI.WearingSlotDisplay = function(player, startX, startY, display, slot) {
    var item_slots = player.getWornItemsBySlot(slot);
    var slot_count = player.getSlotCountBySlot(slot);

    for (var i = 0; i < slot_count; i++) {
        var weaponString = '%c{#91AA9D}%b{black}';

        if(item_slots[i] && item_slots[i].getWorn()) {
           weaponString += slot + ": %c{" + item_slots[i].getForeground() + "}" + item_slots[i].getChar() + " %c{#7E7F7A}" + item_slots[i].getNameUpper();
           display.drawText(startX, startY++, weaponString);
        } else {
           weaponString += slot + ": %c{#7E7F7A}None";
           display.drawText(startX, startY++, weaponString);
        }
    }

    return startY;
};

Lootr.UI.WieldingDisplay = function(player, startX, startY, display) {
    var hand_slots = player.getWornItemsBySlot(Lootr.ITEM_SLOTS.HAND);
    var slot_count = player.getSlotCountBySlot(Lootr.ITEM_SLOTS.HAND);

    for (var i = 0; i < slot_count; i++) {
        var weaponString = '%c{#91AA9D}%b{black}';

        if(hand_slots[i] && hand_slots[i].getWorn()) {
           weaponString += 'Wielding: %c{' + hand_slots[i].getForeground() + '}' + hand_slots[i].getChar() + ' %c{#7E7F7A}' + hand_slots[i].getNameUpper();
           display.drawText(startX, startY++, weaponString);
        } else {
           weaponString += "Wielding: %c{#7E7F7A}None";
           display.drawText(startX, startY++, weaponString);
        }
    }

    return startY;
};

Lootr.UI.SelectedSpellDisplay = function(player, startX, startY, display) {
    var selectedSpell = '%c{#91AA9D}%b{black}SPELL: %c{#FCFFF5}' + player.getSelectedSpell();
    display.drawText(startX, startY++, selectedSpell);
};

Lootr.UI.MovementSpeedDisplay = function(player, startX, startY, display) {
    var movementSpeed = '%c{#91AA9D}%b{black}SPD: %c{#FCFFF5}' + player.getMovementSpeed();
    display.drawText(startX, startY++, movementSpeed);
};

Lootr.UI.SightDisplay = function(player, startX, startY, display) {
    var sight = '%c{#91AA9D}%b{black}SGT: %c{#FCFFF5}' + player.getSightRadius();
    display.drawText(startX, startY++, sight);
};

Lootr.UI.StrDisplay = function(player, startX, startY, display) {
    var  strValue = '%c{#91AA9D}%b{black}STR: %c{#FCFFF5}' + player.getBaseStr() + '%c{green} (' + player.getStrValue() +')';
    display.drawText(startX, startY, strValue);
};

Lootr.UI.DexDisplay = function(player, startX, startY, display) {
    var  dexValue = '%c{#91AA9D}%b{black}DEX: %c{#FCFFF5}' + player.getBaseDex() + '%c{green} (' + player.getDexValue() +')';
    display.drawText(startX, startY, dexValue);
};

Lootr.UI.IntDisplay = function(player, startX, startY, display) {
    var  intValue = '%c{#91AA9D}%b{black}INT: %c{#FCFFF5}' + player.getBaseInt() + '%c{green} (' + player.getIntValue() +')';
    display.drawText(startX, startY, intValue);
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

Lootr.UI.ManaDisplay = function(player, startX, startY, display) {
    if (player.hasComponent("ManaPool")) {
        var mp = '%c{#91AA9D}%b{black} MP: %c{#FCFFF5}' + player.getMana() + '/' + player.getMaxMana();
    } else {
        var mp = '%c{#91AA9D}%b{black} MP: %c{#FCFFF5}' + 0 + '/' + 0;
    }

    display.drawText(startX, startY++, mp);
};

Lootr.UI.DefenseValueDisplay = function(player, startX, startY, display) {
    var def = '%c{#91AA9D}%b{black} DEF: %c{gold}' + player.getBaseDefenseValue() + '%c{green} (' + player.getDefenseValue() + ')';
    display.drawText(startX, startY, def);
};

Lootr.UI.AttackValueDisplay = function(player, startX, startY, display) {
    var attack = '%c{#91AA9D}%b{black} ATK: %c{gold}' + player.getBaseAttackValue() + '%c{green} (' + player.getAttackValue() +')';
    display.drawText(startX, startY, attack);
};

Lootr.UI.GoldDisplay = function(player, startX, startY, display) {
    var gold = '%c{#91AA9D}%b{black} GOLD: %c{gold}' + player.getGold();
    display.drawText(startX, startY, gold);
};

Lootr.UI.ClassDisplay = function(player, startX, startY, display) {
    var char_class = '%c{#91AA9D}%b{black} CLASS: %c{white}' + player.getClass();
    display.drawText(startX, startY, char_class);
};

Lootr.UI.HungerDisplay = function(player, startX, startY, display) {

    startY++;

    display.drawText(startX, startY, '%c{#91AA9D}%b{black}HUNGER: %c{#FCFFF5}');

    if (!player.hasComponent('FoodConsumer')) return;

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
Lootr.Screen = {};

// Define our initial start screen
Lootr.Screen.startScreen = {
    enter: function() {    console.log("Entered start screen."); },
    exit: function() { console.log("Exited start screen."); },
    render: function(display) {
        // Render our prompt to the screen
        display.drawText(1,1, "%c{yellow}Javascript Roguelike");
        display.drawText(1,2, "Press [Enter] to start!");
    },
    handleInput: function(inputType, inputData) {
        // When [Enter] is pressed, go to the play screen
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.VK_RETURN) {
                Lootr.switchScreen(Lootr.Screen.playScreen);
            }
        }
    }
}

// Define our playing screen
Lootr.Screen.playScreen = {
    _player: null,
    _gameEnded: false,
    _subScreen: null,
    enter: function() {  

    	console.log("Entered play screen");
        
        // Create a map based on our size parameters
        var mapWidth = 300;
        var mapHeight = 300;
       
        // Create our player and set his position
        this._player = new Lootr.Entity(Lootr.TemplatePlayer);

        var tiles = new Lootr.Builder(mapWidth, mapHeight).getTiles();

        // Create our map from the tiles
        var map = [];
        var map = new Lootr.Map.Cave(tiles, this._player);
        //var map = new Lootr.Map.BossCavern();

        // Star the games engine
        map.getEngine().start();
    },
    exit: function() { console.log("Exited play screen."); },
    render: function(display) {
        // Render subscreen if there is one
        if(this._subScreen) {
            this._subScreen.render(display);
            return;
        }

        var screenWidth = Lootr.getScreenWidth();
        var screenHeight = Lootr.getScreenHeight();

        // Render the tiles
        this.renderTiles(display);

        // Draw messages
        var messages = this._player.getMessages();
        var messageY = 0;
        for(var i=0; i<messages.length; i++) {
        	// Draw each message adding the number of lines
        	messageY += display.drawText(
        		0,
        		messageY,
        		'%c{white}%b{black}' + messages[i]);
        }

        // Draw player stats
        var stats = '%c{white}%b{black}';
        stats += vsprintf('HP: %d/%d L: %d XP: %d', [this._player.getHp(), 
                                                     this._player.getMaxHp(),
                                                     this._player.getLevel(),
                                                     this._player.getExperience()]);

        display.drawText(0, screenHeight, stats);

        // Draw player hunger stat
        var hungerState = this._player.getHungerState();
        display.drawText(screenWidth - hungerState.length, screenHeight, hungerState);

    },
    getScreenOffsets: function() {
        // Make sure the x-axis doesn't go to the left of the left bound
        var topLeftX = Math.max(0, this._player.getX() - (Lootr.getScreenWidth() / 2));

        // Make sure we still have enough space to fit an entire Lootr screen
        topLeftX = Math.min(topLeftX, this._player.getMap().getWidth() - Lootr.getScreenWidth());

        // Make sure the y-axis doesn't above the top bound
        var topLeftY = Math.max(0, this._player.getY() - (Lootr.getScreenHeight() / 2));

        // Make sure we still have enough space to fit an entire Lootr screen
        topLeftY = Math.min(topLeftY, this._player.getMap().getHeight() - Lootr.getScreenHeight());

        return {
            x: topLeftX,
            y: topLeftY
        };
    },
    renderTiles: function(display) {
        var screenWidth = Lootr.getScreenWidth();
        var screenHeight = Lootr.getScreenHeight();
        var offsets = this.getScreenOffsets();
        var topLeftX = offsets.x;
        var topLeftY = offsets.y;

        // This object will track all visible map cells
        var visibleCells = {};

        // Store this._player.getMap() 
        var map = this._player.getMap();

        // Find all visible cells and update the object
        map.getFov().compute(
            this._player.getX(), this._player.getY(), 
            this._player.getSightRadius(), 
            function(x, y, radius, visibility) {
                visibleCells[x + "," + y] = true;

                // Mark the cell as explored
                map.setExplored(x, y, true);
        });

        // Render the explored, visible, items and entitiy map cells
        for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                if (map.isExplored(x, y)) {
                    // Fetch the glyph for the tile and render it to the screen
                    var glyph = map.getTile(x, y);
                    var foreground = glyph.getForeground();

                    // If we are at a cell that is in the FOV, we need to see
                    // If there are items or entities
                    if(visibleCells[x + ',' + y]) {
                        // Check for items first since we want to draw entities over them
                        var items = map.getItemsAt(x, y);

                        // If we have items, render the last one
                        if(items) {
                            glyph = items[items.length -1];
                        }
                        
                        // If we have entities
                        if(map.getEntityAt(x, y)) {
                            glyph = map.getEntityAt(x, y);
                        }

                        // Update the foreground color based on our glphy changed
                        foreground = glyph.getForeground();
                    } else {
                        // Since the tile was previously explored but is not visible
                        // make gray
                        foreground = '#282828';
                    }

                    display.draw(
                        x - topLeftX,
                        y - topLeftY,
                        glyph.getChar(), 
                        foreground, 
                        glyph.getBackground());
                }
            }
        }
    },
    handleInput: function(inputType, inputData) {
        // If the game si over, enter will bring the user to the loser screen
        if(this._gameEnded) {
            if(inputType === 'keydown' && inputData.keyCode === ROT.VK_RETURN) {
                Lootr.switchScreen(Lootr.Screen.loseScreen);
            }
            // Return to make sur ethe user cant still play
            return;
        }

        // Handle subscreen input if there is one
        if(this._subScreen) {
            this._subScreen.handleInput(inputType, inputData);
            return;
        }

        if (inputType === 'keydown') {
            // If enter is pressed, go to the win screen
            // If escape is pressed, go to lose screen
            if (inputData.keyCode === ROT.VK_LEFT) {
                this.move(-1, 0);
            } else if (inputData.keyCode === ROT.VK_RIGHT) {
                this.move(1, 0);
            } else if (inputData.keyCode === ROT.VK_UP) {
                this.move(0, -1);
            } else if (inputData.keyCode === ROT.VK_DOWN) {
                this.move(0, 1);

            // Test out animation stuff
            } else if (inputData.keyCode === ROT.VK_SPACE) {
                this._map.getEngine().lock();

            // Help Screen
            } else if (inputData.keyCode === ROT.VK_H) {
                // Show help screen
                this.setSubScreen(Lootr.Screen.helpScreen);
                return;

            // Look Screen
            } else if (inputData.keyCode === ROT.VK_L) {
                // Setup the look screen.
                var offsets = this.getScreenOffsets();
                Lootr.Screen.lookScreen.setup(this._player,
                    this._player.getX(), this._player.getY(),
                    offsets.x, offsets.y);
                this.setSubScreen(Lootr.Screen.lookScreen);
                return;
            
            // Inventory Stuff
            } else if (inputData.keyCode === ROT.VK_I) {
                // show inventory screen
                this.showItemSubScreen(Lootr.Screen.inventoryScreen, this._player.getItems(), 'You are not carrying anything');
                return;

            } else if (inputData.keyCode === ROT.VK_D) {
                // Show Drop screen                
                this.showItemSubScreen(Lootr.Screen.dropScreen, this._player.getItems(), 'You have nothing to drop.');
                return;

            } else if (inputData.keyCode === ROT.VK_E) {
                // show eat screen
                this.showItemSubScreen(Lootr.Screen.eatScreen, this._player.getItems(), 'You have nothing to eat.');
                return;

            } else if (inputData.keyCode === ROT.VK_X) {
                // show the examine screen
                this.showItemSubScreen(Lootr.Screen.examineScreen, this._player.getItems(), 'You have nothing to examine.');
                return;

            } else if (inputData.keyCode === ROT.VK_W) {
                if(inputData.shiftKey) {
                    // Show the wear screen                    
                    this.showItemSubScreen(Lootr.Screen.wearScreen, this._player.getItems(), 'You have nothing to wear.');                
                } else {
                    // Show the wield screen
                    this.showItemSubScreen(Lootr.Screen.wieldScreen, this._player.getItems(), 'You have nothing to wield.');                
                }
                return;
                
            } else if (inputData.keyCode === ROT.VK_COMMA) {
                var items = this._player.getMap().getItemsAt(this._player.getX(), this._player.getY());
                // If there are no items, show a message
                if(!items) {
                    Lootr.sendMessage(this._player, 'There is nothing here to pickup.');
                    Lootr.refresh();
                } else if (items.length === 1) {
                    // If only one item, try to pick it up
                    var item = items[0];
                    if(this._player.pickupItems([0])) {
                        Lootr.sendMessage(this._player, 'You pick up %s.', [item.describeA()]);
                    } else {
                        Lootr.sendMessage(this._player, 'Your inventory is full. Nothing was picked up.');
                    }
                } else {
                    // Show the pickup screen if there are many items
                    Lootr.Screen.pickupScreen.setup(this._player, items);
                    this.setSubScreen(Lootr.Screen.pickupScreen);
                    return;
                }
            } else {
                // not a valid key
                Lootr.sendMessage(this._player, 'Not a valid key..');
                Lootr.refresh();
                return;
            }

            // Unlock the engine
            this._player.getMap().getEngine().unlock();
        }    
    },
    move: function(dX, dY) {
    	console.log("Trying to move");

    	var newX = this._player.getX() + dX;
    	var newY = this._player.getY() + dY;

    	// Try to move 
    	this._player.tryMove(newX, newY, this._player.getMap());
    },
    setGameEnded: function(gameEnded) {
        this._gameEnded = gameEnded;
    },
    setSubScreen: function(subScreen) {
        this._subScreen = subScreen;

        // Refresh screen on chaning the subscreen
        Lootr.refresh();
    },
    showItemSubScreen: function(subScreen, items, emptyMessage) {
        if(items && subScreen.setup(this._player, items) > 0) {
            this.setSubScreen(subScreen);
        } else {
            Lootr.sendMessage(this._player, emptyMessage);
            Lootr.refresh();
        }
    }
}

Lootr.Screen.ItemListScreen = function(template) {
    // Setup based on the template
    this._caption = template['caption'];
    this._okFunction = template['ok'];

    // Whether a 'no item' option should appear
    this._hasNoItemOption = template['hasNoItemOption'];

    // By default we use the identity function
    this._isAcceptableFunction = template['isAcceptable'] || function(x) {
        return x;
    }

    // Whether the user can select items at all
    this._canSelectItem = template['canSelect'];

    // Whether the user can select multiple items
    this._canSelectMultipleItems = template['canSelectMultipleItems'];
}

Lootr.Screen.ItemListScreen.prototype.setup = function(player, items) {
    this._player = player;

    // Should be called before switching to the screen
    var count = 0;
    // Iterate over each time, keeping only the acceptable ones and counting the
    // number of acceptable items
    var that = this;
    this._items = items.map(function(item) {
        // Transform the item into null if it's not acceptable
        if(that._isAcceptableFunction(item)) {
            count++;
            return item;
        } else {
            return null;
        }
    });

    // Clean the set of selected indices
    this._selectedIndices = {};
    return count;
}

Lootr.Screen.ItemListScreen.prototype.render = function(display) {
    var letters = 'abcdefghijklmnopqrstuvwxyz';

    // Render the caption to the top row
    display.drawText(0, 0, this._caption);

    // Render the no item row if enabled
    if(this._hasNoItemOption) {
        display.drawText(0, 1, '0 - no item');
    }

    var row = 0;
    for(var i=0; i<this._items.length; i++) {
        // If we have an item, we want to render it.
        if(this._items[i]) {
            // Get the letter matching the item's index
            var letter = letters.substring(i, i+1);

            // If we have selected an item, show a +, else show
            // a dash betwen the letter and the items name
            var selectionState = (this._canSelectItem &&
                                  this._canSelectMultipleItems &&
                                  this._canselctedIndices[i]) ? '+' : '-';

            // Check if the item is worn or wielded
            var suffix = '';
            if(this._items[i] === this._player.getArmor()) {
                suffix = ' (wearing)';
            } else if(this._items[i] === this._player.getWeapon()) {
                suffix = ' (wielding)';
            }

            // Render at the correct row and add 2
            display.drawText(0, 2 + row, letter + ' ' + selectionState + ' ' + this._items[i].describe() + suffix);
            row++;
        }
    }
}

Lootr.Screen.ItemListScreen.prototype.handleInput = function(inputType, inputData) {
    if(inputType == 'keydown') {
        // If the user hit escape, hit enter and cannot select an item 
        // or hit enter without any items selecteed, cancel out
        if(inputData.keyCode === ROT.VK_ESCAPE || inputData.keyCode === ROT.VK_RETURN &&
           (!this._canSelectItem || Object.keys(this._selectedIndices).length === 0)) {
            Lootr.Screen.playScreen.setSubScreen(undefined);
        } else if (inputData.keyCode === ROT.VK_RETURN) {
            this.executeOkFunction();

        // Handle pressing 0 when 'no item' selection is enabled
        } else if (this._canSelectItem && this._hasNoItemOption && inputData.keyCode === ROT.VK_0) {
            this._selectedIndices = {};
            this.executeOkFunction();

        // Handle pressing a leter if we can select
        } else if (this._canSelectItem && inputData.keyCode >= ROT.VK_A && inputData.keyCode <= ROT.VK_Z) {
            // check if it maps to a valid item by subtracting 'a' from the character
            // to know what letter of the alphabet we used
            var index = inputData.keyCode - ROT.VK_A;
            if(this._items[index]) {
                // If multiple selection is allowed, toggle the selection status, else
                // select the item and exit the screen
                if(this._canSelectMultipleItems) {
                    if(this._selectedIndices[index]) {
                        delete this._selectedIndices[index];
                    } else {
                        this._selectedIndices[index] = true;
                    }

                    // Redraw screen
                    Lootr.refresh();
                } else {
                    this._selectedIndices[index] = true;
                    this.executeOkFunction();
                }
            }
        }
    }
}

Lootr.Screen.ItemListScreen.prototype.executeOkFunction = function() {
    // Gather the selected items
    var selectedItems = {};
    for(var key in this._selectedIndices) {
        selectedItems[key] = this._items[key];
    }

    // Switch back to the play screen
    Lootr.Screen.playScreen.setSubScreen(undefined);

    // Call the OK function and end the players turn if it return true
    if(this._okFunction(selectedItems)) {
        this._player.getMap().getEngine().unlock();
    }
}

Lootr.Screen.inventoryScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Inventory',
    canSelect: false
});

Lootr.Screen.pickupScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Choose the items you wish to pickup.',
    canSelect: true,
    canSelectMultipleItems: true,
    ok: function(selectedItems) {
        // Try to pickup all items, messagin the player if they
        // couldnt pick up all
        if(!this._player.pickupItems(Object.keys(selectedItems))) {
            Lootr.sendMessage(this._player, 'Your inventory is full. Not all items were picked up.');
        }

        return true;
    }
});

Lootr.Screen.eatScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Choose the item you wish to eat',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function(item) {
        return item && item.hasComponent('Edible');
    },
    ok: function(selectedItems) {
        // Eat the item, removing it if therea re no consumptions left
        var key = Object.keys(selectedItems);
        var item = selectedItems[key[0]];
        Lootr.sendMessage(this._player, 'You eat %s', [item.describeThe()]);
        item.eat(this._player);
        if(!item.hasRemainingConsumptions()) {
            this._player.removeItem(key);
        }

        return true;
    }
})

Lootr.Screen.dropScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Choose the item you wish to drop',
    canSelect: true,
    canSelectMultipleItems: false,
    ok: function(selectedItems) {
        // Drop the selected item
        this._player.dropItem(Object.keys(selectedItems)[0]);
        return true;
    }
});

Lootr.Screen.wearScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wear',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item && item.hasComponent('Equippable') && item.isWearable();
    },
    ok: function(item) {
        // Check if we selected no item
        var keys = Object.keys(selectedItems);
        if(keys.length === 0) {
            this._player.takeOff();
            Lootr.sendMessage(this._player, 'You are not wearing anything.');            
        } else {
            // Make sure to unequip the item first in case it is the weapon
            var item = selectedItems[keys[0]];
            this._player.unequip(item);
            this._player.wear(item);
            Lootr.sendMessage(this._player, 'You are wearing %s', [item.describeA()]);
        }
    }
});

Lootr.Screen.examineScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Choose the item you wish to examine',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function(item) {
        return true;
    },
    ok: function(selectedItems) {
        var keys = Object.keys(selectedItems);
        if(keys.length > 0) {
            var item = selectedItems[keys[0]];
            Lootr.sendMessage(this._player, 'It is %s (%s).',
                [
                    item.describeA(false),
                    item.details()
                ]);
        }
        return true;
    }
});

Lootr.Screen.wieldScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wield',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item && item.hasComponent('Equippable') && item.isWieldable();
    },
    ok: function(selectedItems) {
        // Check if we selected 'no item'
        var keys = Object.keys(selectedItems);
        if(keys.length === 0) {
            this._player.unwield();
            Lootr.sendMessage(this._player, 'You are empty handed.');
        } else {
            // Make sure to unequip the item first in case it is the armor
            var item = selectedItems[keys[0]];
            this._player.unequip(item);
            this._player.wield(item);
            Lootr.sendMessage(this._player, 'You are wielding %s', [item.describeA()]);
        }

        return true;
    }
});

Lootr.Screen.TargetBasedScreen = function(template) {
    template = template || {};

    // By default, our ok return does nothing and does not consume a turn
    this._isAcceptableFunction = template['okFunction'] || function(x, y) {
        return false;
    };

    // The default caption function simply returns an empty string
    this._captionFunction = template['captionFunction'] || function(x, y) {
        return '';
    }
};

Lootr.Screen.TargetBasedScreen.prototype.setup = function(player, startX, startY, offsetX, offsetY) {
    this._player = player;

    // store original pos, subtract the offset to make life easy so we
    // dont alwayshave to remove it
    this._startX = startX - offsetX;
    this._startY = startY - offsetY;

    // Store current cursor position
    this._cursorX = this._startX;
    this._cursorY = this._startY;

    // Store map offsets
    this._offsetX = offsetX;
    this._offsetY = offsetY;

    // Cache the FOV
    var visibleCells = {};
    this._player.getMap().getFov(this._player).compute(
        this._player.getX(), this._player.getY(),
        this._player.getSightRadius(),
        function(x, y, radius, visibility) {
            visibleCells[x + ',' + y] = true;
        });

    this._visibleCells = visibleCells;
};

Lootr.Screen.TargetBasedScreen.prototype.render = function(display) {
    Lootr.Screen.playScreen.renderTiles.call(Lootr.Screen.playScreen, display);

    // Draw a line from the start to the cursor
    var points = Lootr.Geometry.getLine(this._startX, this._startY, this._cursorX, this._cursorY);

    // Render stars along the line
    var l = points.length;
    for(var i=0; i < l; i++) {
        display.drawText(points[i].x, points[i].y, '%c{magenta}*');
    }

    // Render the caption at the botton
    display.drawText(0, Lootr.getScreenHeight() - 1,
        this._captionFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY));
};

Lootr.Screen.TargetBasedScreen.prototype.handleInput = function(inputType, inputData) {
    // Move the cursor
    if (inputType == 'keydown') {
        if (inputData.keyCode === ROT.VK_LEFT) {
            this.moveCursor(-1, 0);
        } else if (inputData.keyCode === ROT.VK_RIGHT) {
            this.moveCursor(1, 0);
        } else if (inputData.keyCode === ROT.VK_UP) {
            this.moveCursor(0, -1);
        } else if (inputData.keyCode === ROT.VK_DOWN) {
            this.moveCursor(0, 1);
        } else if (inputData.keyCode === ROT.VK_ESCAPE) {
            Lootr.Screen.playScreen.setSubScreen(undefined);
        } else if (inputData.keyCode === ROT.VK_RETURN) {
            this.executeOkFunction();
        }
    }
    Lootr.refresh();
};

Lootr.Screen.TargetBasedScreen.prototype.moveCursor = function(dx, dy) {
    // Make sure we stay within bounds.
    this._cursorX = Math.max(0, Math.min(this._cursorX + dx, Lootr.getScreenWidth()));
    // We have to save the last line for the caption.
    this._cursorY = Math.max(0, Math.min(this._cursorY + dy, Lootr.getScreenHeight() - 1));
};

Lootr.Screen.TargetBasedScreen.prototype.executeOkFunction = function() {
    // Switch back to the play screen.
    Lootr.Screen.playScreen.setSubScreen(undefined);
    // Call the OK function and end the player's turn if it return true.
    if (this._okFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY)) {
        this._player.getMap().getEngine().unlock();
    }
};

// Define our help screen
Lootr.Screen.helpScreen = {
    render: function(display) {
        var text = 'Lootr help';
        var border = '-------------';
        var y = 0;
        display.drawText(Lootr.getScreenWidth() / 2 - text.length / 2, y++, text);
        display.drawText(Lootr.getScreenWidth() / 2 - text.length / 2, y++, border);
        display.drawText(0, y++, 'asdf');
        display.drawText(0, y++, 'asdf');
        y += 3;
        display.drawText(0, y++, '[,] to pick up items');
        display.drawText(0, y++, '[d] to drop items');
        display.drawText(0, y++, '[e] to eat items');
        display.drawText(0, y++, '[w] to wield items');
        display.drawText(0, y++, '[W] to wield items');
        display.drawText(0, y++, '[x] to examine items');
        display.drawText(0, y++, '[l] to look around you');
        display.drawText(0, y++, '[?] to show this help screen');
        y += 3;
        text = '--- press any key to continue ---';
        display.drawText(Lootr.getScreenWidth() / 2 - text.length / 2, y++, text);
    },
    handleInput: function(inputType, inputData) {
        Lootr.Screen.playScreen.setSubScreen(null);
    }
};

Lootr.Screen.lookScreen = new Lootr.Screen.TargetBasedScreen({
    captionFunction: function(x, y) {        
        var map = this._player.getMap();
        // If the tile is explored, we can give a better capton
        if (map.isExplored(x, y)) {
            // If the tile isn't explored, we have to check if we can actually 
            // see it before testing if there's an entity or item.
            if (this._visibleCells[x + ',' + y]) {
                var items = map.getItemsAt(x, y);
                // If we have items, we want to render the top most item
                if (items) {
                    var item = items[items.length - 1];
                    return String.format('%s - %s (%s)',
                        item.getRepresentation(),
                        item.describeA(true),
                        item.details());
                // Else check if there's an entity
                } else if (map.getEntityAt(x, y)) {
                    var entity = map.getEntityAt(x, y);
                    return String.format('%s - %s (%s)',
                        entity.getRepresentation(),
                        entity.describeA(true),
                        entity.details());
                }
            }
            // If there was no entity/item or the tile wasn't visible, then use
            // the tile information.
            return String.format('%s - %s',
                map.getTile(x, y).getRepresentation(),
                map.getTile(x, y).getDescription());

        } else {
            // If the tile is not explored, show the null tile description.
            return String.format('%s - %s',
                Lootr.Tile.nullTile.getRepresentation(),
                Lootr.Tile.nullTile.getDescription());
        }
    }
});

Lootr.Screen.gainStatScreen = {
    setup: function(entity) {
        // Must be called before rendering
        this._entity = entity;
        this._options = entity.getStatOptions();
    },
    render: function(display) {
        var letters = 'abcdefghijklmnopqrstuvwxyz';
        display.drawText(0, 0, 'Choose a stat to increase:');

        // Iterate through each of our options
        for(var i=0; i<this._options.length; i++) {
            display.drawText(0, 2 + i,
                letters.substring(i, i+1) + ' - ' + this._options[i][0]);
        }

        // Render remaining stat points
        display.drawText(0, 4 + this._options.length,
                'Remaining points: ' + this._entity.getStatPoints());
    },
    handleInput: function(inputType, inputData) {
        if(inputType === 'keydown') {
            // If a letter was pressed, check if it matches to a valid option
            if(inputData.keyCode >= ROT.VK_A && inputData.keyCode <= ROT.VK_Z) {
                // Check if it maps to a valid item by subtracting 'a' from the character
                // to know what leteter of the alphabet we used
                var index = inputData.keyCode - ROT.VK_A;
                if(this._options[index]) {
                    // Call the stat increasing function
                    this._options[index][1].call(this, this._entity);
                    // Decrease stat points
                    this._entity.setStatPoints(this._entity.getStatPoints() - 1);
                    // If we have no stat points left, exit the screen, else refresh
                    if(this._entity.getStatPoints() == 0) {
                        Lootr.Screen.playScreen.setSubScreen(undefined);
                    } else {
                        Lootr.refresh();
                    }
                }
            }
        }
    }
};

// Define our winning screen
Lootr.Screen.winScreen = {
    enter: function() {    console.log("Entered win screen."); },
    exit: function() { console.log("Exited win screen."); },
    render: function(display) {
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            // Generate random background colors
            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);
            var background = ROT.Color.toRGB([r, g, b]);
            display.drawText(2, i + 1, "%b{" + background + "}You win!");
        }
    },
    handleInput: function(inputType, inputData) {
        // Nothing to do here      
    }
}

// Define our winning screen
Lootr.Screen.loseScreen = {
    enter: function() {    console.log("Entered lose screen."); },
    exit: function() { console.log("Exited lose screen."); },
    render: function(display) {
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            display.drawText(2, i + 1, "%b{red}You lose! :(");
        }
    },
    handleInput: function(inputType, inputData) {
        // Nothing to do here      
    }
}
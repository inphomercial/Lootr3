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
    _map: null,
    _player: null,
    _gameEnded: false,
    _subScreen: null,
    enter: function() {  

    	console.log("Entered play screen");

        var map = [];
        // Create a map based on our size parameters
        var mapWidth = 300;
        var mapHeight = 300;
        for (var x = 0; x < mapWidth; x++) {
            // Create the nested array for the y values
            map.push([]);
            // Add all the tiles
            for (var y = 0; y < mapHeight; y++) {
                map[x].push(Lootr.Tile.nullTile);
            }
        }

        // The Entire map layout generation is here --------
        // Setup the map generator
        var generator = new ROT.Map.Cellular(mapWidth, mapHeight);
        generator.randomize(0.5);
        var totalIterations = 3;
        
        // Iteratively smoothen the map
        for (var i = 0; i < totalIterations - 1; i++) {
            generator.create();
        }
        
        // Smoothen it one last time and then update our map
        generator.create(function(x,y,v) {
            if (v === 1) {
                if(Math.random() > .98) {
                    map[x][y] = Lootr.Tile.waterTile;    
                } else {
                    map[x][y] = Lootr.Tile.floorTile;    
                }                                
            } else {
                if(Math.random() > .90) {
                    map[x][y] = Lootr.Tile.wallGemTile;    
                } else {
                    map[x][y] = Lootr.Tile.wallTile;    
                }                
            }
        });
        // -------------------------------------

        // Create our player and set his position
        this._player = new Lootr.Entity(Lootr.TemplatePlayer);

        // Create our map from the tiles
        this._map = new Lootr.Map(map, this._player);

        // Star the games engine
        this._map.getEngine().start();
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

        // Make sure the x-axis doesn't go to the left of the left bound
        var topLeftX = Math.max(0, this._player.getX() - (screenWidth / 2));

        // Make sure we still have enough space to fit an entire Lootr screen
        topLeftX = Math.min(topLeftX, this._map.getWidth() - screenWidth);

        // Make sure the y-axis doesn't above the top bound
        var topLeftY = Math.max(0, this._player.getY() - (screenHeight / 2));

        // Make sure we still have enough space to fit an entire Lootr screen
        topLeftY = Math.min(topLeftY, this._map.getHeight() - screenHeight);

        // This object will track all visible map cells
        var visibleCells = {};

        var map = this._map;

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
                if (this._map.isExplored(x, y)) {
                    // Fetch the glyph for the tile and render it to the screen
                    var glyph = this._map.getTile(x, y);
                    var foreground = glyph.getForeground();

                    // If we are at a cell that is in the FOV, we need to see
                    // If there are items or entities
                    if(visibleCells[x + ',' + y]) {
                        // Check for items first since we want to draw entities over them
                        var items = this._map.getItemsAt(x, y);

                        // If we have items, render the last one
                        if(items) {
                            glyph = items[items.length -1];
                        }
                        
                        // If we have entities
                        if(this._map.getEntityAt(x, y)) {
                            glyph = this._map.getEntityAt(x, y);
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
        stats += vsprintf('HP: %d/%d ', [this._player.getHp(), this._player.getMaxHp()]);
        display.drawText(0, screenHeight, stats);

        // Draw player hunger stat
        var hungerState = this._player.getHungerState();
        display.drawText(screenWidth - hungerState.length, screenHeight, hungerState);
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
            if (inputData.keyCode === ROT.VK_RETURN) {
                Lootr.switchScreen(Lootr.Screen.winScreen);
            } else if (inputData.keyCode === ROT.VK_ESCAPE) {
                Lootr.switchScreen(Lootr.Screen.loseScreen);
            } else if (inputData.keyCode === ROT.VK_LEFT) {
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
            
            // Inventory Stuff
            } else if (inputData.keyCode === ROT.VK_I) {
                if(this._player.getItems().filter(function(x) {return x;}).length === 0) {
                    // If player has no items, send message, dont take turn
                    Lootr.sendMessage(this._player, 'You are not carrying anything.');
                    Lootr.refresh();
                } else {
                    // Show the inventory
                    Lootr.Screen.inventoryScreen.setup(this._player, this._player.getItems());
                    this.setSubScreen(Lootr.Screen.inventoryScreen);
                }
            } else if (inputData.keyCode === ROT.VK_D) {
                if(this._player.getItems().filter(function(x) {return x;}).length === 0) {
                    // if the player has no items, send a message and dont take a turn
                    Lootr.sendMessage(this._player, 'You have nothing to drop.');
                    Lootr.refresh();
                } else {
                    // Show the drop screen
                    Lootr.Screen.dropScreen.setup(this._player, this._player.getItems());
                    this.setSubScreen(Lootr.Screen.dropScreen);
                }
            } else if (inputData.keyCode === ROT.VK_COMMA) {
                var items = this._map.getItemsAt(this._player.getX(), this._player.getY());
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
            this._map.getEngine().unlock();
        }    
    },
    move: function(dX, dY) {
    	console.log("Trying to move");

    	var newX = this._player.getX() + dX;
    	var newY = this._player.getY() + dY;

    	// Try to move 
    	this._player.tryMove(newX, newY, this._map);
    },
    setGameEnded: function(gameEnded) {
        this._gameEnded = gameEnded;
    },
    setSubScreen: function(subScreen) {
        this._subScreen = subScreen;

        // Refresh screen on chaning the subscreen
        Lootr.refresh();
    }
}

Lootr.Screen.ItemListScreen = function(template) {
    // Setup based on the template
    this._caption = template['caption'];
    this._okFunction = template['ok'];

    // Whether the user can select items at all
    this._canSelectItem = template['canSelect'];

    // Whether the user can select multiple items
    this._canSelectMultipleItems = template['canSelectMultipleItems'];
}

Lootr.Screen.ItemListScreen.prototype.setup = function(player, items) {
    this._player = player;
    this._items = items;

    // Clean the set of selected indices
    this._selectedIndices = {};
}

Lootr.Screen.ItemListScreen.prototype.render = function(display) {
    var letters = 'abcdefghijklmnopqrstuvwxyz';

    // Render the caption to the top row
    display.drawText(0, 0, this._caption);

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

            // Render at the correct row and add 2
            display.drawText(0, 2 + row, letter + ' ' + selectionState + ' ' + this._items[i].describe());
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
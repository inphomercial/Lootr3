
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
        stats += vsprintf('HP: %d/%d L: %d XP: %d GOLD: %d' , [this._player.getHp(), 
                                                     this._player.getMaxHp(),
                                                     this._player.getLevel(),
                                                     this._player.getExperience(),
                                                     this._player.getGold()]);

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
                        // make grayinterpolate
                        var fc = ROT.Color.fromString(foreground);
                        var sc = ROT.Color.fromString('darkgray');
                        var c = ROT.Color.multiply(fc, sc);                                        
                        foreground = ROT.Color.toHex(c);

                        //foreground = '#282828';
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

            // Test out stuff
            } else if (inputData.keyCode === ROT.VK_SPACE) {
                

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

                // If on top of an item that is Edible try to eat it instaed of going to eat screen
                var items = this._player.getMap().getItemsAt(this._player.getX(), this._player.getY());
                if(items) {
                    if(items.length === 1 && items[0].hasComponent('Edible')) {
                        Lootr.sendMessage(this._player, 'You eat %s', [items[0].describeThe()]);
                        item.eat(this._player);
                        if(!item.hasRemainingConsumptions()) {
                            this._player.removeItem(key);
                        }
                    }
                }

                // show eat screen
                this.showItemSubScreen(Lootr.Screen.eatScreen, this._player.getItems(), 'You have nothing to eat.');
                return;

             } else if (inputData.keyCode === ROT.VK_Q) {
                // show quaff screen
                this.showItemSubScreen(Lootr.Screen.quaffScreen, this._player.getItems(), 'You have nothing to quaff.');
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
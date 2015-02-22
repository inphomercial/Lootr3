
// Define our playing screen
Lootr.Screen.playScreen = {
    _player: null,
    _gameEnded: false,
    _subScreen: null,
    enter: function() {

    	console.log("Entered play screen");

        // Create our player and set his position
        this._player = new Lootr.Entity(Lootr.TemplatePlayer);

        // Create our map from the tiles
        var map = [];
        //var map = new Lootr.Map.Cave(this._player);
        var map = new Lootr.Map.Overworld(this._player);

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

        // Render player stats
        this.renderStats(display);

        // Draw messages
        var messages = this._player.getMessages();
        var messageY = 21;
        for(var i=0; i<messages.length; i++) {
        	// Draw each message adding the number of lines        	
            display.drawText(5, messageY, '%c{white}%b{black}' + messages[i]);
            messageY++
        }

    },
    getScreenOffsets: function() {
        // Make sure the x-axis doesn't go to the left of the left bound
       // var topLeftX = Math.max(0, this._player.getX() - (Lootr.getScreenWidth() / 2));
        var topLeftX = Math.max(0, this._player.getX() - (Lootr._mapScreenWidth / 2));
        // Make sure we still have enough space to fit an entire Lootr screen
        topLeftX = Math.min(topLeftX, this._player.getMap().getWidth() - Lootr._mapScreenWidth);
        // topLeftX = Math.min(topLeftX, this._player.getMap().getWidth() - Lootr.getScreenWidth());

        // Make sure the y-axis doesn't above the top bound
        var topLeftY = Math.max(0, this._player.getY() - (Lootr._mapScreenHeight / 2));
        // var topLeftY = Math.max(0, this._player.getY() - (Lootr.getScreenHeight() / 2));

        // Make sure we still have enough space to fit an entire Lootr screen
        topLeftY = Math.min(topLeftY, this._player.getMap().getHeight() - Lootr._mapScreenHeight);
        // topLeftY = Math.min(topLeftY, this._player.getMap().getHeight() - Lootr.getScreenHeight());

        return {
            x: topLeftX,
            y: topLeftY
        };
    },
    renderStats: function(display) {
        var statsY = 1;

        // Draw Obtained Orbs
        var orbs = this._player.hasOrbs();
        display.drawText(101, statsY, "Orbs");
        if(orbs.red) {
            display.drawText(102, statsY + 2, "%c{red}O");    
        } else {
            display.drawText(102, statsY + 2, "%c{grey}o");    
        }
    
        if(orbs.yellow) {
            display.drawText(100, statsY + 3, "%c{yellow}O");    
        } else {
            display.drawText(100, statsY + 3, "%c{grey}o");    
        }
        
        if(orbs.green) {
            display.drawText(104, statsY + 3, "%c{green}O");    
        } else {
            display.drawText(104, statsY + 3, "%c{grey}o");    
        }

        if(orbs.blue) {
            display.drawText(102, statsY + 4, "%c{blue}O");    
        } else {
            display.drawText(102, statsY + 4, "%c{grey}o");
        }
        
        var name = '%c{#91AA9D}%b{black}';
        name += 'Name: %c{#CCB4B0}Inpho';
        display.drawText(82, statsY++, name);
        statsY++;

        var hp = '%c{#91AA9D}%b{black}';
        hp += 'HP: %c{#FCFFF5}' + this._player.getHp() + '/' + this._player.getMaxHp();
        //hp += vsprintf('HP: %d/%d', [this._player.getHp(), this._player.getMaxHp()]);
        display.drawText(82, statsY++, hp);

        var level = '%c{#91AA9D}%b{black}';
        //level += vsprintf('LEVEL: %d', [this._player.getLevel()]);
        level += 'LVL: %c{#FCFFF5}' + this._player.getLevel();
        display.drawText(82, statsY++, level);

        var xp = '%c{#91AA9D}%b{black}';
        xp += 'XP: %c{#FCFFF5}' + this._player.getExperience();
        //xp += vsprintf('XP: %d', [this._player.getExperience()]);
        display.drawText(82, statsY++, xp);

        var gold = '%c{#91AA9D}%b{black}';
        gold += 'GOLD: %c{#FCFFF5}' + this._player.getGold();
        display.drawText(82, statsY++, gold);

        var hungerState = '%c{#91AA9D}%b{black}';
        hungerState += 'HUNGER: %c{#FCFFF5}' + this._player.getHungerState();
        display.drawText(82, statsY++, hungerState);
        statsY++;

        var weap = '%c{#91AA9D}%b{black}';
        var w = this._player.getWeapon();
        if(w) {
             weap += 'Wielding: %c{#7E7F7A}' + w.getName();
             display.drawText(82, statsY++, weap);
         } else {
             weap += "Wielding: %c{#7E7F7A}none";
             display.drawText(82, statsY++, weap);
         }

        var wear = '%c{#91AA9D}%b{black}';
        var w = this._player.getArmor();
        if(w) {
             wear += 'Wearing: %c{#7E7F7A}' + w.getName();
             display.drawText(82, statsY++, wear);
         } else {
             wear += "Wearing: %c{#7E7F7A}none";
             display.drawText(82, statsY++, wear);
         }

        // Current Player status'
        statsY++;
        var status = "%c{yellow}%b{black}";
         if(this._player.hasComponent('Flight') && this._player.isFlying()) {    
            status += 'Flying ';            
         }
         if(this._player.hasComponent('Invisiblity') && this._player.isInvisible()) {            
            status += 'Invisible ';            
         }  
         if(this._player.hasComponent('PassThroughWalls')) {            
            status += 'Walls ';            
         }  

         // Draw the total status string
         display.drawText(82, statsY++, status);
    },
    renderTiles: function(display) {
        //var screenWidth = Lootr.getScreenWidth();
        //var screenHeight = Lootr.getScreenHeight();
        var screenWidth = Lootr._mapScreenWidth;
        var screenHeight = Lootr._mapScreenHeight;
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
                    // Fetch the tile and render it to the screen
                    var glyph = map.getTile(x, y);
                    var foreground = glyph.getForeground();

                    // If we are at a cell that is in the FOV, we need to see
                    // If there are items or entities
                    if(visibleCells[x + ',' + y]) {
                        // Check for items first since we want to draw entities over them
                        var items = map.getItemsAt(x, y);

                        // Sometimes getItemsAt can return 1 or more
                        if(items.length === 1) {
                            glyph = items[0];

                        // If we have items, render the last one
                        } else if (items.length > 1) {
                            glyph = items[items.length -1];
                        }

                        // If we have entities
                        if(map.getEntityAt(x, y)) {                            
                            
                            // We dont want to print any entity that is invisible, unless it's the player
                            var en = map.getEntityAt(x, y);
                            if(en.hasComponent('PlayerActor')) {
                                glyph = en;
                            } else if (en.hasComponent('Invisiblity')) {
                                if(!en.isInvisible()) {
                                    glyph = en;    
                                }                                
                            } else {
                                glyph = en;
                            }                     
                        }

                        // Update the foreground color based on our glphy changed
                        foreground = glyph.getForeground();
                    } else {
                        // Since the tile was previously explored but is not visible
                        // make grayinterpolate
                        var fc = ROT.Color.fromString(foreground);
                        var sc = ROT.Color.fromString('slategray');
                        var c = ROT.Color.multiply(fc, sc);
                        var d = ROT.Color.multiply(c, sc);
                        foreground = ROT.Color.toHex(d);

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

        // First thing to check is if we have all the orbs
        if(this._player.hasAllOrbs()) {
            Lootr.switchScreen(Lootr.Screen.winScreen);
        }

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

        /*if (inputType === 'mousemove') {
            var pos = Lootr.getMousePos(Lootr.getDisplay().getContainer(), inputData);
            console.log(this._player.getMap().getTile(pos.x, pos.y));

            //var tile = this._player.getMap().getTile(pos.x, pos.y);
            //tile.setBackground('pink');
            var display = Lootr.getDisplay();
            display.draw(pos.x, pos.y, " ", "#f00", '#009');

            console.log(inputData);

            console.log(this._player.getMap().getEntityAt(pos.x, pos.y));
            console.log(this._player.getMap().getItemsAt(pos.x, pos.y));
        };*/

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

                var fire = Lootr.EntityRepository.create('fire');
                this._player.getMap().addEntityAt(this._player.getX(), this._player.getY()+1, fire);
                Lootr.refresh();

                return;

            } else if (inputData.keyCode === ROT.VK_G) {
                
                if(this._player.hasComponent('Invisiblity')) {
                    if(this._player.isInvisible()) {
                        this._player.turnVisible();
                    } else {
                        this._player.turnInvisible();
                    }
                }
                
                Lootr.refresh();

                return;

            // Test out stuff
            } else if (inputData.keyCode === ROT.VK_F) {
                
                if(this._player.hasComponent('Flight')) {
                    if(this._player.isFlying()) {
                        this._player.land();
                    } else {
                        this._player.fly();
                    }
                }
                
                Lootr.refresh();

                return;

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

             // Rest a turn
             } else if (inputData.keyCode === ROT.VK_PERIOD) {
                // Skip a turn
                Lootr.sendMessage(this._player, 'You rest a turn.');

                // Unlock the engine
                this._player.getMap().getEngine().unlock();
                return;

             } else if (inputData.keyCode === ROT.VK_Q) {
                // show quaff screen
                this.showItemSubScreen(Lootr.Screen.quaffScreen, this._player.getItems(), 'You have nothing to quaff.');
                return;

            } else if (inputData.keyCode === ROT.VK_X) {
                // show the examine screen
                this.showItemSubScreen(Lootr.Screen.examineScreen, this._player.getItems(), 'You have nothing to examine.');
                return;

            // Show the put on screen (wear)
            } else if (inputData.keyCode === ROT.VK_P) {
                // Show the wear screen
                this.showItemSubScreen(Lootr.Screen.wearScreen, this._player.getItems(), 'You have nothing to wear.');
                return;

            } else if (inputData.keyCode === ROT.VK_W) {
                // Show the wield screen
                this.showItemSubScreen(Lootr.Screen.wieldScreen, this._player.getItems(), 'You have nothing to wield.');
                return;

            /**
             * Attempt to pick up items that you are standing on
             */
            } else if (inputData.keyCode === ROT.VK_COMMA) {
                
                var items = this._player.getMap().getItemsAt(this._player.getX(), this._player.getY());
               
                // If there are no items, show a message
                if(!items) {                    
                    Lootr.sendMessage(this._player, 'There is nothing here to pickup.');
                    Lootr.refresh();
                    return;
                } 

                // If only one item
                if(items.length === 1) {
                    var item = items[0];
                    if(this._player.pickupItem(item)) {
                        Lootr.sendMessage(this._player, 'You pick up %s.', [item.describeA()]);
                         
                        item.raiseEvent("pickup");
                    } else {
                        Lootr.sendMessage(this._player, 'Your inventory is full. Nothing was picked up.');
                    }
    
                // Multiple items in current tile
                } else {
                    // Show the pickup screen if there are many items
                    Lootr.Screen.pickupScreen.setup(this._player, items);
                    this.setSubScreen(Lootr.Screen.pickupScreen);
                    return;
                }

            /** 
             * Not a key that is currenly set for an action
             */
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

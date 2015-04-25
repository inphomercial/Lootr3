
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

        // Render the tiles
        this.renderTiles(display);

        // Render player stats
        Lootr.UI.RenderStatsGroup(this._player, 12, 1, display);

        // Render player orbs
        Lootr.UI.RenderOrbsGroup(this._player, 12, 1, display);

        // Render border
        Lootr.UI.RenderGameBorder(display);

        // Draw messages
        Lootr.UI.RenderGameMessages(this._player, 5, 23, display);
        // var messages = this._player.getMessages();
        // var messageY = 23;
        // for(var i=0; i<messages.length; i++) {
        //     // Draw each message adding the number of lines
        //     display.drawText(5, messageY, '%c{white}%b{black}' + messages[i]);
        //     messageY++
        // }

    },

    getScreenOffsets: function() {
        // Make sure the x-axis doesn't go to the left of the left bound
        var topLeftX = Math.max(0, this._player.getX() - (Lootr._mapScreenWidth / 2));

        // Make sure we still have enough space to fit an entire Lootr screen
        topLeftX = Math.min(topLeftX, this._player.getMap().getWidth() - Lootr._mapScreenWidth);

        // Make sure the y-axis doesn't above the top bound
        var topLeftY = Math.max(0, this._player.getY() - (Lootr._mapScreenHeight / 2));

        // Make sure we still have enough space to fit an entire Lootr screen
        topLeftY = Math.min(topLeftY, this._player.getMap().getHeight() - Lootr._mapScreenHeight);

        return {
            x: topLeftX,
            y: topLeftY
        };
    },

    renderTiles: function(display) {
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
            if(Lootr.isInputTypeKeyDown(inputType) && inputData.keyCode === ROT.VK_RETURN) {

                // Setup the gain stat screen and show it
                Lootr.Screen.loseScreen.setup(this._player);
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

        if(Lootr.isInputTypeKeyDown(inputType)) {

            // Any key press
            switch(inputData.keyCode) {
                case ROT.VK_LEFT:
                    this.doMove(-1, 0);
                    break;

                case ROT.VK_RIGHT:
                    this.doMove(1, 0);
                    break;

                case ROT.VK_UP:
                    this.doMove(0, -1);
                    break;

                case ROT.VK_DOWN:
                    this.doMove(0, 1);
                    break;

                // Testing stuff out here
                case ROT.VK_SPACE:
                    this._player.addComponent(Lootr.EntityComponents.Flight);
                    // var fire = Lootr.EntityRepository.create('fire');
                    // this._player.getMap().addEntityAt(this._player.getX(), this._player.getY()+1, fire);
                    break;

                // Testing eating food
                case ROT.VK_U:
                    this._player.modifyFullnessBy(5);
                    console.log(this._player._fullness);
                    break;

                // Testing raising max fullness
                case ROT.VK_Y:
                    this._player._maxFullness = this._player._maxFullness + 5;
                    console.log(this._player._maxFullness);
                    break;

                // Testing invis
                case ROT.VK_G:
                    if(this._player.hasComponent('Invisiblity')) {
                        if(this._player.isInvisible()) {
                            this._player.turnVisible();
                        } else {
                            this._player.turnInvisible();
                        }
                    }

                    break;

                // Testing manu flying
                case ROT.VK_F:
                    if(this._player.hasComponent('Flight')) {
                        if(this._player.isFlying()) {
                            this._player.land();
                        } else {
                            this._player.fly();
                        }
                    }

                    break;

                case ROT.VK_H:
                    // Show help screen
                    this.setSubScreen(Lootr.Screen.helpScreen);
                    break;

                case ROT.VK_L:
                    // Setup the look screen.
                    var offsets = this.getScreenOffsets();
                    Lootr.Screen.lookScreen.setup(this._player, this._player.getX(), this._player.getY(), offsets.x, offsets.y);
                    this.setSubScreen(Lootr.Screen.lookScreen);
                    break;

                case ROT.VK_I:
                    // show inventory screen
                    this.showItemSubScreen(Lootr.Screen.inventoryScreen, this._player.getItems(), 'You are not carrying anything');
                    break;

                case ROT.VK_S:
                    Lootr.Screen.statScreen.setup(this._player);
                    this.setSubScreen(Lootr.Screen.statScreen);
                    break;

                case ROT.VK_D:
                    // Show Drop screen
                    this.showItemSubScreen(Lootr.Screen.dropScreen, this._player.getItems(), 'You have nothing to drop.');
                    break;

                case ROT.VK_E:
                    // If on top of an item that is Edible try to eat it instaed of going to eat screen
                    var items = this._player.getMap().getItemsAt(this._player.getX(), this._player.getY());
                    if(items) {
                        if(items.length === 1 && items[0].hasComponent('Edible')) {
                            var item = items[0];
                            Lootr.sendMessage(this._player, 'You eat %s', [item.describeThe()]);
                            item.eat(this._player);
                            if(!item.hasRemainingConsumptions()) {
                                this._player.removeItem(key);
                                break;
                            }
                        }
                    }

                    // show eat screen
                    this.showItemSubScreen(Lootr.Screen.eatScreen, this._player.getItems(), 'You have nothing to eat.');
                    break;

                case ROT.VK_PERIOD:
                    // Skip a turn
                    Lootr.sendMessage(this._player, 'You rest a turn.');
                    break;

                case ROT.VK_Q:
                    // show quaff screen
                    this.showItemSubScreen(Lootr.Screen.quaffScreen, this._player.getItems(), 'You have nothing to quaff.');
                    break;

                case ROT.VK_X:
                    // show the examine screen
                    this.showItemSubScreen(Lootr.Screen.examineScreen, this._player.getItems(), 'You have nothing to examine.');
                    break;

                case ROT.VK_P:
                    // Show the wear screen
                    this.showItemSubScreen(Lootr.Screen.wearScreen, this._player.getItems(), 'You have nothing to wear.');
                    return;

                case ROT.VK_W:
                    // Show the wield screen
                    this.showItemSubScreen(Lootr.Screen.wieldScreen, this._player.getItems(), 'You have nothing to wield.');
                    break;

                case ROT.VK_COMMA:
                    var items = this._player.getMap().getItemsAt(this._player.getX(), this._player.getY());
                    console.log(items);
                    // If there are no items, show a message
                    if(!items) {
                        Lootr.sendMessage(this._player, 'There is nothing here to pickup.');
                        break;
                    }

                    // If only one item
                    if(items.length === 1) {
                        this._player.pickupItem(items[0]);
                        break;

                    // Multiple items in current tile
                    } else {
                        // Show the pickup screen if there are many items
                        Lootr.Screen.pickupScreen.setup(this._player, items);
                        this.setSubScreen(Lootr.Screen.pickupScreen);
                        break;
                    }

                default:
                    // not a valid key
                    Lootr.sendMessage(this._player, 'Not a valid key..');
                    Lootr.refresh();
                    break;
            }
        }

        // Have items act if they have the act method
        // this._player.getMap().getItemsToAct();

        Lootr.refresh();

        // Unlock the engine
        this._player.getMap().getEngine().unlock();
    },

    doMove: function(dX, dY) {
        console.log("Trying to move");

        var newX = this._player.getX() + dX;
        var newY = this._player.getY() + dY;

        // Try to move
        this._player.tryMove(newX, newY);
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

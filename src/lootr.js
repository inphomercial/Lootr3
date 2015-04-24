var Lootr =  {
    _display: null,
    _currentScreen: null,
    _screenWidth: 125,
    _screenHeight: 35,
    _mapScreenWidth: 90,
    _mapScreenHeight: 20,
    Screen: {},

    ITEM_SLOTS: {
        HAND: 'hand',
        HEAD: 'head',
        BODY: 'body',
        FINGER: 'finger',
        FEET: 'feet'
    },

    init: function() {
        // Any necessary initialization will go here.
        this._display = new ROT.Display({width: this._screenWidth,
                                         height: this._screenHeight + 1, fontSize: 18});

        // Create a helper function for binding to an event
        // and making it send it to the screen
        var lootr = this; // So that we don't lose this
        var bindEventToScreen = function(event) {
            window.addEventListener(event, function(e) {
                // When an event is received, send it to the
                // screen if there is one
                if (lootr._currentScreen !== null) {
                    // Send the event type and data to the screen
                    lootr._currentScreen.handleInput(event, e);
                }
            });
        }

        // Bind keyboard input events
        bindEventToScreen('keydown');
        //bindEventToScreen('mousemove');
        //bindEventToScreen('keyup');
        //bindEventToScreen('keypress');
    },
    refresh: function() {
        // Clear the screen
        this._display.clear();

        // Render the screen
        this._currentScreen.render(this._display);
    },
    getDisplay: function() {
        return this._display;
    },
    getScreenWidth: function() {
    return this._screenWidth;
    },
    getScreenHeight: function() {
        return this._screenHeight;
    },
    switchScreen: function(screen) {
        // If we had a screen before, notify it that we exited
        if (this._currentScreen !== null) {
            this._currentScreen.exit();
        }
        // Clear the display
        this.getDisplay().clear();

        // Update our current screen, notify it we entered
        // and then render it
        this._currentScreen = screen;
        if (!this._currentScreen !== null) {
            this._currentScreen.enter();
            this.refresh();
        }
    },
    sendMessage: function(recipient, message, args) {
        // make sure the recip can get messages
        // before doing anything
        if(recipient.hasComponent('MessageRecipient')) {
            // If args were passed, then we format the message else
            // just pass the message
            if(args) {
                message = vsprintf(message, args);
            }

            // Send message to target
            recipient.receiveMessage(message);
        }
    },
    sendMessageNearby: function(map, centerX, centerY, message, args) {
        // If args passed, format
        if(args) {
            var message = vsprintf(message, args);
        }

        // Get the nearby entities
        var entities = map.getEntitiesWithinRadius(centerX, centerY, 5);

        // Iterate through nearby entities, sending the message if they can recieve it
        for(var i=0; i<entities.length; i++) {
            if(entities[i].hasComponent('MessageRecipient')) {
                entities[i].receiveMessage(message);
            }
        }
    }
}

window.onload = function() {
    // Check if rot.js can work on this browser
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {
        // Initialize lootr
        Lootr.init();
        // Add the container to our HTML page
        document.body.appendChild(Lootr.getDisplay().getContainer());
        // Load the start screen
        Lootr.switchScreen(Lootr.Screen.startScreen);
    }
}

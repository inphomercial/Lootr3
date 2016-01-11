
// Gain stat Screen
Lootr.Screen.gainStatScreen = {
    setup: function(entity) {
        this._display = null;
        this._entity = entity;
        this._options = this._entity.getStatOptions();
    },
    render: function(display) {
        this._display = display;

        // Render our Game Border
        Lootr.UI.RenderGameBorder(display);

        // Render Player States
        Lootr.UI.RenderStatsGroup(this._entity, 12, 1, display);

        // Render Player Orbs
        Lootr.UI.RenderOrbsGroup(this._entity, 12, 1, display);

        display.drawText(3, 2, 'Choose a stat to increase:');

        this._renderRemainingStatOptions();
        this._renderRemainingStatPoints();

    },
    handleInput: function(inputType, inputData) {
        if(Lootr.isInputTypeKeyDown(inputType)) {
            // If a letter was pressed, check if it matches to a valid option
            if(inputData.keyCode >= ROT.VK_A && inputData.keyCode <= ROT.VK_Z) {
                // Check if it maps to a valid item by subtracting 'a' from the character
                // to know what leteter of the alphabet we used
                var index = inputData.keyCode - ROT.VK_A;
                if(this._options[index]) {
                    // Call the stat increasing function
                    this._options[index][1].call(this._entity);

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
    },
    _renderRemainingStatPoints: function() {
        this._display.drawText(3, 5 + this._options.length,
                'Remaining points: ' + this._entity.getStatPoints());
    },
    _renderRemainingStatOptions: function() {
        var letters = 'abcdefghijklmnopqrstuvwxyz';

        for(var i=0; i<this._options.length; i++) {
            this._display.drawText(3, 4 + i,
                letters.substring(i, i+1) + ' - ' + this._options[i][0]);
        }
    }
};

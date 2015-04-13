
// Stats Screen
Lootr.Screen.statScreen = {
    setup: function(player) {
        this._display = null;
        this._player = player;
    },
    enter: function() { console.log("Entered stats screen."); },
    exit: function() { console.log("Exited stats screen."); },
    render: function(display) {
        this._display = display;

        display.drawText(0, 0, this._player.getName() + ' Stat Screen');

        Lootr.UI.HungerDisplay.init(this._player, 10, 10, this._display);

        // this._renderRemainingStatOptions();
        // this._renderRemainingStatPoints();

    },
    handleInput: function(inputType, inputData) {
        if(Lootr.isInputTypeKeyDown(inputType)) {
            if (inputData.keyCode === ROT.VK_ESCAPE) {
                Lootr.switchScreen(Lootr.Screen.playScreen);
            }
        }
    }
};
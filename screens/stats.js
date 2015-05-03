
// Stats Screen
Lootr.Screen.statScreen = {
    setup: function(player) {
        this._display = null;
        this._player = player;
    },
    enter: function() { console.log("Entered stats screen."); },
    exit: function() { console.log("Exited stats screen."); },
    render: function(display) {
        Lootr.UI.RenderGameBorder(display);

        display.drawText(35, 2, this._player.getName() + ' Stats Screen');

        Lootr.UI.RenderStatsGroup(this._player, -77, 4, display);
    },
    handleInput: function(inputType, inputData) {
        if (Lootr.isInputTypeKeyDown(inputType) && Lootr.isInputKey(inputData, ROT.VK_ESCAPE)) {
            Lootr.Screen.playScreen.setSubScreen(null);
        }
    }
};
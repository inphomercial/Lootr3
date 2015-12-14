
// Stats Screen
Lootr.Screen.statScreen = {
    setup: function(player) {
        this._display = null;
        this._player = player;
    },
    enter: function() { console.log("Entered stats screen."); },
    exit: function() { console.log("Exited stats screen."); },
    render: function(display) {

        // Game Border Area
        Lootr.UI.RenderGameBorder(display);

        // Render Player States
        Lootr.UI.RenderStatsGroup(this._player, 12, 1, display);

        // Render Player Orbs
        Lootr.UI.RenderOrbsGroup(this._player, 12, 1, display);

        var y = 3,
            text = "%c{lightblue}" + this._player.getNameUpper() + ' Stats Screen';

        display.drawText(Lootr.getMapScreenMiddle(text, 13), y, text);
    },
    handleInput: function(inputType, inputData) {
        if (Lootr.isInputTypeKeyDown(inputType) && Lootr.isInputKey(inputData, ROT.VK_ESCAPE)) {
            Lootr.Screen.playScreen.setSubScreen(null);
        }
    }
};

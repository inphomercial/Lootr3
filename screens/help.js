
// Define our help screen
Lootr.Screen.helpScreen = {
    setup: function(player) {
        this._display = null;
        this._player = player;
    },
    enter: function() { console.log("Entered help screen."); },
    exit: function() { console.log("Exited help screen."); },
    render: function(display) {
        // Game Border Area
        Lootr.UI.RenderGameBorder(display);

        // Render Player Stats
        Lootr.UI.RenderStatsGroup(this._player, 12, 1, display);

        // Render Player Orbs
        Lootr.UI.RenderOrbsGroup(this._player, 12, 1, display);

        // Render Messages
        Lootr.UI.RenderGameMessages(this._player, 5, 32, display);

        var y = 2,
            x = 3,
            text = '%c{yellow}+== Help Screen ==+';

        display.drawText(Lootr.getMapScreenMiddle(text, 10), y++, text);
        y += 3;
        display.drawText(x, y++, '%c{lightskyblue}Comands');
        display.drawText(x, y++, '[,] to pick up items');
        display.drawText(x, y++, '[.] to rest a turn');
        display.drawText(x, y++, '[d] to drop items');
        display.drawText(x, y++, '[e] to eat items');
        display.drawText(x, y++, '[w] to wield items');
        display.drawText(x, y++, '[space] to cast currently selected spell');
        display.drawText(x, y++, '[b] to cycle selected spell');
        display.drawText(x, y++, '[p] to put on items');
        display.drawText(x, y++, '[x] to examine items');
        display.drawText(x, y++, '[l] to look around you');
        display.drawText(x, y++, '[?] to show this help screen');
    },
    handleInput: function(inputType, inputData) {
        Lootr.Screen.playScreen.setSubScreen(null);
    }
};

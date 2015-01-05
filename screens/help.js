
// Define our help screen
Lootr.Screen.helpScreen = {
    render: function(display) {
        var text = 'Lootr help';
        var border = '-------------';
        var y = 0;
        display.drawText(Lootr.getScreenWidth() / 2 - text.length / 2, y++, text);
        display.drawText(Lootr.getScreenWidth() / 2 - text.length / 2, y++, border);
        display.drawText(0, y++, 'asdf');
        display.drawText(0, y++, 'asdf');
        y += 3;
        display.drawText(0, y++, '[,] to pick up items');
        display.drawText(0, y++, '[d] to drop items');
        display.drawText(0, y++, '[e] to eat items');
        display.drawText(0, y++, '[w] to wield items');
        display.drawText(0, y++, '[W] to wield items');
        display.drawText(0, y++, '[x] to examine items');
        display.drawText(0, y++, '[l] to look around you');
        display.drawText(0, y++, '[?] to show this help screen');
        y += 3;
        text = '--- press any key to continue ---';
        display.drawText(Lootr.getScreenWidth() / 2 - text.length / 2, y++, text);
    },
    handleInput: function(inputType, inputData) {
        Lootr.Screen.playScreen.setSubScreen(null);
    }
};
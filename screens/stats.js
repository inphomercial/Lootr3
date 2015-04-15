
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

        display.drawText(5, 2, this._player.getName() + ' Stat Screen');

        Lootr.UI.NameDisplay.init(this._player, 5, 5, this._display);
        Lootr.UI.HealthDisplay.init(this._player, 5, 7, this._display);
        Lootr.UI.LevelDisplay.init(this._player, 5, 8, this._display);
        Lootr.UI.ExperienceDisplay.init(this._player, 5, 9, this._display);

        Lootr.UI.StatusDisplay.init(this._player, 5, 11, display);

        Lootr.UI.WieldingDisplay.init(this._player, 5, 13, display);
        Lootr.UI.WearingDisplay.init(this._player, 5, 14, display);
    },
    handleInput: function(inputType, inputData) {
        if(Lootr.isInputTypeKeyDown(inputType) && Lootr.isInputDataKeyCode(inputData, ROT.VK_ESCAPE)) {            
            Lootr.switchScreen(Lootr.Screen.playScreen);            
        }
    }
};
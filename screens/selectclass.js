
// Select Class Screen
Lootr.Screen.classSelectScreen = {

    index: 0,

    enter: function() { console.log("Entered select class screen."); },
    exit: function() { console.log("Exited select class screen."); },
    render: function(display) {

        // Render our prompt to the screen
        display.drawText((display._options.width / 2) - 14, 10, "                        %c{yellow}Select Race // Class %c{white}   ");
        display.drawText((display._options.width / 2) - 14, 12, "                    Press [Enter] to start                 ");

        if(this.index == 0) {
            display.drawText((display._options.width / 2) - 14, 14, "                  [x]  Wizard                 ");
        } else {
            display.drawText((display._options.width / 2) - 14, 14, "                  [ ]  Wizard                 ");
        }

        if(this.index == 1) {
            display.drawText((display._options.width / 2) - 14, 15, "                  [x]  Warrior                 ");
        } else {
            display.drawText((display._options.width / 2) - 14, 15, "                  [ ]  Warrior                 ");
        }

        if(this.index == 2) {
            display.drawText((display._options.width / 2) - 14, 15, "                  [x]  Assassin                 ");
        } else {
            display.drawText((display._options.width / 2) - 14, 15, "                  [ ]  Assassin                 ");
        }
    },
    handleInput: function(inputType, inputData) {
        // When [Enter] is pressed, go to the play screen
        if (inputType === 'keydown') {

            if (inputData.keyCode === ROT.VK_DOWN) {
                if(this.index == 0) {
                    this.index++;
                    Lootr.refresh();
                }
            }

            if (inputData.keyCode === ROT.VK_UP) {
                if(this.index == 1) {
                    this.index--;
                    Lootr.refresh();
                }
            }
            if (inputData.keyCode === ROT.VK_RETURN) {
                var race = "";

                if (this.index == 0) race = "Wizard";
                if (this.index == 1) race = "Warrior";
                if (this.index == 2) race = "Assassin";

                Lootr.Screen.playScreen.setup(race);
                Lootr.switchScreen(Lootr.Screen.playScreen);
            }
        }
    }
}
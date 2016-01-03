
// Define our initial start screen
Lootr.Screen.startScreen = {

    index: 0,

    enter: function() { console.log("Entered start screen."); },
    exit: function() { console.log("Exited start screen."); },
    render: function(display) {

        var width = display._options.width / 2;

        // Render our prompt to the screen
        display.drawText((width) - 14, 10, "                        %c{yellow}L O O T r %c{white}   2014-2016             ");
        display.drawText((width) - 14, 12, "                    Press [Enter] to continue                 ");

        if(this.index == 0) {
            display.drawText((width) - 14, 14, "                  [x]  Start New Game                 ");
        } else {
            display.drawText((width) - 14, 14, "                  [ ]  Start New Game                 ");
        }

        if(this.index == 1) {
            display.drawText((width) - 14, 15, "                  [x]  Continue Game                 ");
        } else {
            display.drawText((width) - 14, 15, "                  [ ]  Continue Game                 ");
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
                Lootr.switchScreen(Lootr.Screen.classSelectScreen);
            }
        }
    }
}

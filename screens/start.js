
// Define our initial start screen
Lootr.Screen.startScreen = {
    enter: function() { console.log("Entered start screen."); },
    exit: function() { console.log("Exited start screen."); },
    render: function(display) {
        // Render our prompt to the screen
        console.log(display);

        display.drawText((display._options.width / 2) - 14, 10, "                        L O O T r 2014                     ");
        display.drawText((display._options.width / 2) - 14, 11, "                    Press [Enter] to start                 ");
    },
    handleInput: function(inputType, inputData) {
        // When [Enter] is pressed, go to the play screen
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.VK_RETURN) {
                Lootr.switchScreen(Lootr.Screen.playScreen);
            }
        }
    }
}
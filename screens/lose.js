
// Define our lose screen
Lootr.Screen.loseScreen = {
    setup: function(player) {
        this.player = player;
    },
    enter: function() {    console.log("Entered lose screen."); },
    exit: function() { console.log("Exited lose screen."); },
    render: function(display) {

        var screenWidth = Lootr.getScreenWidth();
        var screenWidthQuad = Math.round(screenWidth / 4);
        var screenHeight = Lootr.getScreenHeight();
        var startPos = screenWidthQuad + 5;

        var gameOver = "Game Over!";

        // Render our border
        for (var x=0; x<screenWidth; x++) {
            for(var y=0; y<screenHeight; y++) {
                if(y == 5 && (x > screenWidthQuad && x < screenWidthQuad * 3)) {
                   display.drawText(x, y, "%b{red}%c{red}x");
                }
                if(y == 28 && (x > screenWidthQuad && x < screenWidthQuad * 3)) {
                    display.drawText(x, y, "%b{red}%c{red}x");
                }

                if(x == screenWidthQuad) {
                    display.drawText(x, y, "%b{red}%c{red}x");
                }

                if(x == screenWidthQuad * 3) {
                    display.drawText(x, y, "%b{red}%c{red}x");
                }
            }
        }

        // Render our text
        display.drawText((screenWidth / 2) - 4, 3, "Game Over");

        display.drawText(startPos, 7, this.player.getName());
        var items = this.player.getItems();
        var yRow = 7;
        if(items[0] != null) {
            for(var x=0; x<items.length; x++) {
                display.drawText(startPos, yRow++, items[x].describe());
            }
        }
    },
    handleInput: function(inputType, inputData) {
        // Initialize lootr
//        Lootr.init();
        // Add the container to our HTML page
 //       document.body.appendChild(Lootr.getDisplay().getContainer());
        // Load the start screen
  //      Lootr.switchScreen(Lootr.Screen.startScreen);
    }
}
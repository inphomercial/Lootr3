
// Define our lose screen
Lootr.Screen.loseScreen = {
    setup: function(player) {
        this.player = player;
    },
    enter: function() { console.log("Entered lose screen."); },
    exit: function() { console.log("Exited lose screen."); },
    renderBorder: function(display) {

        var screenWidthQuad = Math.round(Lootr.getScreenWidth() / 4);

         // Render our border
        for (var x=0; x<Lootr.getScreenWidth(); x++) {
            for(var y=0; y<Lootr.getScreenHeight(); y++) {

                //display.drawText(x, y, "%b{black}%c{black}.");

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
    },
    render: function(display) {

        var screenWidthQuad = Math.round(Lootr.getScreenWidth() / 4);
        var screenHeight = Lootr.getScreenHeight();
        var startPos = screenWidthQuad + 5;

        this.renderBorder(display);

        // Render our text
        display.drawText((Lootr.getScreenWidth() / 2) - 4, 3, "Game Over");
        display.drawText(startPos, 7, this.player.getName());

        display.drawText(startPos, 9, "Equipment");
        
        var items = this.player.getItems();
        var yRow = 10;
        if(items[0] != null) {
            for(var x=0; x<items.length; x++) {
                display.drawText(startPos, yRow++, items[x].describe());
            }
        }

        //Lootr.Screen.playScreen.renderStats(display);
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
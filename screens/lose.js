
// Define our lose screen
Lootr.Screen.loseScreen = {
    enter: function() {    console.log("Entered lose screen."); },
    exit: function() { console.log("Exited lose screen."); },
    render: function(display) {
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            display.drawText(2, i + 1, "%b{red}You lose! :(");
        }
    },
    handleInput: function(inputType, inputData) {
        Lootr.refresh();

        // Initialize lootr
        Lootr.init();
        // Add the container to our HTML page
        document.body.appendChild(Lootr.getDisplay().getContainer());
        // Load the start screen
        Lootr.switchScreen(Lootr.Screen.startScreen);
    }
}
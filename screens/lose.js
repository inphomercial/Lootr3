
// Define our lose screen
Lootr.Screen.loseScreen = {
    setup: function(player) {
        this.player = player;
        this.display = null;
    },
    enter: function() { console.log("Entered lose screen."); },
    exit: function() { console.log("Exited lose screen."); },
    render: function(display) {
        this.display = display;

        this._renderBorder();

        display.drawText((Lootr.getScreenWidth() / 2) - 4, 3, "Game Over");
        display.drawText(this._getStartPos(), 7, this.player.getName());

        display.drawText(this._getStartPos(), 9, "[ Equipment ]");
        this._renderItems();

        Lootr.UI.HighScoreDisplay(this._getStartPos(), 20, this.display);

        //Lootr.Screen.playScreen.renderStats(display);
    },
    handleInput: function(inputType, inputData) {
        //header("/");
        // Initialize lootr
        //        Lootr.init();
        // Add the container to our HTML page
        //       document.body.appendChild(Lootr.getDisplay().getContainer());
        // Load the start screen
        //      Lootr.switchScreen(Lootr.Screen.startScreen);
    },
    _renderBorder: function() {
        var screenWidthQuad = this._getScreenPositionQuarter();

        for (var x=0; x<Lootr.getScreenWidth(); x++) {
            for(var y=0; y<Lootr.getScreenHeight(); y++) {

                if(y == 5 && (x > screenWidthQuad && x < screenWidthQuad * 3)) {
                   this.display.drawText(x, y, "%b{red}%c{red}x");
                }
                if(y == 28 && (x > screenWidthQuad && x < screenWidthQuad * 3)) {
                    this.display.drawText(x, y, "%b{red}%c{red}x");
                }

                if(x == screenWidthQuad) {
                    this.display.drawText(x, y, "%b{red}%c{red}x");
                }

                if(x == screenWidthQuad * 3) {
                    this.display.drawText(x, y, "%b{red}%c{red}x");
                }
            }
        }
    },
    _renderItems: function() {
        var items = this.player.getItems();
        var yRow = 11;

        if(items[0] != null) {
            for(var x=0; x<items.length; x++) {
                this.display.drawText(
                    this._getStartPos(),
                    yRow++,
                    this._renderItemRow(items[x]))
            }
        }
    },
    _renderItemRow: function(item) {
        return this._renderItemChar(item) + " " + this._renderItemDesc(item);
    },
    _renderItemChar: function(item) {
        return "%b{" + item.getBackground() + "}%c{" + item.getForeground() + "}" + item.getChar();
    },
    _renderItemDesc: function(item) {
        return "%b{black}%c{white}- " + item.describeA();
    },
    _getScreenPositionQuarter: function() {
        return Math.round(Lootr.getScreenWidth() / 4);
    },
    _getStartPos: function() {
        return this._getScreenPositionQuarter() + 5;
    }
}
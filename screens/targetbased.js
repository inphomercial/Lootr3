
Lootr.Screen.TargetBasedScreen = function(template) {
    var template = template || {};

    // By default, our ok return does nothing and does not consume a turn
    this._okFunction = template['okFunction'] || function(x, y) {
        return false;
    };

    // The default caption function simply returns an empty string
    this._captionFunction = template['captionFunction'] || function(x, y) {
        return '';
    }
};

Lootr.Screen.TargetBasedScreen.prototype.setup = function(player, startX, startY, offsetX, offsetY, color, visible_char, item) {
    this._player = player;
    this._item = item || null;
    this._color = color || 'magenta';
    this._visible_char = visible_char || '*';

    // store original pos, subtract the offset to make life easy so we
    // dont alwayshave to remove it
    this._startX = startX - offsetX;
    this._startY = startY - offsetY;

    // Store current cursor position
    this._cursorX = this._startX;
    this._cursorY = this._startY;

    // Store map offsets
    this._offsetX = offsetX;
    this._offsetY = offsetY;

    // Cache the FOV
    var visibleCells = {};
    this._player.getMap()
        .getFov(this._player)
        .compute(this._player.getX(), this._player.getY(),
        this._player._components.Sight.getSightRadius(),
        function(x, y, radius, visibility) {
            visibleCells[x + ',' + y] = true;
        });

    this._visibleCells = visibleCells;
};

Lootr.Screen.TargetBasedScreen.prototype.render = function(display) {
    Lootr.Screen.playScreen.renderTiles.call(Lootr.Screen.playScreen, display);

    // Draw a line from the start to the cursor
    var points = Lootr.Geometry.getLine(this._startX, this._startY, this._cursorX, this._cursorY);

    // Render the screen border
    Lootr.UI.RenderGameBorder(display);

    // Render player stats
    Lootr.UI.RenderStatsGroup(this._player, 12, 1, display);

    // Render player orbs
    Lootr.UI.RenderOrbsGroup(this._player, 12, 1, display);

    // Render stars along the line
    var l = points.length;
    for (var i = 0; i < l; i++) {
        display.drawText(points[i].x, points[i].y, '%c{' + this._color + '}' + this._visible_char);
    }

    // Render the caption at the botton
    display.drawText(0, Lootr.getScreenHeight() - 1,
        this._captionFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY));
};

Lootr.Screen.TargetBasedScreen.prototype.handleInput = function(inputType, inputData) {
    // Move the cursor
    if (inputType == 'keydown') {
        if (inputData.keyCode === ROT.VK_LEFT) {
            this.moveCursor(-1, 0);
        } else if (inputData.keyCode === ROT.VK_RIGHT) {
            this.moveCursor(1, 0);
        } else if (inputData.keyCode === ROT.VK_UP) {
            this.moveCursor(0, -1);
        } else if (inputData.keyCode === ROT.VK_DOWN) {
            this.moveCursor(0, 1);
        } else if (inputData.keyCode === ROT.VK_ESCAPE) {
            Lootr.Screen.playScreen.setSubScreen(undefined);
        } else if (inputData.keyCode === ROT.VK_RETURN) {
            this.executeOkFunction();
        }
    }
    Lootr.refresh();
};

Lootr.Screen.TargetBasedScreen.prototype.moveCursor = function(dx, dy) {
    // Make sure we stay within bounds.
    this._cursorX = Math.max(0, Math.min(this._cursorX + dx, Lootr.getScreenWidth()));
    // We have to save the last line for the caption.
    this._cursorY = Math.max(0, Math.min(this._cursorY + dy, Lootr.getScreenHeight() - 1));
};

Lootr.Screen.TargetBasedScreen.prototype.executeOkFunction = function() {
    // Switch back to the play screen.
    Lootr.Screen.playScreen.setSubScreen(undefined);
    // Call the OK function and end the player's turn if it return true.
    if (this._okFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY, this._item)) {
        this._player.getMap().getEngine().unlock();
    }
};

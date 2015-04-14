
Lootr.extend = function(src, dest) {
    // Create a copy of the source
    var result = {};
    for(var key in src) {
        result[key] = src[key];
    }

    // Copy over all keys from dest
    for(var key in dest) {
    result[key] = dest[key];
    }

    return result;
};

Lootr.isInputTypeKeyDown = function(inputType) {
    return inputType == "keydown";
};

// Helper function
Lootr.getNeighborPositions = function(x, y) {
    var tiles = [];
    // Generate all possible offsets
    for (var dX = -1; dX < 2; dX ++) {
        for (var dY = -1; dY < 2; dY++) {
            // Make sure it isn't the same tile
            if (dX == 0 && dY == 0) {
                continue;
            }
            tiles.push({x: x + dX, y: y + dY});
        }
    }
    return tiles.randomize();
};

Lootr.getMousePos = function(canvas, evt) {
    //var rect = canvas.getBoundingClientRect();
    /*return {
      x: evt.clientX - evt.screenX,
      y: evt.clientY - rect.top
    };*/

    return {
      x: evt.pageX - evt.clientX,
      y: evt.pageY - evt.clientY
    };
};

/*Lootr.lightenColor = function(color, amount) {

    if(color.constructor == String) {
        var rgb = ROT.Color.fromString(color);
    } else if(color instanceof Array) {
        var rgb = ROT.Color.toRGB(color);
    }

    rgb[0] = Math.min(255, rgb[0] + 255 * amount);
    rgb[1] = Math.min(255, rgb[1] + 255 * amount);
    rgb[2] = Math.min(255, rgb[2] + 255 * amount);

    return ROT.Color.toHex(rgb);
}*/
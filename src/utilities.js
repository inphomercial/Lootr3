
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

Lootr.isInputKey = function(inputData, keyCode) {
    return inputData.keyCode === keyCode;
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

// ex: if you want 1 - 100 min = 1, max = 100
Lootr.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Lootr.getMousePos = function(canvas, evt) {
    return {
      x: evt.pageX - evt.clientX,
      y: evt.pageY - evt.clientY
    };
};

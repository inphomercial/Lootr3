
// ItemList Screen
Lootr.Screen.ItemListScreen = function(template) {
    // Setup based on the template
    this._caption = template['caption'];
    this._okFunction = template['ok'];

    // Whether a 'no item' option should appear
    this._hasNoItemOption = template['hasNoItemOption'];

    // By default we use the identity function
    this._isAcceptableFunction = template['isAcceptable'] || function(x) {
        return x;
    }

    // Whether the user can select items at all
    this._canSelectItem = template['canSelect'];

    // Whether the user can select multiple items
    this._canSelectMultipleItems = template['canSelectMultipleItems'];
}

Lootr.Screen.ItemListScreen.prototype.setup = function(player, items) {
    this._player = player;

    // Should be called before switching to the screen
    var count = 0;
    // Iterate over each time, keeping only the acceptable ones and counting the
    // number of acceptable items
    var that = this;
    this._items = items.map(function(item) {
        // Transform the item into null if it's not acceptable
        if(that._isAcceptableFunction(item)) {
            count++;
            return item;
        } else {
            return null;
        }
    });

    // Clean the set of selected indices
    this._selectedIndices = {};
    return count;
}

Lootr.Screen.ItemListScreen.prototype.render = function(display) {
    var letters = 'abcdefghijklmnopqrstuvwxyz';

    // Render the caption to the top row
    display.drawText(0, 0, this._caption);

    // Render the no item row if enabled
    if(this._hasNoItemOption) {
        display.drawText(0, 1, '0 - no item');
    }

    var row = 0;
    for(var i=0; i<this._items.length; i++) {
        // If we have an item, we want to render it.
        if(this._items[i]) {
            // Get the letter matching the item's index
            var letter = letters.substring(i, i+1);

            // If we have selected an item, show a +, else show
            // a dash betwen the letter and the items name
            var selectionState = (this._canSelectItem &&
                                  this._canSelectMultipleItems &&
                                  this._canselctedIndices[i]) ? '+' : '-';

            // Check if the item is worn or wielded
            var suffix = '';
            if(this._items[i] === this._player.getArmor()) {
                suffix = ' (wearing)';
            } else if(this._items[i] === this._player.getWeapon()) {
                suffix = ' (wielding)';
            }

            // Render at the correct row and add 2
            display.drawText(0, 2 + row, letter + ' ' + selectionState + ' ' + this._items[i].describe() + suffix);
            row++;
        }
    }
}

Lootr.Screen.ItemListScreen.prototype.handleInput = function(inputType, inputData) {
    if(inputType == 'keydown') {
        // If the user hit escape, hit enter and cannot select an item 
        // or hit enter without any items selecteed, cancel out
        if(inputData.keyCode === ROT.VK_ESCAPE || inputData.keyCode === ROT.VK_RETURN &&
           (!this._canSelectItem || Object.keys(this._selectedIndices).length === 0)) {
            Lootr.Screen.playScreen.setSubScreen(undefined);
        } else if (inputData.keyCode === ROT.VK_RETURN) {
            this.executeOkFunction();

        // Handle pressing 0 when 'no item' selection is enabled
        } else if (this._canSelectItem && this._hasNoItemOption && inputData.keyCode === ROT.VK_0) {
            this._selectedIndices = {};
            this.executeOkFunction();

        // Handle pressing a leter if we can select
        } else if (this._canSelectItem && inputData.keyCode >= ROT.VK_A && inputData.keyCode <= ROT.VK_Z) {
            // check if it maps to a valid item by subtracting 'a' from the character
            // to know what letter of the alphabet we used
            var index = inputData.keyCode - ROT.VK_A;
            if(this._items[index]) {
                // If multiple selection is allowed, toggle the selection status, else
                // select the item and exit the screen
                if(this._canSelectMultipleItems) {
                    if(this._selectedIndices[index]) {
                        delete this._selectedIndices[index];
                    } else {
                        this._selectedIndices[index] = true;
                    }

                    // Redraw screen
                    Lootr.refresh();
                } else {
                    this._selectedIndices[index] = true;
                    this.executeOkFunction();
                }
            }
        }
    }
}

Lootr.Screen.ItemListScreen.prototype.executeOkFunction = function() {
    // Gather the selected items
    var selectedItems = {};
    for(var key in this._selectedIndices) {
        selectedItems[key] = this._items[key];
    }

    // Switch back to the play screen
    Lootr.Screen.playScreen.setSubScreen(undefined);

    // Call the OK function and end the players turn if it return true
    if(this._okFunction(selectedItems)) {
        this._player.getMap().getEngine().unlock();
    }
}
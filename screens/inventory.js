
// Inventory Screen
Lootr.Screen.inventoryScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Inventory',
    canSelect: false
});

Lootr.Screen.inventoryScreen.render = function(display) {
    var letters = 'abcdefghijklmnopqrstuvwxyz';

    // Render our Game Border
    Lootr.UI.RenderGameBorder(display);

    // Render Player States
    Lootr.UI.RenderStatsGroup(this._player, 12, 1, display);

    // Render Player Orbs
    Lootr.UI.RenderOrbsGroup(this._player, 12, 1, display);

    // Starting X & Y
    var startX = 5;
    var startY = 3;

    // Render the caption to the top row
    display.drawText(startX, startY, this._caption);

    // Render the Amount of inventory slots remaining
    Lootr.UI.InventoryRemainingDisplay(this._player, startX + 10, startY, display);

    // Render the no item row if enabled
    if (this._hasNoItemOption) {
        display.drawText(startX, startY + 2, '0 - no item');
    }

    var row = 2;
    for (var i = 0; i < this._items.length; i++) {
        // If we have an item, we want to render it.
        if (this._items[i]) {
            // Get the letter matching the item's index
            var letter = letters.substring(i, i+1);

            // If we have selected an item, show a +, else show
            // a dash betwen the letter and the items name
            var selectionState = (this._canSelectItem && this._canSelectMultipleItems && this._selectedIndices[i]) ? '+' : '-';

            // Check if the item is worn or wielded
            var suffix = '';
            // if(this._items[i] === this._player.getArmor()) {
            if (this._items[i].getWorn() && this._items[i]._slot === Lootr.ITEM_SLOTS.HAND) {
                suffix = ' (wielding)';
            // } else if(this._items[i] === this._player.getWeapon()) {
            } else if (this._items[i].getWorn()) {
                suffix = ' (wearing)';
            }

            // Render at the correct row and add 2
            display.drawText(startX, startY + row, letter + ' ' + selectionState + ' ' + this._items[i].describe() + suffix);
            row++;
        }
    }
}

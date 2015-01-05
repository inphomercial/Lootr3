
// Pickup Screen
Lootr.Screen.pickupScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Choose the items you wish to pickup.',
    canSelect: true,
    canSelectMultipleItems: true,
    ok: function(selectedItems) {
        // Try to pickup all items, messagin the player if they
        // couldnt pick up all
        if(!this._player.pickupItems(Object.keys(selectedItems))) {
            Lootr.sendMessage(this._player, 'Your inventory is full. Not all items were picked up.');
        }

        return true;
    }
});
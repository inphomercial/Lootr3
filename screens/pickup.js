
// Pickup Screen
Lootr.Screen.pickupScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Choose the items you wish to pickup.',
    canSelect: true,
    canSelectMultipleItems: true,
    ok: function(selectedItems) {
        var that = this;

        _.each(selectedItems, function(item) {
            if (that._player.canPickupItem(item)) {
                that._player.pickupItem(item);
            } else {
                Lootr.sendMessage(that._player, 'Your inventory is full. Not all items were picked up.');
            }
        });

        return true;
    }
});

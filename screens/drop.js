
// Drop Screen
Lootr.Screen.dropScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Choose the item you wish to drop',
    canSelect: true,
    canSelectMultipleItems: false,
    ok: function(selectedItems) {
        var that = this;
        // Drop the selected item
        _.each(selectedItems, function(item) {
            that._player.dropItem(item);
        });

        return true;
    }
});

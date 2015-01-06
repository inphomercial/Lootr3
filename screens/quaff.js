
// Quaff Screen
Lootr.Screen.quaffScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Choose the item you wish to quaff',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function(item) {
        return item && item.hasComponent('Quaffable');
    },
    ok: function(selectedItems) {
        // Eat the item, removing it if therea re no consumptions left
        var key = Object.keys(selectedItems);
        var item = selectedItems[key[0]];
        Lootr.sendMessage(this._player, 'You quaff %s', [item.describeThe()]);
        item.quaff(this._player);
        if(!item.hasRemainingQuaffs()) {
            this._player.removeItem(key);
        }

        return true;
    }
})
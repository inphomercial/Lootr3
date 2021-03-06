
// Wear screen
Lootr.Screen.wearScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wear or remove',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item && item.hasComponent('Equippable') && item.isWearable();
    },
    ok: function(items) {
        var keys = Object.keys(items);
        if (keys.length === 1) {
            if (items[keys].getWorn()) {
                this._player.tryUnEquipSlot(items[keys]);
            } else {
                this._player.tryEquipSlot(items[keys]);
            }
        }

        return true;
    }
});
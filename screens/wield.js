
// Wield Screen
Lootr.Screen.wieldScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wield or unwield',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item && item.hasComponent('Equippable') && item.isWieldable();
    },
    ok: function(items) {
        var keys = Object.keys(items);
        if (keys.length === 1) {
             if (items[keys].getWorn()) {
                this._player.tryUnEquipSlot(items[keys]);
            } else {
                this._player.tryEquipSlot(items[keys]);
            }
            // if (items[keys] === this._player.getWeapon()) {
            //     //this._player.unwield();
            //     this._player.tryEquipSlot(items[keys]);
            // } else {
            //     this._player.tryEquipSlot(items[keys]);
            //     //this._player.wield(items[keys]);
            // }
        }

        return true;
    }
});
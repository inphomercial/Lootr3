
// Wield Screen
Lootr.Screen.wieldScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wield',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item && item.hasComponent('Equippable') && item.isWieldable();
    },
    ok: function(selectedItems) {
        // Check if we selected 'no item'
        var keys = Object.keys(selectedItems);
        if(keys.length === 0) {
            this._player.unwield();
            Lootr.sendMessage(this._player, 'You are empty handed.');
        } else {
            // Make sure to unequip the item first in case it is the armor
            var item = selectedItems[keys[0]];
            this._player.unequip(item);
            this._player.wield(item);
            Lootr.sendMessage(this._player, 'You are wielding %s', [item.describeA()]);
        }

        return true;
    }
});
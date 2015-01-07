
// Wear screen
Lootr.Screen.wearScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wear',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item && item.hasComponent('Equippable') && item.isWearable();
    },
    ok: function(item) {
        // Check if we selected no item
        var keys = Object.keys(item);
        if(keys.length === 0) {
            this._player.takeOff();
            Lootr.sendMessage(this._player, 'You are not wearing anything.');            
        } else {
            // Make sure to unequip the item first in case it is the weapon
            var item = item[keys[0]];
            this._player.unequip(item);
            this._player.wear(item);
            Lootr.sendMessage(this._player, 'You are wearing %s', [item.describeA()]);
        }
    }
});
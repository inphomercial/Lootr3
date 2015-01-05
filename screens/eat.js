
// Eat Screen
Lootr.Screen.eatScreen = new Lootr.Screen.ItemListScreen({
    caption: 'Choose the item you wish to eat',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function(item) {
        return item && item.hasComponent('Edible');
    },
    ok: function(selectedItems) {
        // Eat the item, removing it if therea re no consumptions left
        var key = Object.keys(selectedItems);
        var item = selectedItems[key[0]];
        Lootr.sendMessage(this._player, 'You eat %s', [item.describeThe()]);
        item.eat(this._player);
        if(!item.hasRemainingConsumptions()) {
            this._player.removeItem(key);
        }

        return true;
    }
})

Lootr.Storage = {
    addRecord: function(player) {
        if(!this.isCurrentRecordHigher(player)) {
            alert("You beat your previous high score!");
            localStorage.setItem('LootrLog', JSON.stringify(player.convertToJsonObject()));
        }
    },
    getRecord: function() {
        return JSON.parse(localStorage.getItem('LootrLog'));
    },
    clearAllRecord: function() {
        localStorage.clear();
    },
    isCurrentRecordHigher: function(player) {
        var records = this.getRecord();

        if(records !== null) {
            var json_object_player = player.convertToJsonObject();

            return records.level > json_object_player.level;
        }

        return false;
    }
};
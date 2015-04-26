
Lootr.Storage = {
    addRecord: function(player) {
        var records = this.getRecords();
        if (records !== null) {
            records[localStorage.length] = player.convertToJsonObject();    
            localStorage.setItem('LootrLog', JSON.stringify(records));            

            return;
        } 

        var newRecord = {};
        newRecord[0] = player.convertToJsonObject();
        localStorage.setItem('LootrLog', JSON.stringify(newRecord));
    },
    getRecords: function() {
        return localStorage.getItem('LootrLog');
    },
    clearAllRecords: function() {
        localStorage.clear();
    }
};
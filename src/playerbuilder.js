
var PlayerBuilder = function(baseTemplate, classTemplate) {
    this._baseTemplate = baseTemplate;
    this._classTemplate = classTemplate;

    this.combineTemplates();

    return this._baseTemplate;
};

PlayerBuilder.prototype.combineTemplates = function() {
    for (var property in this._classTemplate) {
        if(property == 'components') {
            this._addAllComponentsToBaseClass(property);
            continue;
        }

        this._baseTemplate[property] = this._classTemplate[property];
    }
};

PlayerBuilder.prototype._addAllComponentsToBaseClass = function(components) {
    console.log(this._classTemplate[components].length);
    for (var i = 0; i < this._classTemplate[components].length; i++) {
        this._baseTemplate[components].push(this._classTemplate[components][i])
    }
};
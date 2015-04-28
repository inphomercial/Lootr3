
//var bp = new PlayerBuilder(Lootr.Templates.BasePlayer, Lootr.Templates.WizardPlayer);
//bp.combineTemplates();
//console.info("bp", bp.getFinalTemplate());

var PlayerBuilder = function(baseTemplate, classTemplate) {
    this._baseTemplate = baseTemplate;
    this._classTemplate = classTemplate;
};

PlayerBuilder.prototype.getFinalTemplate = function() {
    return this._baseTemplate;
};

PlayerBuilder.prototype.addAllComponentsToBaseClass = function(components) {
    console.log(this._classTemplate[components].length);
    for (var i=0; i<this._classTemplate[components].length; i++) {                   
        this._baseTemplate[components].push(this._classTemplate[components][i])
    }         
};

PlayerBuilder.prototype.combineTemplates = function() {
    for (var property in this._classTemplate) {        
        if(property == 'components') {                
            this.addAllComponentsToBaseClass(property); 
            continue;
        }
        
        this._baseTemplate[property] = this._classTemplate[property];    
    }
};

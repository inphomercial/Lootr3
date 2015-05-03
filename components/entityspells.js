Lootr.EntitySpells = {};

Lootr.EntitySpells.Fireball = {
    name: 'FireBall',
    init: function(template) {
        this._caster = template['caster'] || null
        this._manaConsumptionAmount = 2;
    },
    cast: function(x, y) {
        if (this._checkIfCanCast()) {
            if(this._caster.getMap().isTileWithoutEntity(x, y)) {
                var fireball = Lootr.EntityRepository.create('fire');
                this._caster.getMap().addEntityAt(x, y, fireball);

                this._caster.raiseEvent('onConsumeMana', this._manaConsumptionAmount);

                this._getDescription();
            }
        } else {
            Lootr.sendMessage(this._caster, 'You lack the mental fortitude to cast that');
        }   
    },
    _getDescription: function() {
        Lootr.sendMessage(this._caster, 'You hurl a ball of fire!');
    },
    _checkIfCanCast: function() {
        return this._caster.hasComponent('ManaPool') && this._caster.getMana() >= this._manaConsumptionAmount;            
    },
};

Lootr.EntitySpells.Firebolt = {
    name: 'FireBolt',
    init: function(template) {
        this._caster = template['caster'] || null;
        this._manaConsumptionAmount = 5;
        this._target = template['target'] || null;
    },
    cast: function(x, y) {
        if (this._checkIfCanCast()) {
            if(this._target !== null) {
                //var fireball = Lootr.EntityRepository.create('fire');
                //this._caster.getMap().addEntityAt(x, y, fireball);


                this._caster.raiseEvent('onConsumeMana', this._manaConsumptionAmount);

                this._getDescription();
            } else {
                Lootr.sendMessage(this._caster, 'You fire a bolt at nothing');    
            }
        } else {
            Lootr.sendMessage(this._caster, 'You lack the mental fortitude to cast that');
        }   
    },
    _getDescription: function() {
        Lootr.sendMessage(this._caster, 'You fire a bolt at the ' + this._target.getChar());
    },
    _checkIfCanCast: function() {
        return this._caster.hasComponent('ManaPool') && this._caster.getMana() >= this._manaConsumptionAmount;            
    },
};
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
        this._target = template['target'] || null;
        this._manaConsumptionAmount = 5;
        this._damage = 2;
    },
    cast: function(x, y) {
        if (this._checkIfCanCast()) {
            if(this._target && this._target.hasComponent('Destructible')) {
                this._target.takeDamage(this._caster, this._getDamage());
                this._getDescription();
            } else {
                Lootr.sendMessage(this._caster, 'You fire a bolt at nothing');
            }

            this._caster.raiseEvent('onConsumeMana', this._manaConsumptionAmount);

        } else {
            Lootr.sendMessage(this._caster, 'You lack the mental fortitude to cast that');
        }
    },
    _getDamage: function() {
        return this._damage * this._caster.getInt();
    },
    _getDescription: function() {
        Lootr.sendMessage(this._caster, 'You fire a bolt at the ' + this._target.getName() + ', for ' + this._getDamage());
    },
    _checkIfCanCast: function() {
        return this._caster.hasComponent('ManaPool') && this._caster.getMana() >= this._manaConsumptionAmount;
    },
};
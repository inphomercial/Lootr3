Lootr.EntitySpells = {
};

Lootr.EntitySpells.prototype.canEntityCast = function() {
    return this._caster.hasComponent('ManaPool') && this._caster.getMana() >= this._manaConsumptionAmount;
};

Lootr.EntitySpells.Teleport = {
    name: 'Teleport',
    init: function(template) {
        this._caster = template['caster'] || null;
        this._manaConsumptionAmount = 15;
        this._char = '?';
        this._color = 'lightblue';
    },
    cast: function(x, y) {
        if (this._canEntityCast()) {
            if (this._caster.getMap().isTileWithoutEntity(x, y)) {
                this._caster.getMap().updateEntityPositionTo(this._caster, x, y);
                this._caster.raiseEvent('onConsumeMana', this._manaConsumptionAmount);
                this._getDescription();
            } else {
                Lootr.sendMessage(this._caster, 'Looks like something is already there.');
            }
        } else {
            Lootr.sendMessage(this._caster, 'Your body is to feeble to make that transition');
        }
    },
    getChar: function() {
        return this._char;
    },
    getColor: function() {
        return this._color;
    },
    _getDescription: function() {
        Lootr.sendMessage(this._caster, 'You break apart, joining together again.');
    },
    _canEntityCast: function() {
        return this._caster.hasComponent('ManaPool') && this._caster.getMana() >= this._manaConsumptionAmount;
    }
};
Lootr.EntitySpells.Teleport.extend(Lootr.EntitySpells);

Lootr.EntitySpells.Fireball = {
    name: 'FireBall',
    init: function(template) {
        this._caster = template['caster'] || null;
        this._manaConsumptionAmount = 2;
        this._char = 'W';
        this._color = 'yellow';
    },
    cast: function(x, y) {
        if (this._canEntityCast()) {
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
    getChar: function() {
        return this._char;
    },
    getColor: function() {
        return this._color;
    },
    _getDescription: function() {
        Lootr.sendMessage(this._caster, 'You hurl a ball of fire!');
    },
    _canEntityCast: function() {
        return this._caster.hasComponent('ManaPool') && this._caster.getMana() >= this._manaConsumptionAmount;
    }
};
Lootr.EntitySpells.Fireball.extend(Lootr.EntitySpells);

Lootr.EntitySpells.Firebolt = {
    name: 'FireBolt',
    init: function(template) {
        this._caster = template['caster'] || null;
        this._target = template['target'] || null;
        this._manaConsumptionAmount = 5;
        this._damage = 2;
        this._char = '!';
        this._color = 'red';
    },
    cast: function(x, y) {
        if (this._canEntityCast()) {
            if(this._target && this._target.hasComponent('Destructible')) {
                var damage = Lootr.getRandomInt(1, this._getDamage() - this._target.getTotalDefenseValue());

                this._target.takeDamage(this._caster, damage);

                Lootr.sendMessage(this._caster, 'You fire a bolt at the ' + this._target.getName() + ', for ' + damage);
            } else {
                Lootr.sendMessage(this._caster, 'You fire a bolt at nothing');
            }

            this._caster.raiseEvent('onConsumeMana', this._manaConsumptionAmount);

        } else {
            Lootr.sendMessage(this._caster, 'You lack the mental fortitude to cast that');
        }
    },
    getChar: function() {
        return this._char;
    },
    getColor: function() {
        return this._color;
    },
    _getDamage: function() {
        return this._damage * this._caster.getTotalIntValue();
    },
    _canEntityCast: function() {
        return this._caster.hasComponent('ManaPool') && this._caster.getMana() >= this._manaConsumptionAmount;
    }
};
Lootr.EntitySpells.Firebolt.extend(Lootr.EntitySpells);

Lootr.EntitySpell = function() {
    this._caster = null;
    this._description = null;
    this._char = '?';
    this._color = 'lightblue';
    this._manaConsumptionAmount = null;
};

Lootr.EntitySpell.prototype.canEntityCast = function() {
    return this._caster.hasComponent('ManaPool') && this._caster.getMana() >= this._manaConsumptionAmount;
};

Lootr.EntitySpell.prototype.getChar = function() {
    return this._char;
};

Lootr.EntitySpell.prototype.getColor = function() {
    return this._color;
};

Lootr.EntitySpell.prototype.getDescription = function() {
    Lootr.sendMessage(this._caster, this._description);
};

Lootr.EntitySpells = {};
Lootr.EntitySpells.Teleport = function(template) {
    this._name = 'Teleport';
    this._description = "You break apart, joining together again.";
    this._caster = template['caster'] || null;
    this._manaConsumptionAmount = 15;
    this._char = '?';
    this._color = 'lightblue';

    this.cast = function(x, y) {
        if (this.canEntityCast()) {
            if (this._caster.getMap().isTileWithoutEntity(x, y)) {
                this._caster.getMap().updateEntityPositionTo(this._caster, x, y);
                this._caster.raiseEvent('onConsumeMana', this._manaConsumptionAmount);
                this.getDescription();
            } else {
                Lootr.sendMessage(this._caster, 'Looks like something is already there.');
            }
        } else {
            Lootr.sendMessage(this._caster, 'Your body is to feeble to make that transition');
        }
    };
};
Lootr.EntitySpells.Teleport.extend(Lootr.EntitySpell);

Lootr.EntitySpells.Fireball = function(template) {
    this._name = 'FireBall';
    this._caster = template['caster'] || null;
    this._manaConsumptionAmount = 2;
    this._char = 'W';
    this._color = 'yellow';

    this.cast = function(x, y) {
        if (this.canEntityCast()) {
            if(this._caster.getMap().isTileWithoutEntity(x, y)) {
                var fireball = Lootr.EntityRepository.create('fire');
                this._caster.getMap().addEntityAt(x, y, fireball);

                this._caster.raiseEvent('onConsumeMana', this._manaConsumptionAmount);

                this.getDescription();
            }
        } else {
            Lootr.sendMessage(this._caster, 'You lack the mental fortitude to cast that');
        }
    }
};
Lootr.EntitySpells.Fireball.extend(Lootr.EntitySpell);

Lootr.EntitySpells.Firebolt = function(template) {
    this.name = 'FireBolt';
    this._caster = template['caster'] || null;
    this._target = template['target'] || null;
    this._manaConsumptionAmount = 5;
    this._damage = 2;
    this._char = '!';
    this._color = 'red';

    this.cast = function(x, y) {
        if (this.canEntityCast()) {
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
    };
};
Lootr.EntitySpells.Firebolt.extend(Lootr.EntitySpell);

Lootr.EntitySpell = function() {
	this._name = "";
	this._description = null;
	this._successMessage = "success";
	this._failMessage = "failed";
	this._caster = null;
	this._target = null;
	this._manaConsumptionAmount = 0;
	this._char = '?';
	this._color = 'lightblue';
};

Lootr.EntitySpell.prototype.getName = function() {
	return this._name;
};

Lootr.EntitySpell.prototype.getDescription = function() {
	return this._description;
};

Lootr.EntitySpell.prototype.getSuccessMessage = function() {
	return this._successMessage;
};

Lootr.EntitySpell.prototype.getFailMessage = function() {
	return this._failMessage;
};

Lootr.EntitySpell.prototype.getCaster = function() {
	return this._caster;
};

Lootr.EntitySpell.prototype.getTarget = function() {
	return this._target;
};

Lootr.EntitySpell.prototype.getManaConsumptionAmount = function() {
	return this._manaConsumptionAmount;
};

Lootr.EntitySpell.prototype.getChar = function() {
	return this._char;
};

Lootr.EntitySpell.prototype.getColor = function() {
	return this._color;
};

// Non Attribute Methods
Lootr.EntitySpell.prototype.canEntityCast = function() {
	return this._caster.hasComponent('ManaPool') && this._caster.getMana() >= this._manaConsumptionAmount;
};

Lootr.EntitySpells = {};

Lootr.EntitySpells.HealLight = function(template) {
	this._name = "Light Heal";
	this._description = "A Light Healing spell";
	this._successMessage = "You lightly heal yourself";
	this._failMessage = "You fail to gather the power to heal anything.";
	this._caster = template['caster'] || null;
	this._manaConsumptionAmount = 10;
	this._char = "H";
	this._color = 'red';

	this.cast = function() {
		if (this.canEntityCast()) {
			if (this._caster.hasComponent('Destructible')) {
				this._caster.modifyHpBy(10);
				Lootr.sendMessage(this.getCaster(), this.getSuccessMessage());
			} else {
				Lootr.sendMessage(this.getCaster(), "Not a healable entity.");
			}

			this._caster.raiseEvent('onConsumeMana', this._manaConsumptionAmount);

		} else {
			Lootr.sendMessage(this.getCaster(), this.getFailMessage());
		}
	}
}
Lootr.EntitySpells.HealLight.extend(Lootr.EntitySpell);

Lootr.EntitySpells.Teleport = function(template) {
	this._name = 'Teleport';
	this._description = "A Teleport spell";
	this._successMessage = "You break apart, joining together again.";
	this._failMessage = "Your body is to feeble to make that transition";
	this._caster = template['caster'] || null;
	this._manaConsumptionAmount = 15;
	this._char = '?';
	this._color = 'lightblue';

	this.cast = function(x, y) {
			if (this.canEntityCast()) {
				if (this.getCaster().getMap().isTileWithoutEntity(x, y)) {
					this._caster.getMap().updateEntityPositionTo(this.getCaster(), x, y);
					Lootr.sendMessage(this.getCaster(), this.getSuccessMessage());
				} else {
					Lootr.sendMessage(this.getCaster(), 'Looks like something is already there.');
				}

				this._caster.raiseEvent('onConsumeMana', this._manaConsumptionAmount);

			} else {
				Lootr.sendMessage(this.getCaster(), this.getFailMessage());
			}
	};
};
Lootr.EntitySpells.Teleport.extend(Lootr.EntitySpell);

Lootr.EntitySpells.Fireball = function(template) {
	this._name = 'FireBall';
	this._description = "A Fireball spell";
	this._successMessage = "An explosive fireball erupts.";
	this._failMessage = "You fail to ignite anything.";
	this._caster = template['caster'] || null;
	this._manaConsumptionAmount = 2;
	this._char = 'W';
	this._color = 'yellow';

	this.cast = function(x, y) {
		if (this.canEntityCast()) {
			if(this._caster.getMap().isTileWithoutEntity(x, y)) {
				var fireball = Lootr.EntityRepository.create('fire');
				this._caster.getMap().addEntityAt(x, y, fireball);
				Lootr.sendMessage(this.getCaster(), this.getSuccessMessage());
			}

			this._caster.raiseEvent('onConsumeMana', this._manaConsumptionAmount);

		} else {
			Lootr.sendMessage(this.getCaster(), this.getFailMessage());
		}
	}
};
Lootr.EntitySpells.Fireball.extend(Lootr.EntitySpell);

Lootr.EntitySpells.Firebolt = function(template) {
	this._name = 'FireBolt';
	this._description = "A Firebolt spell";
	this._successMessage = "An arrow of fire strikes out hitting";
	this._failMessage = "You fail to shoot anything.";
	this._caster = template['caster'] || null;
	this._target = template['target'] || null;
	this._manaConsumptionAmount = 5;
	this._damage = 2;
	this._char = '!';
	this._color = 'red';

	this.cast = function(x, y) {
		if (this.canEntityCast()) {
			if(this._target && this._target.hasComponent('Destructible')) {
				var damage = Lootr.getRandomInt(1, this._damage - this._target.getTotalDefenseValue());
				this._target.takeDamage(this.getCaster(), damage);
				Lootr.sendMessage(this.getCaster(), this.getSuccessMessage() + this.getTarget().getName() + ', for ' + damage);
			} else {
				Lootr.sendMessage(this.getCaster(), 'You fire a bolt at nothing');
			}

			this._caster.raiseEvent('onConsumeMana', this._manaConsumptionAmount);

		} else {
			Lootr.sendMessage(this.getCaster(), this.getFailMessage());
		}
	};
};
Lootr.EntitySpells.Firebolt.extend(Lootr.EntitySpell);

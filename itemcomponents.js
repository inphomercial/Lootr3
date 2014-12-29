Lootr.ItemComponents = {};

// Edible ItemComponent
Lootr.ItemComponents.Edible = {
	name: 'Edible',
	init: function(template) {
		// Number of points to add to hunger
		this._foodValue = template['foodValue'] || 5;

		// Number of times the item can be consumed
		this._maxConsumptions = template['comsumptions'] || 1;
		this._remainingConsumptions = this._maxConsumptions;
	},
	eat: function(entity) {
		if(entity.hasComponent('FoodConsumer')) {
			if(this.hasRemainingConsumptions()) {
				entity.modifyFullnessBy(this._foodValue);
				this._remainingConsumptions--;
			}
		}
	},
	hasRemainingConsumptions: function() {
		return this._remainingConsumptions > 0;
	},
	describe: function() {
		if(this._maxConsumptions != this._remainingConsumptions) {
			return 'partly eaten ' + Lootr.Item.prototype.describe.call(this);
		} else {
			return this._name;
		}
	}
};

Lootr.ItemComponents.Equippable = {
	name: 'Equippable',
	init: function(template) {
		this._attackValue = template['attackValue'] || 0;
		this._defenseValue = template['defenseValue'] || 0;
		this._wieldable = template['wieldable'] || false;
		this._wearable = template['wearable'] || false;
	},
	getAttackValue: function() {
		return this._attackValue;
	},
	getDefenseValue: function() {
		return this._defenseValue;
	},
	isWieldable: function() {
		return this._wieldable;
	},
	isWearable: function() {
		return this._wearable;
	}
};
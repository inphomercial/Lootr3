Lootr.ItemComponents = {};

// Quaffable ItemComponent
Lootr.ItemComponents.Quaffable = {
	name: 'Quaffable',
	init: function(template) {
		this._quaffValue = template['quaff_value'] || 5;
		this._maxQuaffs = template['quaffs'] || 1;
		this._remainingQuaffs = this._maxQuaffs;
	},
	quaff: function(entity) {
		if(entity.hasComponent('Destructible')) {
			if(this.hasRemainingQuaffs()) {
				entity.modifyHpBy(this._quaffValue);
				this._remainingQuaffs--;
			}
		}
	},
	describe: function() {
		if(this._maxQuaffs != this._remainingQuaffs) {
			return 'partly drank ' + Lootr.Item.prototype.describe.call(this);
		} else {
			return this._name;
		}
	},
	hasRemainingQuaffs: function() {
		return this._remainingQuaffs > 0;
	},
	listeners: {
		details: function() {
			return [{key: 'quaff', value: this._quaffValue}];
		}
	}
};

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
	},
	listeners: {
		details: function() {
			return [{key: 'food', value: this._foodValue}];
		}
	}
};

Lootr.ItemComponents.Gold = {
	name: 'Gold',
	init: function(template) {
		this._value = template['gold'] || 1;
	},
	modifyGoldBy: function(amount) {
		this._value += amount;
	},
	getGold: function() {
		return this._value;
	}
};

Lootr.ItemComponents.SpringTrap = {
	name: 'SpringTrap',
	init: function(template) {
		this._hasSprung = false;
		this._trapDamage = template['trapDamage'] || 1;
	},
	springTrap: function(entity) {
		
		if(!this._hasSprung) {

			// Set sprung so it cannot happen again
			this._hasSprung = true;

			// Send message
			Lootr.sendMessage(entity, 'You spring a trap!!');

			// Apply Damage
			if(entity.hasComponent('Destructible')) {			
				entity.takeDamage(this, this._trapDamage * 2);			
			}

		// Stepping on it after already sprung	
		} else {
			// Send message
			Lootr.sendMessage(entity, 'You step on a trap!!');

			// Apply Damage
			if(entity.hasComponent('Destructible')) {			
				entity.takeDamage(this, this._trapDamage);			
			}
		}

		// Update tile character			
		this._char = '^';	

		// make blooodddy
	    var fc = ROT.Color.fromString(this.getForeground());
	    var sc = ROT.Color.fromString('red');
	    var c = ROT.Color.multiply_(fc, sc);                                        
	    
	    this.setForeground(c);

	    // Make surrounding tiles blooodddyyyy
	    entity.getMap().bloodyTile(entity.getX(), entity.getY());
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
	},
	listeners: {
		details: function() {
			var results = [];
			if(this._wieldable) {
				results.push({key: 'attack', value: this.getAttackValue()});
			}
			if(this._wearable) {
				results.push({key: 'defense', value: this.getDefenseValue()});
			}

			return results;
		}
	}
};
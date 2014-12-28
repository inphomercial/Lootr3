
Lootr.EntityComponents = {};

Lootr.EntityComponents.Moveable = {
	name: 'Moveable',
	groupName: 'Moveable',
	
}

Lootr.EntityComponents.WanderActor = {
	name: 'WanderActor',
	groupName: 'Actor',
	act: function() {
		// flip coin to determine if moving by 1 in the pos or neg direction
		var moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;

		// Flip coin to determine if moving in x or y direction
		if(Math.round(Math.random()) === 1) {
			this.tryMove(this.getX() + moveOffset, this.getY());
		} else {
			this.tryMove(this.getX(), this.getY() + moveOffset);
		}
	}
};

Lootr.EntityComponents.Sight = {
	name: 'Sight',
	groupName: 'Sight',
	init: function(template) {
		this._sightRadius = template['sightRadius'] || 5;
	},
	getSightRadius: function() {
		return this._sightRadius;
	}
}

Lootr.EntityComponents.PlayerActor = {
	name: 'PlayerActor',
	groupName: 'Actor',
	act: function() {
		// Ensure we are not already acting
		/*if(this._acting) {
			return;
		}*/

		this._acting = true;
		this.addTurnHunger();

		// Detect if game is over or dead
		if(!this.isAlive()) {
			Lootr.Screen.playScreen.setGameEnded(true);
		
			// Send last message to player
			Lootr.sendMessage(this, 'Press [Enter] to continue');

			this._acting = false;
		}

		// Re-redner the screen
		Lootr.refresh();

		// Lock the engine and wait async for the player to press a key
		this.getMap().getEngine().lock();

		// Clear the message queue
		this.clearMessages();
	}
}

Lootr.EntityComponents.FoodConsumer = {
	name: 'FoodConsumer',
	init: function(template) {
		this._maxFullness = template['maxFullness'] || 1000;

		// Start halfway to max fullness if no default value
		this._fullness = template['fullness'] || (this._maxFullness / 2);

		// Number of points to decrease fullness by every turn
		this._fullnessDepletionRate = template['fullnessDepletionRate'] || 1;
	},
	modifyFullnessBy: function(points) {
		this._fullness = this._fullness + points;
		if(this._fullness <= 0) {
			this.kill('You have died of starvation');
		} else if(this.fullness > this._maxFullness) {
			this.kill('You choke and die');
		}
	},
	addTurnHunger: function() {
		// Remove the standard depletion points
		this.modifyFullnessBy(-this._fullnessDepletionRate);
	},
	getHungerState: function() {
		// Fullness points per percent of max fullness
		var perPercent = this._maxFullness / 100;

		// 5% of max fullness or less = starving
		if(this._fullness <= perPercent * 5) {
			return '%c{red}Starving';
		}
		// 25%
		else if(this._fullness <= perPercent * 25) {
			return '%c{yellow}Hungry';
		}		
		// 75
		else if(this._fullness <= perPercent * 75) {
			return 'Full';
		}
		// 95
		else if(this._fullness <= perPercent * 95) {
			return 'Oversatiated';
		}
		// Anything else = no hungry
		else {
			return 'Not Hungry';
		}
	}
};

Lootr.EntityComponents.CorpseDropper = {
	name: 'CorpseDropper',
	init: function(template) {
		// Chance of dropping corse
		this._corpseDropRate = template['corpseDropRate'] || 100;
	},
	tryDropCorpse: function() {
		if(Math.round(Math.random() * 100) < this._corpseDropRate) {
			// Create a new corpse item and drop it
			this._map.addItem(this.getX(), this.getY(), 
				Lootr.ItemRepository.create('corpse', 
					{name: this._name + ' corpse', foreground: this._foreground}
			));
		}
	}
}

Lootr.EntityComponents.Destructible = {
	name: 'Destructible',
	init: function(template) {
		this._maxHp   = template['maxHp'] || 10;
		this._hp      = template['hp'] || this._maxHp;
		this._defense = template['defense'] || 0;
	},
	takeDamage: function(attacker, damage) {
		this._hp -= damage;

		// If less than 1 hp, remove ourselves
		if(this._hp < 1) {
			Lootr.sendMessage(attacker, 'You kill the %s', [this.getName()]);

			// If entity is a corpse dropper, try to add a corpse
			if(this.hasComponent(Lootr.EntityComponents.CorpseDropper)) {
				this.tryDropCorpse();
			}

			this.kill();			
		}
	},
	getHp: function() {
		return this._hp;
	},
	getMaxHp: function() {
		return this._maxHp;
	},
	getDefense: function() {
		return this._defense;
	}
}

Lootr.EntityComponents.FungusActor = {
	name: 'FungusActor',
	groupName: 'Actor',
	init: function() {
		this._growthsRemaining = 5;
	},
	act: function() {
		// Check if we grow this turn
		if(this._growthsRemaining > 0) {
			if(Math.random() <= 0.02) {
				// Generate the coordinates of a random adjacent square
				// by generating an offset between [-1, 0, 1] for both
				// the x and y. to do this we get a number from 0-2 and then sub 1
				var xOffSet = Math.floor(Math.random() * 3) - 1;
				var yOffSet = Math.floor(Math.random() * 3) - 1;

				// Make sure we arent trying to spawn on the same tile
				if(xOffSet != 0 && yOffSet != 0) {
					// check if we can actually grow at location
					if(this.getMap().isTileEmptyFloor(this.getX() + xOffSet, this.getY() + yOffSet)) {
						var entity = Lootr.EntityRepository.create('fungus');
						entity.setX(this.getX() + xOffSet);
						entity.setY(this.getY() + yOffSet);

						this.getMap().addEntity(entity);
						this._growthsRemaining--;

						// Send a message nearby
						Lootr.sendMessageNearby(this.getMap(), entity.getX(), entity.getY(), 'The fungus is spreading..');
					}
				}
			}
		}
	}
}

Lootr.EntityComponents.InventoryHolder = {
	name: 'InventoryHolder',
	init: function(template) {
		// Default to 10 slots
		var inventorySlots = template['inventorySlots'] || 10;

		// Setup an empty inventory
		this._items = new Array(inventorySlots);
	},
	getItems: function() {
		return this._items;
	},
	getItem: function(i) {
		return this._items[i];
	},
	addItem: function(item) {
		// Try to find a slot, returning true only if we could add the item
		for(var i=0; i<this._items.length; i++) {
			if(!this._items[i]) {
				this._items[i] = item;
				return true;
			}
		}
		
		return false;
	},
	removeItem: function(i) {
		// Simply clear out the slot
		this._items[i] = null;
	},
	canAddItem: function() {
		// Check if we have an empty slot
		for(var i=0; i<this._items.length; i++) {
			if(!this._items[i]) {
				return true;
			}
		}

		return false;
	},
	pickupItems: function(indices) {
		// Allows the user to pickup items from the map, where indices
		// is the indices for the array returned by map.getItemsAt
		var mapItems = this._map.getItemsAt(this.getX(), this.getY());
		var added = 0;

		// Iterate through all indices
		for(var i=0; i<indices.length; i++) {
			// Try to add the item. If our inventory is not full, then splice the 
			// Item out of the list of items. In order to fetch the right item,
			// we have to offset the number of items already added
			if(this.addItem(mapItems[indices[i] - added])) {
				mapItems.splice(indices[i] - added, 1);
				added++;
			} else {
				// Inventory is full
				break;
			}
		}

		// Update the map items
		this._map.setItemsAt(this.getX(), this.getY(), mapItems);

		// Return true only if we added all items
		return added === indices.length;
	},
	dropItem: function(i) {
		// Drops an item to the current map tile
		if(this._items[i]) {
			if(this._map) {
				// Put item back on map
				this._map.addItem(this.getX(), this.getY(), this._items[i]);		
			}
		}
		
		this.removeItem(i);		
	}
}

Lootr.EntityComponents.MessageRecipient = {
	name: 'MessageRecipient',
	init: function() {
		this._messages = [];
	},
	receiveMessage: function(message) {
		this._messages.push(message);
	},
	getMessages: function() {
		return this._messages;
	},
	clearMessages: function() {
		this._messages = [];
	}
}

Lootr.EntityComponents.Attacker = {
	name: 'Attacker',
	groupName: 'Attacker',
	init: function(template) {
		this._attack = template['attack'] || 1;
	},
	attack: function(target) {

		// If the target is destructible, calc damage based on attack and def
		if(target.hasComponent('Destructible')) {
			var attack = this.getAttack();
			var target_def = target.getDefense();
			var max = Math.max(0, attack - target_def);
			var damage = 1 + Math.floor(Math.random() * max);

			Lootr.sendMessage(this, 'You strike the %s for %d damage!', [target.getName(), damage]);
			Lootr.sendMessage(target, 'The %s strikes you for %d damage!', [this.getName(), damage]);

			target.takeDamage(this, damage);
		}
	},
	getAttack: function() {
		return this._attack;
	}
}
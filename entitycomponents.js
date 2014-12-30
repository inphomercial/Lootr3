
Lootr.EntityComponents = {};

Lootr.EntityComponents.Moveable = {
	name: 'Moveable',
	groupName: 'Moveable',
	
}

Lootr.EntityComponents.TaskActor = {
	name: 'TaskActor',
	groupName: 'Actor',
	init: function(template) {
		// Load tasks
		this._tasks = template['tasks'] || ['wander'];
	},
	act: function() {
		// Iterate through all tasks
		for(var i=0; i<this._tasks.length; i++) {
			if(this.canDoTask(this._tasks[i])) {
				// If we can perform the task, execute the function for it
				this[this._tasks[i]]();
				return;
			}
		}
	},
	canDoTask: function(task) {
		if(task === 'hunt') {
			return this.hasComponent('Sight') && this.canSee(this.getMap().getPlayer());
		} else if (task === 'wander') {
			return true;
		} else {
			throw new Error('Tried to perform undefined task ' + task);
		}
	},
	hunt: function() {

		console.log(this.name + "starts to hunt");

		var player = this.getMap().getPlayer();

		// If we are adjacent to the player, then attack instead of hunting
		var offsets = Math.abs(player.getX() - this.getX()) +
					  Math.abs(player.getY() - this.getY());

		if(offsets === 1) {
			if(this.hasComponent('Attacker')) {
				this.attack(player);
				return;
			}
		}

		// Generate the path and move to the first tile
		var source = this;
		var path = new ROT.Path.AStar(player.getX(), player.getY(), function(x, y) {
			// If entity is present at the tile, cannot move there
			var entity = source.getMap().getEntityAt(x, y);
			if(entity && entity !== player && entity !== source) {
				return false;
			}

			return source.getMap().getTile(x, y).isWalkable();
		}, {topology: 4});

		// Once we've gotten the path, we want to move to the second cell
		// that is passed in the callbback (first is the entitys starting point)
		var count = 0;
		path.compute(source.getX(), source.getY(), function(x, y) {
			if(count === 1) {
				source.tryMove(x, y);
			}
			count++;
		});
	},
	wander: function() {

		console.log(this.name + ' starts to wander');

		// Flip coin to determine if moving by 1 in the positive or neg direction
		var moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;
		// Flip coin to determine if moving in x direction or y direction
		if(Math.round(Math.random()) === 1) {
			this.tryMove(this.getX() + moveOffset, this.getY());
		} else {
			this.tryMove(this.getX(), this.getY() + moveOffset);
		}
	}
}

Lootr.EntityComponents.Sight = {
	name: 'Sight',
	groupName: 'Sight',
	init: function(template) {
		this._sightRadius = template['sightRadius'] || 5;
	},
	getSightRadius: function() {
		return this._sightRadius;
	},
	increaseSightRadius: function(value) {
		// If no value default to 1
		value = value || 1;

		this._sightRadius += value;
		Lootr.sendMessage(this, 'You can see better');
	},
	canSee: function(entity) {
		// if not on the same map then exit early
		if(!entity || this._map !== entity.getMap()) {
			return false;
		}

		var otherX = entity.getX();
		var otherY = entity.getY();

		// If we are not in the square field of view, then we wont
		// be in a real field of view either
		if((otherX - this._x) * (otherX - this._x) +
		   (otherY - this._y) * (otherY - this._y) >
		   this._sightRadius * this._sightRadius) {
			return false;
		}

		// Computer the FOV and check if the coords are in there
		var found = false;
		this.getMap().getFov().compute(
			this.getX(), this.getY(),
			this.getSightRadius(),
			function(x, y, radius, visibility) {
				if(x === otherX && y === otherY) {
					found = true;
				}
			});

		return found;
	}
};

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

Lootr.EntityComponents.Equipper = {
	name: 'Equipper',
	init: function(template) {
		this._weapon = null;
		this._armor = null;
	},
	wield: function(item) {
		this._weapon = item;
	},
	unwield: function() {
		this._weapon = null;
	},
	wear: function(item) {
		this._armor = item;
	},
	takeOff: function() {
		this._armor = null;
	},
	getWeapon: function() {
		return this._weapon;
	},
	getArmor: function() {
		return this._armor;
	},
	unequip: function(item) {
		// Help function to be called before getting rid of an item
		if(this._weapon === item) {
			this.unwield();
		}

		if(this._armor === item) {
			this.takeOff();
		}
	}
};

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

			// Give the attacker experience points
			if(attacker.hasComponent('ExperienceGainer')) {
				var exp = this.getMaxHp() + this.getDefenseValue();
				if(this.hasComponent('Attacker')) {
					exp += this.getAttackValue();
				}

				// Account for level diffs
				if(this.hasComponent('ExperienceGainer')) {
					exp -= (attacker.getLevel() - this.getLevel()) * 3;
				}

				// Only give experience if more than 0
				if(exp > 0) {
					attacker.giveExperience(exp);
				}
			}
		}
	},
	setHp: function(hp) {
		this._hp = hp;
	},
	getHp: function() {
		return this._hp;
	},
	getMaxHp: function() {
		return this._maxHp;
	},
	getDefenseValue: function() {
		var mod = 0;

		// If we can equip items, then have to take into
		// consideration weapon and armor
		if(this.hasComponent(Lootr.EntityComponents.Equipper)) {
			if(this.getWeapon()) {
				mod += this.getWeapon().getAttackValue();
			}
			if(this.getArmor()) {
				mod += this.getArmor().getAttackValue();
			}
		}

		return this._defense + mod;
	},
	increaseDefenseValue: function(value) {
		// if no value was passed, defualt to 2
		value = value || 2;

		// Add to the defense
		this._defense += value;
		Lootr.sendMessage(this, 'You look tougher');
	},
	increaseMaxHp: function(value) {
		// if no value was passed, default to 10
		value = value || 10;

		// Add to maxHp
		this._maxHp += value;
		Lootr.sendMessage(this, 'You look healthier');
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

		// If we can equip items, then make sure we unequip the item we are removing
		if(this._items[i] && this.hasComponent(Lootr.EntityComponents.Equipper)) {
			this.unequip(this._items[i]);
		}

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

Lootr.EntityComponents.RandomStatGainer = {
	name: 'RandomStatGainer',
	groupName: 'StatGainer',
	onGainLevel: function() {
		var statOptions = this.getStatOptions();

		// Randomly select a stat option and execute the callback for each stat point
		while( this.getStatPoints() > 0 ) {
			// Call the stat increasing function with this as the context
			statOptions.random()[1].call(this);
			this.setStatPoints(this.getStatPoints() - 1);
		}
	}
};

Lootr.EntityComponents.PlayerStatGainer = {
	name: 'PlayerStatGainer',
	groupName: 'StatGainer',
	onGainLevel: function() {
		// Setup the gain stat screen and show it
		Lootr.Screen.gainStatScreen.setup(this);
		Lootr.Screen.playScreen.setSubScreen(Lootr.Screen.gainStatScreen);
	}
};

Lootr.EntityComponents.ExperienceGainer = {
	name: 'ExperienceGainer',
	init: function(template) {
		this._level = template['level'] || 1;
		this._experience = template['experience'] || 0;
		this._statPointsPerLevel = template['statPointsPerLevel'] || 1;
		this._statPoints = 0;

		// Determine what stats can be leveld up
		this._statOptions = [];
		if(this.hasComponent('Attacker')) {
			this._statOptions.push(['Increase attack value', this.increaseAttackValue]);
		}
		if(this.hasComponent('Destructible')) {
			this._statOptions.push(['Increase defense value', this.increaseDefenseValue]);
			this._statOptions.push(['Increase max health', this.increaseMaxHp]);
		}
		if(this.hasComponent('Sight')) {
			this._statOptions.push(['Increase sight radius', this.increaseSightRadius]);
		}
	},
	getLevel: function() {
		return this._level;
	},
	getExperience: function() {
		return this._experience;
	},
	getNextLevelExperience: function() {
		return (this._level * this._level) * 10;
	},
	getStatPoints: function() {
		return this._statPoints;
	},
	setStatPoints: function(statPoints) {
		this._statPoints = statPoints;
	},
	getStatOptions: function() {
		return this._statOptions;
	},
	giveExperience: function(points) {
		var statPointsGained = 0;
		var levelsGained = 0;

		// loop until we have allocated all points
		while (points>0) {
			// Check if adding the points will surpass the leve threshold
			if(this._experience + points >= this.getNextLevelExperience()) {
				// Fill our experience till the next threshold
				var usedPoints = this.getNextLevelExperience() - this._experience;
				points -= usedPoints;
				this._experience += usedPoints;

				// Level up our entity
				this._level++
				levelsGained++;
				this._statPoints += this._statPointsPerLevel;
				statPointsGained += this._statPointsPerLevel;
			} else {
				// Simple case - just give the exp
				this._experience += points;
				points = 0;
			}
		}

		// Check if we gained at leave one level
		if(levelsGained > 0) {
			Lootr.sendMessage(this, 'You advanced to level %d', [this._level]);

			// Heal entity if possible
			if(this.hasComponent('Destructible')) {
				this.setHp(this.getMaxHp());
			}

			// Update stat
			if(this.hasComponent('StatGainer')) {
				this.onGainLevel();
			}
		}
	}
};

Lootr.EntityComponents.Attacker = {
	name: 'Attacker',
	groupName: 'Attacker',
	init: function(template) {
		this._attack = template['attack'] || 1;
	},
	attack: function(target) {

		// If the target is destructible, calc damage based on attack and def
		if(target.hasComponent('Destructible')) {
			var attack = this.getAttackValue();
			var target_def = target.getDefenseValue();
			var max = Math.max(0, attack - target_def);
			var damage = 1 + Math.floor(Math.random() * max);

			Lootr.sendMessage(this, 'You strike the %s for %d damage!', [target.getName(), damage]);
			Lootr.sendMessage(target, 'The %s strikes you for %d damage!', [this.getName(), damage]);

			target.takeDamage(this, damage);
		}
	},
	getAttackValue: function() {
		var mod = 0;
		// If we can equip items, then have to take into
		// consideration weapon and armor
		if(this.hasComponent(Lootr.EntityComponents.Equipper)) {
			if(this.getWeapon()) {
				mod += this.getWeapon().getAttackValue();
			}
			if(this.getArmor()) {
				mod += this.getArmor().getAttackValue();
			}
		}

		return this._attack + mod;
	},
	increaseAttackValue: function(value) {
		// If no value, defaultt o 2
		value = value || 2;

		// Add attack to value
		this._attack += value;
		Lootr.sendMessage(this, 'You look stronger');
	}
};

Lootr.EntityComponents = {};

Lootr.EntityComponents.Moveable = {
	name: 'Moveable',
	groupName: 'Moveable',
}

Lootr.EntityComponents.Orbs = {
	name: 'Orbs',
	groupName: 'Orbs',
	init: function(template) {
		this._redOrb = template['red'] || false;
		this._blueOrb = false;
		this._greenOrb = false;
		this._yellowOrb = false;
	},
	hasOrbs: function() {
		var orbs = {
			red: this._redOrb,
			blue: this._blueOrb,
			green: this._greenOrb,
			yellow: this._yellowOrb
		};

		return orbs;
	},
	listeners: {
		onPickup: function(orb) {						
			if(orb.name == "Red Orb") {
				this._redOrb = true;
			}
		}
	}
};

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
				// if task doesnt end turn, run it and go to the next, else finish turn
				var ends = this._tasks[i] + 'EndsTurn';
				if(!this[ends]) {
					this[this._tasks[i]]();
					continue;
				} else {
					this[this._tasks[i]]();
					return;
				}
			}
		}
	},
	canDoTask: function(task) {
		switch(task) {
			case 'hunt':
				return this.hasComponent('Sight') && this.canSee(this.getMap().getPlayer());
			case 'wander':
				return this.hasComponent('Wander');
			case 'leaveTrail':
				return this.hasComponent('LeaveTrail');
			case 'corpseEater':
				return this.hasComponent('CorpseEater') && this.getMap().tileContainsItem(this.getX(), this.getY(), 'corpse');
			case 'spawnEntity':
				return this.hasComponent('SpawnEntity') && Math.round(Math.random() * 100) <= 10;
			case 'growArm':
				return this.hasComponent('GrowArm') && this.getHp() <= 20 && !this._hasGrownArm;
			case 'fireSpread':
				return this.hasComponent('FireSpread');
			case 'breathFire':
				return this.hasComponent('FireBreather') &&
					   Math.round(Math.random() * 100) <= 10 &&
					   this.hasComponent('Sight') &&
					   this.canSee(this.getMap().getPlayer());
			default:
				throw new Error('Tried to perform undefined task ' + task);
		}
	}
}

Lootr.EntityComponents.Flight = {
	name: 'Flight',
	init: function(template) {
		this._isFlying = template['isFlying'] || false;
	},
	land: function() {

		if(this.getMap().isTileItemSpawnable(this.getX(), this.getY())) {
			Lootr.sendMessage(this, 'You land on the ground.');
			Lootr.sendMessage(this, 'You slow down.');
			this._isFlying = false;
			this.modifySpeedBy(-50);
			this.setForeground(this.getOriginalForeground());	
		} else {
			Lootr.sendMessage(this, 'You cannot land here.');
		}		
	},
	fly: function() {

		Lootr.sendMessage(this, 'You start to fly.');
		Lootr.sendMessage(this, 'You speed up.');
		this._isFlying = true;
		this.modifySpeedBy(50);
		this.setForeground('lightblue');
	},
	isFlying: function() {
		return this._isFlying;
	},
	listeners: {
		onHit: function() {						
			// If entity is hit while invisible, make him visible
			if(this.isFlying()) {
				this.land();
			}
		}
	}
};

Lootr.EntityComponents.Invisiblity = {
	name: 'Invisiblity',
	init: function(template) {
		this._isInvisible = template['isInvisible'] || false;		
	},
	turnInvisible: function() {
		this._isInvisible = true;
		Lootr.sendMessage(this, 'You fade away.');
		this.setForeground('gray');
	},
	turnVisible: function() {
		this._isInvisible = false;
		Lootr.sendMessage(this, 'You slowly reappear.');
		this.setForeground(this.getOriginalForeground());
	},
	isInvisible: function() {
		return this._isInvisible;
	},
	listeners: {
		onHit: function() {						
			// If entity is hit while invisible, make him visible
			if(this.isInvisible()) {
				this.turnVisible();
			}			
		}
	}
};

Lootr.EntityComponents.FireBreather = {
	name: 'FireBreather',
	breathFire: function() {

		var offset = (Math.round(Math.random()) === 1) ? 1 : -1

		if(this.getMap().isTileWithoutEntity(this.getX(), this.getY() + offset)) {
			var fire1 = Lootr.EntityRepository.create('fire');			
			this.getMap().addEntityAt(this.getX(), this.getY()+offset, fire1);
		}
		
		if(this.getMap().isTileWithoutEntity(this.getX(), this.getY() + ++offset )) {
			var fire2 = Lootr.EntityRepository.create('fire');
			this.getMap().addEntityAt(this.getX(), this.getY()+offset, fire2);
		}
	},
	breathFireEndsTurn: true
};

Lootr.EntityComponents.Wander = {
	name: 'Wander',
	wander: function() {
		// Flip coin to determine if moving by 1 in the positive or neg direction
		var moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;
		// Flip coin to determine if moving in x direction or y direction
		if(Math.round(Math.random()) === 1) {
			this.tryMove(this.getX() + moveOffset, this.getY());
		} else {
			this.tryMove(this.getX(), this.getY() + moveOffset);
		}
	},
	wanderEndsTurn: true
};

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

		// Check if entity is invisible
		if(entity.hasComponent('Invisiblity')) {
			if(entity.isInvisible()) {
				return false;
			}	
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
};

Lootr.EntityComponents.HuntPlayer = {
	name: 'HuntPlayer',
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
	huntEndsTurn: true
};

Lootr.EntityComponents.GoldHolder = {
	name: 'GoldHolder',
	init: function(template) {
		this._gold = template['gold'] || 0;
	},
	getGold: function() {
		return this._gold;
	},
	modifyGoldBy: function(amount) {
		this._gold += amount;
	},
	listeners: {
		onPickup: function(amount) {
			this.modifyGoldBy(amount);
		},
		onDeath: function() {
			var g = Lootr.ItemRepository.create('gold');	
			g.modifyGoldBy(this._gold);
			this.getMap().addItem(this.getX(), this.getY(), g);
		}
	}
};

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
        var result = "";

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
	listeners: {
		onDeath: function(attacker) {
			// Check if we should drop a corpse
			if(Math.round(Math.random() * 100) <= this._corpseDropRate) {
				// Create a new corpse item and drop it.
				this._map.addItem(this.getX(), this.getY(), Lootr.ItemRepository.create('corpse', {
					name: this._name + ' corpse', foreground: this.getForeground()
				}));
			}
		}
	}
};

Lootr.EntityComponents.Equipper = {
	name: 'Equipper',
	init: function(template) {
		this._weapon = null;
		this._armor = null;
		this._head = null;
	},
	wield: function(item) {
		this._weapon = item;
	},
	unwield: function() {
		this._weapon = null;
	},
	wear: function(item) {
		/*if(item._slot == Lootr.ITEM_SLOTS.BODY) {
			this._armor = item;	
		} else if(item._slot == Lootr.ITEM_SLOTS.HEAD) {
			this._head = item;
		}		*/

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

		// Raise onHit event to victim
		this.raiseEvent('onHit', this);

		// If less than 1 hp, remove ourselves
		if(this._hp < 1) {
			Lootr.sendMessage(attacker, 'You kill the %s', [this.getName()]);

			// Raise Events
			this.raiseEvent('onDeath', attacker);
			attacker.raiseEvent('onKill', this);
			this.kill();
		}
	},
	setHp: function(hp) {
		this._hp = hp;
	},
	modifyHpBy: function(points) {
		this._hp = this._hp + points;

		if(this._hp > this._maxHp) {
			this._hp = this._maxHp;
		}
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
	},
	listeners: {
		onGainLevel: function() {
			// Heal the entity
			this.setHp(this.getMaxHp());
		},
		details: function() {
			return [
				{key: 'defense', value: this.getDefenseValue()},
				{key: 'hp', value: this.getHp()}
			];
		}
	}
};

Lootr.EntityComponents.CorpseEater = {
	name: 'CorpseEater',
	corpseEater: function() {

		if(this.hasComponent('Attacker')) {
			// Gets stronger
			this.increaseAttackValue(5);
		}

		// Remove Corpse
		this.getMap().removeItemFromTile(this.getX(), this.getY(), 'corpse');

		// Send a message to player
		Lootr.sendMessageNearby(this.getMap(), this.getX(), this.getY(), 'A corpse has been consumed.');
	},
	corpseEaterEndsTurn: true
};

Lootr.EntityComponents.GrowArm = {
	name: 'GrowArm',
	init: function() {
		this._hasGrownArm = false;
	},
	growArm: function() {
		this._hasGrownArm = true;
		this.increaseAttackValue(5);

		// Send a message to player
		Lootr.sendMessageNearby(this.getMap(), this.getX(), this.getY(), 'An extra arm appears..');
	},
	growArmEndsTurn: true
};

Lootr.EntityComponents.SpawnEntity = {
	name: 'SpawnEntity',
	init: function(template) {
		this._spawnEntityType = template['spawnEntityType'] || 'slime';
	},
	spawnEntity: function() {
		// Generate a random empty position
		var xOffSet = Math.floor(Math.random() * 3) - 1;
		var yOffSet = Math.floor(Math.random() * 3) - 1;

		// Check if we can spawn an entity at that position
		if(!this.getMap().isTileEmptyFloor(this.getX() + xOffSet, this.getY() + yOffSet)) {
			return;
		}

		// Create the entity
		var entity = Lootr.EntityRepository.create(this._spawnEntityType);
		entity.setX(this.getX() + xOffSet);
		entity.setY(this.getY() + yOffSet);
		this.getMap().addEntity(entity);
	},
	spawnEntityEndsTurn: true
};

Lootr.EntityComponents.SpiderNestActor = {
	name: 'SpiderNestActor',
	groupName: 'Actor',
	init: function() {
		this._hasSpawned = false;
		this._spawnAmount = 8;
	},
	act: function() {
		// See if we have already spawned
		if(!this._hasSpawned) {
			if(Math.random() <= 0.20) {
				this._hasSpawned = true;

				while(this._spawnAmount > 0) {
					// Generate the coordinates of a random adjacent square
					// by generating an offset between [-1, 0, 1] for both
					// the x and y. to do this we get a number from 0-2 and then sub 1
					var xOffSet = Math.floor(Math.random() * 3);
					var yOffSet = Math.floor(Math.random() * 3);

					// Make sure we arent trying to spawn on the same tile
					if(xOffSet != 0 && yOffSet != 0) {
						// check if we can actually grow at location
						if(this.getMap().isTileEmptyFloor(this.getX() + xOffSet, this.getY() + yOffSet)) {
							var entity = Lootr.EntityRepository.create('spider');
							entity.setX(this.getX() + xOffSet);
							entity.setY(this.getY() + yOffSet);

							this.getMap().addEntity(entity);
						}
					}

					// Decrement regardless incase of walls/items
					this._spawnAmount--;
				}

				// Send a message nearby
				Lootr.sendMessageNearby(this.getMap(), this.getX(), this.getY(), 'A nest breaks..');

				// Remove entity
				this.kill();
			}
		}
	}
};

Lootr.EntityComponents.LeaveTrail = {
	name: 'LeaveTrail',
	init: function(template) {
		this._trailColor = template['trailColor'] || 'lightgreen';
	},
	leaveTrail: function() {
		var tile = this.getMap().getTile(this.getX(), this.getY());

        var fc = ROT.Color.fromString(tile.getForeground());
        var sc = ROT.Color.fromString(this._trailColor);
        var c = ROT.Color.multiply(fc, sc);
        tile.setForeground(c);

        return;
	},
	leaveTrailEndsTurn: false
};

Lootr.EntityComponents.PassThroughWalls = {
	name: 'PassThroughWalls'
}

Lootr.EntityComponents.FireSpread = {
	name: 'FireSpread',
	init: function() {
		this._fuelRemaining = 100;
	},
	modifyFuelBy: function(amount) {
		this._fuelRemaining += amount;
	},
	getFireColor: function() {
		var c = this.getForeground();
		if(!(c instanceof Array)) {
			var c = ROT.Color.fromString(c);
		}

		if(Math.random() * 1 > 0.98) {
			this.setForeground('white');
			return;
		}

		if(Math.random() * 1 > 0.9) {
			this.setForeground('maroon');
			return;
		}

		// Check for full yellow
		if(c[1] == 255) {
			var s = ROT.Color.fromString('red');
		} else {
			var s = ROT.Color.fromString('yellow');
		}

		var i = ROT.Color.interpolate(s, c, 0.2);
		this.setForeground(i)	;
		//var h = ROT.Color.toHex(i);
		//this._foreground = h;
	},
	setFireColor: function(color) {
		this.setForeground(color);
	},
	fireSpread: function() {
		// Check if we grow this turn
		if(this._fuelRemaining > 0) {

			// Update fire look
			this.getFireColor();

			if(Math.random() <= 0.42) {
				// Generate the coordinates of a random adjacent square
				// by generating an offset between [-1, 0, 1] for both
				// the x and y. to do this we get a number from 0-2
				var xOffSet = Math.floor(Math.random() * 3);
				var yOffSet = Math.floor(Math.random() * 3);

				// Make sure we arent trying to spawn on the same tile
				if(xOffSet != 0 && yOffSet != 0) {

					// Check if tile has an entity with Destructbile

					// check if tile has a corpse
					if(this.getMap().tileContainsItem(this.getX() + xOffSet, this.getY() + yOffSet, 'corpse')) {

						var that = this;

						// Remove corpse
						this.getMap().removeItemFromTile(this.getX() + xOffSet, this.getY() + yOffSet, 'corpse');

						// Create new fire entity
						var entity = Lootr.EntityRepository.create('fire');

						// Give the fire a stoke
						entity.setFireColor('royalblue');

						// Add fuel
						entity.modifyFuelBy(50);

						// Place it into new tile spot
						this.getMap().addEntityAt(this.getX() + xOffSet, this.getY() + yOffSet, entity);

						// Send a message nearby
						Lootr.sendMessageNearby(this.getMap(), entity.getX(), entity.getY(), 'The fire grows brightly!');
					}

					// check if we can actually grow at location
					//else if (this.getMap().isTileEmptyFloor(this.getX() + xOffSet, this.getY() + yOffSet)) {
					else if (this.getMap().isTileWithoutEntity(this.getX() + xOffSet, this.getY() + yOffSet)) {

						var entity = Lootr.EntityRepository.create('fire');
						this.getMap().addEntityAt(this.getX() + xOffSet, this.getY() + yOffSet, entity);

						// Send a message nearby
						Lootr.sendMessageNearby(this.getMap(), entity.getX(), entity.getY(), 'The fire grows.');
					}
				}
			}

			// Always losing fuel
			this._fuelRemaining--;
		} else {
			this.kill();

			// Scorch tile
			var tile = this.getMap().getTile(this.getX(), this.getY());
			var fc = ROT.Color.fromString(tile.getForeground());
            var sc = ROT.Color.fromString('slategray');
            var c = ROT.Color.multiply(fc, sc);
            var d = ROT.Color.multiply(c, sc);
            tile._foreground = ROT.Color.toHex(d);
		}
	},
	fireSpreadEndsTurn: true
};

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
				var xOffSet = Math.floor(Math.random() * 3);
				var yOffSet = Math.floor(Math.random() * 3);

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

				Lootr.sendMessage(this, 'You drop %s', [this._items[i].describeA()]);
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
	listeners: {
		onGainLevel: function() {
			var statOptions = this.getStatOptions();

			// Randomly select a stat option and execute the callback for each stat point
			while( this.getStatPoints() > 0 ) {
				// Call the stat increasing function with this as the context
				statOptions.random()[1].call(this);
				this.setStatPoints(this.getStatPoints() - 1);
			}
		}
	}
};

Lootr.EntityComponents.PlayerStatGainer = {
	name: 'PlayerStatGainer',
	groupName: 'StatGainer',
	listeners: {
		onGainLevel: function() {
			// Setup the gain stat screen and show it
			Lootr.Screen.gainStatScreen.setup(this);
			Lootr.Screen.playScreen.setSubScreen(Lootr.Screen.gainStatScreen);
		}
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

			this.raiseEvent('onGainLevel');
		}
	},
	listeners: {
		onKill: function(victim) {
			var exp = victim.getMaxHp() + victim.getDefenseValue();
			if(victim.hasComponent('Attacker')) {
				exp += victim.getAttackValue();
			}

			// Account for level diffs
			if(victim.hasComponent('ExperienceGainer')) {
				exp -= (this.getLevel() - victim.getLevel()) * 3;
			}

			// Only give if more than 0
			if(exp > 0) {
				this.giveExperience(exp);
			}
		},
		details: function() {
			return [{key: 'level', value: this.getLevel()}];
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

			// Make stuff blooooddyyyy
			target.getMap().bloodyTile(target.getX(), target.getY());
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
	},
	listeners: {
		details: function() {
			return [{key: 'attack', value: this.getAttackValue()}];
		}
	}
};


Lootr.Entity = function(args) {
	args = args || {};

	// Call the DynamicGlyphs constructor
	Lootr.DynamicGlyph.call(this, args);

	this._alive = true;

	// Set properties passed from args
	this._name = args['name'] || '';
	this._x = args['x'] || 0;
	this._y = args['y'] || 0;
	// Actin speed
	this._speed = args['speed'] || 1000;
	this._map = null;
}

// Inhert all from Glyph
Lootr.Entity.extend(Lootr.DynamicGlyph);


Lootr.Entity.prototype.switchMap = function(newMap) {
	// If it's the same map, do nothing
	if(newMap === this.getMap()) {
		return;
	}

	this.getMap().removeEntity(this);

	// Clear the position
	this._x = 0;
	this._y = 0;

	// Add to the new map
	newMap.addEntity(this);
};

Lootr.Entity.prototype.isAlive = function() {
	return this._alive;
};

Lootr.Entity.prototype.kill = function(message) {
	// Only kill one
	if(!this._alive) {
		return;
	}

	this._alive = false;
	if(message) {
		Lootr.sendMessage(this, message);		
	} else {
		Lootr.sendMessage(this, "You have died!!");
	}

	// Check if the player died, and if so call their act method to prompt the user
	if(this.hasComponent(Lootr.EntityComponents.PlayerActor)) {
		this.act();
	} else {
		this.getMap().removeEntity(this);
	}
}

Lootr.Entity.prototype.tryMove = function(x, y) {
	var map = this.getMap();
	var tile = map.getTile(x, y);
	var target = map.getEntityAt(x, y);

	// If an entity was present at the tile
	if(target) {
		// this can attack
		if(this.hasComponent('Attacker') &&
		  // One of the entities is the player
		  (this.hasComponent(Lootr.EntityComponents.PlayerActor) || target.hasComponent(Lootr.EntityComponents.PlayerActor)) &&
		  // Whatever is being hit has destructible
		  target.hasComponent(Lootr.EntityComponents.Destructible)) {
			this.attack(target);
			return true;
		} else {
			// we cannot attack and cannot move
			Lootr.sendMessage(this, 'You bump into something.');
			return false;
		}
	}	

	// Check if we found the cave
	else if(tile.getDescription() === Lootr.Tile.holeToCaveTile.description && this.hasComponent(Lootr.EntityComponents.PlayerActor)) {
		// Switch the entity to the boss canern
		this.switchMap(new Lootr.Map.Cave(this));
	}	

	// Check if we found the cave
	else if(tile.getDescription() === Lootr.Tile.holeToDesertTile.description && this.hasComponent(Lootr.EntityComponents.PlayerActor)) {
		// Switch the entity to the boss canern
		this.switchMap(new Lootr.Map.Desert(this));
	}		

	// check if tile is not ground (a wall) and have PassThroughWalls
	else if (!tile.isGround() && this.hasComponent('PassThroughWalls')) {
		// update the entitys position

		// Make sure the entitys position is within bounds
		if(x < 0 || x >= this.getMap()._width ||
		   y < 0 || y >= this.getMap()._height) {
			return false;
		}

		// If we are inbounds, update pos.
		this.setPosition(x, y);
	}


	// Check if we are standing on gold
	else if(tile.isWalkable() && this.hasComponent(Lootr.EntityComponents.GoldHolder) && map.tileContainsItem(x, y, 'gold')) {
		// update the entitys position
		this.setPosition(x, y);

		// Add gold
		this.modifyGoldBy(1);

		// Notify of the pickup
		Lootr.sendMessage(this, 'You pickup some gold');

		// Remove it from game
		map.removeItemFromTile(x, y, 'gold');
	}

	// Check for trap
	else if(tile.isWalkable() && map.tileContainsItem(x, y, 'spike trap') && !this.hasComponent('Flight')) {
		var trap = map.getItemsAt(x, y, 'spike trap');

		// update the entitys position
		this.setPosition(x, y);

		// Trap will spring, updating the tile character
		// damaging entity
		// sending messing		
		trap[0].springTrap(this);

		return true;
	}

	// Check for GROUND tile while having flight
	else if(tile.isGround() && this.hasComponent('Flight') && this.isFlying()) {
		// update the entitys position
		this.setPosition(x, y);

		return true;
	}

	// check if we can walk on the tile if so, walk onto it
	else if(tile.isWalkable()) {
		// update the entitys position
		this.setPosition(x, y);

		// Notify entity if they are standing on items
		var items = this.getMap().getItemsAt(x, y);
		if(items) {
			if(items.length === 1) {
				Lootr.sendMessage(this, 'You see %s', [items[0].describeA()]);
			} else {
				Lootr.sendMessage(this, 'There are several object here..');
			}
		}
		return true;

	// check if tile is diggable and if so dig it
	} else if (tile.isDiggable()) {
		if(this.hasComponent(Lootr.EntityComponents.PlayerActor)) {
			map.dig(x, y);
			return true;	
		}		

		return false;
	}	

	return false;
};

Lootr.Entity.prototype.setPosition = function(x, y) {
	var oldX = this._x;
	var oldY = this._y;

	// Update pos
	this._x = x;
	this._y = y;

	// If entity is on the map, notify map the entity has moved
	if(this._map) {
		this._map.updateEntityPosition(this, oldX, oldY);
	}
};

Lootr.Entity.prototype.setSpeed = function(speed) {
	this._speed = speed;
};

Lootr.Entity.prototype.modifySpeedBy = function(amount) {
	this._speed += amount;
};

Lootr.Entity.prototype.getSpeed = function() {
	return this._speed;
};

Lootr.Entity.prototype.setMap = function(map) {
	this._map = map;
};

Lootr.Entity.prototype.getMap = function() {
	return this._map;
};

Lootr.Entity.prototype.setX = function(x) {
	this._x = x;
};

Lootr.Entity.prototype.setY = function(y) {
	this._y	= y;
};

Lootr.Entity.prototype.getX = function() {
	return this._x;
};

Lootr.Entity.prototype.getY = function() {
	return this._y;
};



Lootr.Entity = function(args) {
	args = args || {};

	// Call the DynamicGlyphs constructor
	Lootr.DynamicGlyph.call(this, args);

	this._alive = true;

	// Set properties passed from args
	this._name = args['name'] || '';
	this._x = args['x'] || 0;
	this._y = args['y'] || 0;
	this._map = null;
}

// Inhert all from Glyph
Lootr.Entity.extend(Lootr.DynamicGlyph);

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
		// An entity can only attack if the entity has the attack component
		// and either the target or the target is the player
		if(this.hasComponent('Attacker') &&
			(this.hasComponent(Lootr.EntityComponents.PlayerActor) || target.hasComponent(Lootr.EntityComponents.PlayerActor))) {
			this.attack(target);
			return true;
		}
			// we cannot attack and cannot move
			return false;
	} 
	// check if we can walk on the tile
	// if so, walk onto it
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


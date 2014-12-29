
Lootr.Map = function(tiles, player) {
	this._tiles = tiles;
	// Cache the width and height based
	// on length of the dimensions of the tiles array
	this._width = tiles.length;
	this._height = tiles[0].length;

	// Create a table to hold entities
	this._entities = {};

	// Crate a table to hold items
	this._items = {};

	// Setup the field of vision
	this._fov = null;
	this.setupFov();

	// Setup explored array
	this._explored = new Array();
	this.setupExploredArray();

	// Create an engine and scheduler
	this._scheduler = new ROT.Scheduler.Simple();
	this._engine = new ROT.Engine(this._scheduler);

	// Add the player
	this.addEntityAtRandomPosition(player);

	// Add random entities
	for(var i=0; i<500; i++) {
		this.addEntityAtRandomPosition(Lootr.EntityRepository.createRandom());
	}	

	// Add random items
	for(var i=0; i<1500; i++) {
		this.addItemAtRandomPosition(Lootr.ItemRepository.createRandom());
	}
};

Lootr.Map.prototype.getItemsAt = function(x, y) {
	return this._items[x + ',' + y];
};

Lootr.Map.prototype.setItemsAt = function(x, y, items) {
	// If our items array si empty then delete the key from table
	var key = x + ',' + y;
	if(items.length === 0) {
		if(this._items[key]) {
			delete this._items[key];
		}
	} else {
		// Simple update the items at that key
		this._items[key] = items;
	}
};

Lootr.Map.prototype.addItem = function(x, y, item) {
	// If we already have items at that position, simply append the item to the list
	var key = x + ',' + y;
	if(this._items[key] == item) {
		this._items[key].push(item);
	} else {
		this._items[key] = [item];
	}
};

Lootr.Map.prototype.addItemAtRandomPosition = function(item) {
	var pos = this.getRandomFloorPosition();
	this.addItem(pos.x, pos.y, item);
};

Lootr.Map.prototype.setupExploredArray = function() {
	for(var x = 0; x < this._width; x++) {
        this._explored[x] = new Array(this._height);
        for (var y = 0; y < this._height; y++) {
            this._explored[x][y] = false;
        }
    }
};

Lootr.Map.prototype.isExplored = function(x, y) {
	// Only return the value if within bounds
	if(this.getTile(x, y) !== Lootr.Tile.nullTile) {
		return this._explored[x][y];		
	} else {
		return false;
	}
};

Lootr.Map.prototype.setExplored = function(x, y, state) {
	// Only update if the tile is within bounds
	if(this.getTile(x, y) !== Lootr.Tile.nullTile) {
		this._explored[x][y] = state;
	}
};

Lootr.Map.prototype.setupFov = function() {
	// keep this in 'map' varaiable so that we dont lose it
	var map = this;
	//var lightData = {};

	// Function to determine if x, y is blockinglight
	var lightPasses = function(x, y) {
		if(map.getTile(x, y).isBlockingLight()) {
			return false;
		} else {
			return true;
		}
	};

	map._fov = new ROT.FOV.DiscreteShadowcasting(lightPasses, {topology: 4});

	/*var reflectivity = function(x, y) {
		return(map.getTile(x, y).isBlockingLight() == true ? 0.3 : 0);
	}

	// Lighting
	var lighting = new ROT.Lighting(reflectivity, {range: 12, passes: 2});
	lighting.setFOV(map._fov);
	lighting.setLight(12, 12, [240, 240, 30]);
	lighting.setLight(20, 20, [240, 60, 60]);
	lighting.setLight(45, 25, [200, 200, 200]);

	var lightingCallback = function(x, y, color) {
		lightData[x + ',' y] = color;
	}

	lighting.computer(lightingCallback);*/
};

Lootr.Map.prototype.getFov = function() {
	return this._fov;
};

Lootr.Map.prototype.addEntity = function(entity) {
	// Update the entitys map
	entity.setMap(this);

	// Update the map with the entities pos
	this.updateEntityPosition(entity);

	// Check if this entity is an actor, if so add to scheduler
	if(entity.hasComponent('Actor')) {
		this._scheduler.add(entity, true);
	}
};

Lootr.Map.prototype.removeEntity = function(entity) {
	var key = entity.getX() + ',' + entity.getY();
	if(this._entities[key] == entity) {
		delete this._entities[key];
	}

	// If the entity is an Actor, remove from scheduler
	if(entity.hasComponent('Actor')) {
		this._scheduler.remove(entity);
	}
};

Lootr.Map.prototype.isTileEmptyFloor = function(x, y) {
	var tile = this.getTile(x, y);

	// If the tile is a floor and no entity is on the space
	if(tile == Lootr.Tile.floorTile && !this.getEntityAt(x, y)) {
		return true;
	}

	return false;
};

Lootr.Map.prototype.updateEntityPosition = function(entity, oldX, oldY) {
	// Delete the old key if it is the same entity and we have old pos.
	if(typeof oldX === 'number') {
		var oldKey = oldX + ',' + oldY;
		if(this._entities[oldKey] == entity) {
			delete this._entities[oldKey];
		}
	}

	// Make sure the entitys position is within bounds
	if(entity.getX() < 0 || entity.getX() >= this._width ||
	   entity.getY() < 0 || entity.getY() >= this._height) {
		throw new Error("Entitys position is out of bounds");
	}

	// Sanity Check to make sure there is no entity at new pos
	var key = entity.getX() + ',' + entity.getY();
	if(this._entities[key]) {
		throw new Error('Tried to add entity at an occupied position');
	}

	// Add the entity to the table of entities
	this._entities[key] = entity;
};

Lootr.Map.prototype.addEntityAtRandomPosition = function(entity) {
	var pos = this.getRandomFloorPosition();
	entity.setX(pos.x);
	entity.setY(pos.y);
	this.addEntity(entity);
};

Lootr.Map.prototype.getEngine = function() {
	return this._engine;
};

Lootr.Map.prototype.getEntities = function() {
	return this._entities;
};

Lootr.Map.prototype.getEntityAt = function(x, y) {

	// Get the entity based on position key
	return this._entities[x + ',' + y];
};

Lootr.Map.prototype.getEntitiesWithinRadius = function(centerX, centerY, radius) {
	var results = [];

	// Determine our bounds
	var leftX = centerX - radius;
	var rightX = centerX + radius;
	var topY = centerY - radius;
	var bottomY = centerY + radius;

	// Iterate through our entities, adding any that are within
	for(var key in this._entities) {
		var entity = this._entities[key];
		if(entity.getX() >= leftX && entity.getX() <= rightX &&
		   entity.getY() >= topY && entity.getY() <= bottomY) {
			results.push(entity);
		}
	}

	return results;
};

Lootr.Map.prototype.getWidth = function() {
	return this._width;
};

Lootr.Map.prototype.getHeight = function() {
	return this._height;
};

Lootr.Map.prototype.getTile = function(x, y) {
	// Make suer we are inside the bounds, otherwise return nullTile
	if( x < 0 || x >= this._width || y < 0 || y >= this._height) {
		return Lootr.Tile.nullTile;
	} else {
		return this._tiles[x][y] || Lootr.Tile.nullTile;
	}
};

Lootr.Map.prototype.dig = function(x, y) {
	// if the tile is diggable, update it to a floor
	if(this.getTile(x, y).isDiggable()) {
		this._tiles[x][y] = Lootr.Tile.floorTile;
	}
};

Lootr.Map.prototype.getRandomFloorPosition = function() {
	// Randomly generate a tile which is a floor
	var x, y;
	do {
		x = Math.floor(Math.random() * this._width);
		y = Math.floor(Math.random() * this._height);
	} while(!this.isTileEmptyFloor(x, y));
	return {x: x, y: y};
};
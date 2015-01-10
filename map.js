
Lootr.Map = function(tiles) {
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
	this._scheduler = new ROT.Scheduler.Speed();
	this._engine = new ROT.Engine(this._scheduler);
};

Lootr.Map.prototype.getPlayer = function() {
	return this._player;
};

Lootr.Map.prototype.setTile = function(tile, x, y) {
	this._tiles[x][y] = tile;

	return this;
};

Lootr.Map.prototype.getItemsAt = function(x, y) {
	var items = this._items[x + ',' + y];

	if(items != null) {
		return items;
	}

	return false;
};

Lootr.Map.prototype.isItemsAt = function(x, y) {
	var items = this.getItemsAt(x, y);

	return items;
};

Lootr.Map.prototype.tileContainsItem = function(x, y, item_name) {
	var items = this.getItemsAt(x, y);

	if(items) {
		for(var i=0; i<items.length; i++) {
			/*if(items[i].getName() == item_name) {*/
            // removed above to help capture things like 'rat corpse' when looking for just generic 'corpse'
			if(items[i].getName().indexOf(item_name) > -1) {
				return true;
			}
		}
	}

	return false;
}

Lootr.Map.prototype.removeItemFromTile = function(x, y, item_name) {
	var key = x + ',' + y;

	/*if(this._items[key] && this._items[key][0].getName() == item_name) {		*/
    // removed below to help capture things like 'rat corpse' when looking for just generic 'corpse'
	if(this._items[key] && (this._items[key][0].getName().indexOf(item_name) > -1)) {
		delete this._items[key];
		return;
	}
}

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
	/*var lightData = {};
	var mapData = {};*/

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
		return(mapData[x+','+y] == 1 ? 0.3 : 0);
	}
*/
	/*// Lighting
	var lighting = new ROT.Lighting(reflectivity, {range: 12, passes: 2});
	lighting.setFOV(map._fov);

	var pos = this.getRandomFloorPosition();
	lighting.setLight(pos.x, pos.y, [240, 240, 30]);

	var pos1 = this.getRandomFloorPosition();
	lighting.setLight(pos1.x, pos1.y, [240, 60, 60]);

	var lightingCallback = function(x, y, color) {
		lightData[x + ',' + y] = color;
	}

	lighting.compute(lightingCallback);

	var display = new ROT.Display({fontSize: 9});
	display.getContainer();

	 all cells are lit by ambient light; some are also lit by light sources
	var ambientLight = [100, 100, 100];
	for (var id in map) {
	    var parts = id.split(",");
	    var x = parseInt(parts[0]);
	    var y = parseInt(parts[1]);

	    var baseColor = (map[id] ? [100, 100, 100] : [50, 50, 50]);
	    var light = ambientLight;

	    if (id in lightData) { /* add light from our computation */
	       /* light = ROT.Color.add(light, lightData[id]);
	    }

	    var finalColor = ROT.Color.multiply(baseColor, light);
	    display.draw(x, y, null, null, ROT.Color.toRGB(finalColor));
	}*/
};

Lootr.Map.prototype.getFov = function() {
	return this._fov;
};

Lootr.Map.prototype.addEntityAt = function(x, y, entity) {

	if(this.isTileEmptyFloor(x, y)) {
		entity.setX(x);
		entity.setY(y);
		this.addEntity(entity);

		return true;
	}

	return false;
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

	// If the entity is the player, set the player
	if(entity.hasComponent(Lootr.EntityComponents.PlayerActor)) {
		this._player = entity;
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

	// If the entity is the player, update the player field
	if(entity.hasComponent(Lootr.EntityComponents.PlayerActor)) {
		this._player = undefined;
	}
};

Lootr.Map.prototype.isTileWithoutEntity = function(x, y) {
	var tile = this.getTile(x, y);

	return tile.isGround() && this.isEntityAt(x, y) == false;
};

Lootr.Map.prototype.isTileItemSpawnable = function(x, y) {
	var tile = this.getTile(x, y);

	if(!tile.isGround()) {
		return false;
	}

	return tile.isItemSpawnable();
}

Lootr.Map.prototype.isTileEmptyFloor = function(x, y) {
	var tile = this.getTile(x, y);

	return (!this.isEntityAt(x, y) && !this.isItemsAt(x, y) && this.isTileItemSpawnable(x, y));

	// If the tile is a floor and no entity is on the space
	/*if(tile.isGround() && !this.getEntityAt(x, y)) {
		return true;
	}

	return false;*/
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

Lootr.Map.prototype.isEntityAt = function(x, y) {
	var result = this.getEntityAt(x, y);

	if(result) {
		return true;
	}

	return false;
};

Lootr.Map.prototype.getEntityAt = function(x, y) {

	// Get the entity based on position key
	//return this._entities[x + ',' + y];

	var entity = this._entities[x + ',' + y];

	if(entity !== undefined) {
		return entity;
	}

	return false;
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

Lootr.Map.prototype.getRandomFloorPositionAroundTile = function(x, y) {

	var tileOptions = Lootr.getNeighborPositions(x, y);

	var tile = tileOptions.slice().pop();

	return tile;
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
		this._tiles[x][y] = new Lootr.Tile(Lootr.Tile.floorTile);
	}
};

Lootr.Map.prototype.bloodyTile = function(x, y) {
	var pos = this.getRandomFloorPositionAroundTile(x, y);
	var tile = this.getTile(pos.x, pos.y);

	 // make blooodddy
    var fc = ROT.Color.fromString(tile.getForeground());
    var sc = ROT.Color.fromString('salmon');
    var c = ROT.Color.multiply_(fc, sc);
    foreground = ROT.Color.toHex(c);
    tile._foreground = foreground;
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

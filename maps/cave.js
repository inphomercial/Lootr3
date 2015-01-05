
Lootr.Map.Cave = function(tiles, player) {
	// Call the Map constructor
	Lootr.Map.call(this, tiles);

	// Add the player
	this.addEntityAtRandomPosition(player);

	// Add random entities
	for(var i=0; i<150; i++) {
		var entity = Lootr.EntityRepository.createRandom();

		// Add a random entity
		this.addEntityAtRandomPosition(entity);
	}

	// Add random items
	for(var i=0; i<100; i++) {
		this.addItemAtRandomPosition(Lootr.ItemRepository.createRandom());
	}

	// Add weapons and armor to the map
	var templates = ['dagger', 'club'];
	
	for(var i=0; i<templates.length; i++) {
		this.addItemAtRandomPosition(Lootr.ItemRepository.create(templates[i]));
	}

	// Add a hole
	var holePosition = this.getRandomFloorPosition();
	//this._tiles[holePosition.x][holePosition.y] = Lootr.Tile.holeToCavernTile;
	this._tiles[player.getX() + 3][player.getY() + 3] = Lootr.Tile.holeToCavernTile;
};

Lootr.Map.Cave.extend(Lootr.Map);
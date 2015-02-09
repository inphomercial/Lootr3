
Lootr.Tile.nullTile = new Lootr.Tile({description: '(unknown)'});

Lootr.Tile.floorTile = {
	character: '.',	
	walkable: true,
	blocksLight: false,
	ground: true,
	description: 'A cave floor'
};

Lootr.Tile.wallTile = {
	character: '#',
	foreground: 'goldenrod',	
	diggable: true,
	description: 'A Cave wall'
};

Lootr.Tile.grassTile = {
	character: ',',	
	foreground: 'lightgreen',
	walkable: true,
	blocksLight: false,
	ground: true,
	description: 'Grass'
};

Lootr.Tile.shallowWaterTile = {
	character: '~',	
	foreground: 'lightblue',
	walkable: true,
	blocksLight: false,
	description: 'Shallow Water'
};

Lootr.Tile.roadTile = {
	character: '.',	
	foreground: 'grey',
	//background: 'slategray',
	walkable: true,
	blocksLight: false,
	description: 'Road path'
};

Lootr.Tile.bridgeTile = {
	character: '=',	
	foreground: 'brown',
	walkable: true,
	blocksLight: false,
	description: 'A Wooden Bridge'
};

Lootr.Tile.sandTile = {
	character: '~',
	foreground: 'yellow',
	blocksLight: false,
	walkable: true,
	ground: true,
	description: 'Sand'
};

Lootr.Tile.treeTile = {
	character: '^',
	foreground: 'green',
	blocksLight: true,
	walkable: false,
	ground: false,
	description: 'Trees'
};

Lootr.Tile.rockTile = {
	character: '*',
	foreground: 'white',
	diggable: false,
	walkable: false,
	description: 'A rock'
};

Lootr.Tile.wallGemTile = {
	character: '#',
	foreground: 'aquamarine',
	diggable: false,
	blocksLight: false,
	description: 'A Gem'
};

Lootr.Tile.waterTile = {
	character: '~',
	foreground: '#00CCFF',
	walkable: false,
	ground: true,
	itemSpawnable: false,
	blocksLight: false,
	description: 'Murky water'
};

Lootr.Tile.exitToOverworld = {
	character: 'o',
	foreground: 'red',
	walkable: true,
	blocksLight: false,
	description: 'An exit back outside'
};

// Overworld Tiles
Lootr.Tile.holeToBossCave = {
	character: 'O',
	foreground: 'grey',
	walkable: true,
	blocksLight: false,
	description: 'A dark opening'
};

Lootr.Tile.holeToCaveTile = {
	character: 'O',
	foreground: 'white',
	walkable: true,
	blocksLight: false,
	description: 'A cave opening'
};

Lootr.Tile.holeToDesertTile = {
	character: 'O',
	foreground: 'yellow',
	walkable: true,
	blocksLight: false,
	description: 'A desert opening'
};
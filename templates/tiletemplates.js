
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

Lootr.Tile.castleWallTile = {
    character: '#',
    foreground: 'yellow',
    background: 'slategray',
    description: 'A Castle Wall'
};

Lootr.Tile.castleDoorTile = {
    character: '#',
    foreground: 'brown',
    background: 'brown',
    diggable: true,
    description: 'A Castle door'
};

Lootr.Tile.castleFloorTile = {
    character: '.',
    foreground: 'gray',
    background: 'gray',
    walkable: true,
    blocksLight: false,
    ground: true,
    description: 'A Castle Floor Tile'
};

Lootr.Tile.snowTile = {
    character: '~',
    foreground: 'white',
    walkable: true,
    blocksLight: false,
    ground: true,
    description: 'Heavy snow'
};

Lootr.Tile.lightSnowTile = {
    character: '.',
    foreground: 'white',
    walkable: true,
    blocksLight: false,
    ground: true,
    description: 'Light snow'
};

Lootr.Tile.mountainTile = {
    character: 'M',
    foreground: 'brown',
    walkable: false,
    blocksLight: true,
    description: 'A Big Mountain'
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

Lootr.Tile.tombstoneTile = {
    character: 'T',
    foreground: 'grey',
    walkable: false,
    ground: true,
    blocksLight: false,
    description: 'An old stone tombstone'
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
    character: '>',
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

Lootr.Tile.holeToCastleTile = {
    character: 'O',
    foreground: 'purple',
    walkable: true,
    blocksLight: false,
    description: 'A Castle opening'
};
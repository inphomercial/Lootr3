
// 0 floorTile
// 1 wallTile
// 2 waterTile
// 3 treeTile
// 4 wallGemTile

Lootr.Builder.Pool = {
    layout: [        
        [1,1,1,1,1,1],
        [1,2,2,2,2,1],
        [1,2,{},3,2,1],
        [1,2,3,3,2,1],
        [1,2,2,2,2,1]       
    ],
    special: [
    	{     		
	    	pos: {x: 2, y: 2},
    	    run: function(map) {
	    	  map[this.pos.y][this.pos.x] = new Lootr.Tile(Lootr.Tile.treeTile);	    	  	
	    	  console.log("Still running the special");
    	  	}
    	}
    ]
};

Lootr.Builder.Stream = {
	layout: [
		[0,0,0,2,0],
        [0,0,2,2,0],
        [0,2,2,2,0],
        [0,2,0,2,0],
        [0,2,0,0,2]       
    ]
}

Lootr.Builder.GemTreasure = {
	layout: [
		[4,4,4,4,4],
        [4,0,0,0,4],
        [4,0,3,0,4],
        [4,0,0,0,4],
        [4,4,4,4,4]        
    ]
}
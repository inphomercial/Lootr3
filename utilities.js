
Lootr.extend = function(src, dest) {
	// Create a copy of the source
	var result = {};
	for(var key in src) {
		result[key] = src[key];
	}

	// Copy over all keys from dest
	for(var key in dest) {
	result[key] = dest[key];
	}

	return result;
};

/*Lootr.lightenColor = function(color, amount) {

	if(color.constructor == String) {
		var rgb = ROT.Color.fromString(color);
	} else if(color instanceof Array) {
		var rgb = ROT.Color.toRGB(color);		
	}

	rgb[0] = Math.min(255, rgb[0] + 255 * amount);
	rgb[1] = Math.min(255, rgb[1] + 255 * amount);
	rgb[2] = Math.min(255, rgb[2] + 255 * amount);
	
	return ROT.Color.toHex(rgb);
}*/
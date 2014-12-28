
Lootr.DynamicGlyph = function(args) {
	args = args || {};

	// Call the glyphs constructor with our args
	Lootr.Glyph.call(this, args);

	// Instantiate any args from the passed object
	this._name = args['name'] || '';

	// Create an object which will keey track of components 
	// we have attached to this entity based on name property
	this._attachedComponents = {};

	// Create one for groups
	this._attachedComponentGroups = {};

	// Setup the components
	var components = args['components'] || {};
	for(var i=0; i<components.length; i++) {
		// Copy over all properties from each mixin as long
		// as it's not the name or init property. also
		// dont override a property that already exists
		for(var key in components[i]) {
			if(key != 'init' && key != 'name' && !this.hasOwnProperty(key)) {
				this[key] = components[i][key];
			}
		}

		// Add the name of this component to our attached compoents
		this._attachedComponents[components[i].name] = true;

		// If a group name is present, add that too
		if(components[i].groupName) {
			this._attachedComponentGroups[components[i].groupName] = true;
		}

		// Finally call the init function if there is one
		if(components[i].init) {
			components[i].init.call(this, args);
		}
	}
};

// Make dynamic inherit all functionality from glyphs
Lootr.DynamicGlyph.extend(Lootr.Glyph);

Lootr.DynamicGlyph.prototype.hasComponent = function(obj) {
	// allow passing the component itself or the name / group as a string
	if(typeof obj === 'object') {
		return this._attachedComponents[obj.name];
	} else {
		return this._attachedComponents[obj] || this._attachedComponentGroups[obj];
	}
};


Lootr.DynamicGlyph.prototype.setName = function(name) {
	this._name = name;
};

Lootr.DynamicGlyph.prototype.getName = function() {
	return this._name;
};

Lootr.DynamicGlyph.prototype.describe = function() {
	return this._name;
};

Lootr.DynamicGlyph.prototype.describeA = function(capitalize) {
	// Optional parameter to capitalize the a/an
	var prefixes = capitalize ? ['A', 'An'] : ['a', 'an'];
	var string = this.describe();
	var firstLetter = string.charAt(0).toLowerCase();

	// If the word starts with a vowel, use an else use a
	var prefix = 'aeiou'.indexOf(firstLetter) >= 0 ? 1 : 0;

	return prefixes[prefix] + ' ' + string;
};

Lootr.DynamicGlyph.prototype.describeThe = function(capitalize) {
	var prefix = capitalize ? 'The' : 'the';
	return prefix + ' ' + this.describe();
}
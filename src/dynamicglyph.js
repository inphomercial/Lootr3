
Lootr.DynamicGlyph = function(args) {
    args = args || {};

    // Call the glyphs constructor with our args
    Lootr.Glyph.call(this, args);

    // Instantiate any args from the passed object
    this._name = args['name'] || '';

    // Create an object which will keey track of components
    // we have attached to this entity based on name property
    this._attachedComponents = {};

    // new components holder
    this._components = [];

    // Create one for groups
    this._attachedComponentGroups = {};

    // Setup an object for listeners
    this._listeners = {};

    // Setup the components
    var components = args['components'] || {};
    for(var i=0; i<components.length; i++) {

        // Add our component to the new component holder
        var name = components[i].name;
        this._components[name] = components[i];

        // Finally call the init function if there is one
        if(this._components[name].init) {
            this._components[name].init.call(this, args);
        }
        ////////////////////////////////////////////////

        // Copy over all properties from each mixin as long
        // as it's not the name, init or listeners property. also
        // dont override a property that already exists
        // for(var key in components[i]) {
        //     if(key != 'init' && key != 'name' && key != 'listeners' && !this.hasOwnProperty(key)) {
        //         this[key] = components[i][key];
        //     }
        // }

        // Add the name of this component to our attached compoents
        // this._attachedComponents[components[i].name] = true;

        // If a group name is present, add that too
        // if(components[i].groupName) {
        //     this._attachedComponentGroups[components[i].groupName] = true;
        // }

        // Add all of our listeners
        if(this._components[name].listeners) {
            for (var key in this._components[name].listeners) {
                // If we dont already have a key for this event in our listens
                // array, add it.
                if(!this._listeners[key]) {
                    this._listeners[key] = [];
                }
                // Add the listener
                this._listeners[key].push(this._components[name].listeners[key]);
            }
        }

        // if(components[i].listeners) {
        //     for (var key in components[i].listeners) {
        //         // If we dont already have a key for this event in our listens
        //         // array, add it.
        //         if(!this._listeners[key]) {
        //             this._listeners[key] = [];
        //         }
        //         // Add the listener
        //         this._listeners[key].push(components[i].listeners[key]);
        //     }
        // }

        // Finally call the init function if there is one
        // if(this._components[name].init) {
        //     this._components[name].init.call(this, args);
        // }

        // if(components[i].init) {
        //     components[i].init.call(this, args);
        // }
    }
};

// Make dynamic inherit all functionality from glyphs
Lootr.DynamicGlyph.extend(Lootr.Glyph);

Lootr.DynamicGlyph.prototype.hasComponent = function(obj) {
    if(typeof obj === 'object') {
        return this._components[obj.name];
        // return this._attachedComponents[obj.name];
    } else {
        return this._components[obj];
        // return this._attachedComponents[obj] || this._attachedComponentGroups[obj];
    }
};

// @todo fix this... currently not working
Lootr.DynamicGlyph.prototype.addComponent = function(component) {
    console.info("components", this._attachedComponents);
    console.info("componentGroups", this._attachedComponentGroups);

    if (typeof component === 'object') {
        if (!this._attachedComponents[component.name]) {

            for(var key in component) {
                if(key != 'init' && key != 'name' && key != 'listeners' && !this.hasOwnProperty(key)) {
                    this[key] = component[key];
                }
            }

            this._attachedComponents[component.name] = true;
            console.info('Component object', component);
            component.init.call(this);
        } else {
            console.log("Component already exists on player");
        }
    }
};

Lootr.DynamicGlyph.prototype.removeComponent = function(component) {
};

Lootr.DynamicGlyph.prototype.raiseEvent = function(event) {
    // Make sure we have at least one listener or else exit
    if(!this._listeners[event]) {
        return;
    }

    // Extract any agruments passed, removing the event name
    var args = Array.prototype.slice.call(arguments, 1);

    // Invoke each listener, with this entity as the context and the arguments
    var results = [];
    for(var i=0; i<this._listeners[event].length; i++) {
        results.push(this._listeners[event][i].apply(this, args));
    }

    return results;
};

Lootr.DynamicGlyph.prototype.details = function() {
    var details = [];
    var detailGroups = this.raiseEvent('details');

    // Iterate throughe ach return value, grabbing the details from the array
    if(detailGroups) {
        for(var i=0; i<detailGroups.length; i++) {
            if(detailGroups[i]) {
                for (var j=0; j<detailGroups[i].length; j++) {
                    details.push(detailGroups[i][j].key + ': ' + detailGroups[i][j].value);
                }
            }
        }
    }

    return details.join(', ');
};

Lootr.Glyph.prototype.getRepresentation = function() {
    return '%c{' + this._foreground + '}%b{' + this._background + '}' + this._char +
        '%c{white}%b{black}';
};

Lootr.DynamicGlyph.prototype.setName = function(name) {
    this._name = name;
};

Lootr.DynamicGlyph.prototype.getNameUpper = function() {
    return this._name.charAt(0).toUpperCase() + this._name.slice(1);
}

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
};


Lootr.Entity = function(args) {
    args = args || {};

    // Call the DynamicGlyphs constructor
    Lootr.DynamicGlyph.call(this, args);

    this._alive = true;

    this._template = args;

    // Set properties passed from args
    this._name = args['name'] || '';
    this._x = args['x'] || 0;
    this._y = args['y'] || 0;

    this._map = null;
}

// Inhert all from Glyph
Lootr.Entity.extend(Lootr.DynamicGlyph);

Lootr.Entity.prototype.switchMap = function(newMap) {
    // If it's the same map, do nothing
    if(newMap === this.getMap()) return;

    this.getMap().removeEntity(this);

    // Clear the position
    this._x = 0;
    this._y = 0;

    // Add to the new map
    newMap.addEntity(this);
};

Lootr.Entity.prototype.isAlive = function() {
    return this._alive;
};

Lootr.Entity.prototype.getSpeed = function() {
    return this.getMovementSpeed();
};

Lootr.Entity.prototype.kill = function(message) {
    // Only kill one
    if(!this.isAlive()) {
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
};

Lootr.Entity.prototype.isOnDesertEnterance = function(tile) {
    return (tile.getDescription() === Lootr.Tile.holeToDesertTile.description && this.hasComponent(Lootr.EntityComponents.PlayerActor));
};

Lootr.Entity.prototype.isOnCastleEnterance = function(tile) {
    return (tile.getDescription() === Lootr.Tile.holeToCastleTile.description && this.hasComponent(Lootr.EntityComponents.PlayerActor));
};

Lootr.Entity.prototype.isOnOverworldExit = function(tile) {
    return (tile.getDescription() === Lootr.Tile.exitToOverworld.description && this.hasComponent(Lootr.EntityComponents.PlayerActor));
};

Lootr.Entity.prototype.isOnCaveEnterance = function(tile) {
    return (tile.getDescription() === Lootr.Tile.holeToCaveTile.description && this.hasComponent(Lootr.EntityComponents.PlayerActor));
};

Lootr.Entity.prototype.isOnCaveBossEnterance = function(tile) {
    return (tile.getDescription() === Lootr.Tile.holeToBossCave.description && this.hasComponent(Lootr.EntityComponents.PlayerActor));
};

Lootr.Entity.prototype.isOnWallWithPassThroughWalls = function(tile) {
    return (!tile.isGround() && this.hasComponent('PassThroughWalls'));
};

// Make sure the entitys position is within bounds
Lootr.Entity.prototype.isWithinMapBounds = function(newX, newY, map) {
    return (newX > 0 || newX <= this.getMap()._width ||
            newY > 0 || newY <= this.getMap()._height);
};

Lootr.Entity.prototype.isAttackerWithPlayerAndTargetIsDestructable = function(target) {
        return (this.hasComponent('Attacker') &&
                // One of the entities is the player
                (this.hasComponent(Lootr.EntityComponents.PlayerActor) || target.hasComponent(Lootr.EntityComponents.PlayerActor)) &&
                // Whatever is being hit has destructible
                target.hasComponent(Lootr.EntityComponents.Destructible));
};

Lootr.Entity.prototype.isOnGoldTile = function(newX, newY, tile, map) {
    return (tile.isWalkable() && this.hasComponent(Lootr.EntityComponents.GoldHolder) && map.tileContainsItem(newX, newY, 'gold'));
};

Lootr.Entity.prototype.isOnGroundTileWhileFlying = function(tile) {
    return (tile.isGround() && this.hasComponent('Flight') && this.isFlying());
};

Lootr.Entity.prototype.isOnTrapTile = function(newX, newY, tile, map) {
    return (tile.isWalkable() && map.tileContainsItem(newX, newY, 'spike trap'));
};

Lootr.Entity.prototype.isNotFlying = function() {
    return (!this.hasComponent('Flight') || !this.isFlying());
};

Lootr.Entity.prototype.isOnWalkableTileAndHasItems = function(newX, newY, tile, map) {
   return (tile.isWalkable()  && this.getMap().getItemsAt(newX, newY));
};

Lootr.Entity.prototype.tryMove = function(x, y) {
    var map = this.getMap();
    var tile = map.getTile(x, y);
    var target = map.getEntityAt(x, y);

    // If entity is at tile
    if (target) {
        if (this.isAttackerWithPlayerAndTargetIsDestructable(target)) {
            this.attack(target);
            return true;
        }

        // we cannot attack and cannot move
        Lootr.sendMessage(this, 'You bump into something.');

        return false;
    }

    // Moving onto tiles that trigger map changes
    if (this.isOnCastleEnterance(tile)) this.switchMap(new Lootr.Map.Castle(this));

    if (this.isOnDesertEnterance(tile)) this.switchMap(new Lootr.Map.Desert(this));

    if (this.isOnOverworldExit(tile)) this.switchMap(new Lootr.Map.Overworld(this));

    if (this.isOnCaveEnterance(tile)) this.switchMap(new Lootr.Map.Cave(this));

    if (this.isOnCaveBossEnterance(tile)) this.switchMap(new Lootr.Map.BossCavern(tile));

    if (this.isOnWallWithPassThroughWalls(tile)) {
        if(this.isWithinMapBounds(x, y, map)) this.setPosition(x, y);

        return true;
    }

    if (this.isOnGroundTileWhileFlying(tile)) {
        this.setPosition(x, y);

        return true;
    }

    if (this.isOnGoldTile(x, y, tile, map)) {
        this.setPosition(x, y);

        // Generate a random amount
        // @todo Maybe make something like luck an attribute to multiply against
        var gold = map.getItemsAt(x, y);

        // Add gold
        this.modifyGoldBy(gold[0].getGold());

        // Notify of the pickup
        Lootr.sendMessage(this, 'You pickup ' + gold[0].getGold() + ' gold');

        // Remove it from game
        map.removeItemFromTile(x, y, 'gold');

        return true;
    }

    if (this.isOnTrapTile(x, y, tile, map)) {
        var trap = map.getItemsAt(x, y, 'spike trap');

        if(this.isNotFlying()) {
            // Trap will spring, updating the tile character
            // damaging entity
            // sending messing
            trap[0].springTrap(this);
        }

        // update the entitys position
        this.setPosition(x, y);

        return true;
    }


    if (this.isOnWalkableTileAndHasItems(x, y, tile, map)) {
        this.setPosition(x, y);

        // Notify entity if they are standing on items
        var items = map.getItemsAt(x, y);
        if(items) {
            if(items.length === 1) {
                Lootr.sendMessage(this, 'You see %s', [items[0].describeA()]);
            } else {
                Lootr.sendMessage(this, 'There are several object here..');
            }
        }
        return true;
    }

    // check if tile is diggable and if so dig it
    if (tile.isDiggable()) {
        if(this.hasComponent(Lootr.EntityComponents.PlayerActor)) {
            map.dig(x, y);
            return true;
        }

        return false;
    }

    if (tile.isWalkable()) {
        this.setPosition(x, y);
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
    this._y = y;
};

Lootr.Entity.prototype.getX = function() {
    return this._x;
};

Lootr.Entity.prototype.getY = function() {
    return this._y;
};


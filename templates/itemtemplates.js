
// Create a class of item levels
Lootr.ITEM_RARITY = {
    COMMON: "common",
    MAGICAL: "magical",
    RARE: "rare",
    UNIQUE: "unique"
};

Lootr.ITEM_SLOTS = {
    HEAD: "head",
    BODY: "body",
    HAND: "hand",
    FINGER: "finger",
    FEET: "feet"
};

Lootr.ItemRepository = {};

// Create our central Item template repository
Lootr.ItemRepository = new Lootr.Repository('items', Lootr.Item);

// Orbs
Lootr.ItemRepository.define('Red Orb', {
    name: 'Red Orb',
    character: '@',
    foreground: 'red',
    components: [Lootr.ItemComponents.Orb]
}, {
    disableRandomCreation: true
});

Lootr.ItemRepository.define('Yellow Orb', {
    name: 'Yellow Orb',
    character: '@',
    foreground: 'yellow',
    components: [Lootr.ItemComponents.Orb]
}, {
    disableRandomCreation: true
});

Lootr.ItemRepository.define('Green Orb', {
    name: 'Green Orb',
    character: '@',
    foreground: 'green',
    components: [Lootr.ItemComponents.Orb]
}, {
    disableRandomCreation: true
});

Lootr.ItemRepository.define('Blue Orb', {
    name: 'Blue Orb',
    character: '@',
    foreground: 'lightskyblue',
    components: [Lootr.ItemComponents.Orb]
}, {
    disableRandomCreation: true
});

Lootr.ItemRepository.define('corpse', {
    name: 'corpse',
    character: '&',
    foodValue: 75,
    consumptions: 1,
    components: [Lootr.ItemComponents.Edible]
                 // Lootr.ItemComponents.Decay]
}, {
    disableRandomCreation: true
});

// Edibles
Lootr.ItemRepository.define('apple', {
    name: 'apple',
    character: '%',
    foreground: 'red',
    foodValue: 50,
    rarity: Lootr.ITEM_RARITY.COMMON,
    components: [Lootr.ItemComponents.Edible, Lootr.ItemComponents.Decay]
}, {
    disableRandomCreation: false
});

Lootr.ItemRepository.define('melon', {
    name: 'melon',
    character: '%',
    foreground: '#33FF33',
    foodValue: 35,
    comsumptions: 4,
    components: [Lootr.ItemComponents.Edible]
}, {
    disableRandomCreation: false
});

// Traps
Lootr.ItemRepository.define('spike trap', {
    name: 'spike trap',
    character: '.',
    trapDamage: 10,
    foreground: 'gray',
    components: [Lootr.ItemComponents.SpringTrap]
}, {
    disableRandomCreation: false
});

Lootr.ItemRepository.define('gold', {
    name: 'gold',
    character: '$',
    foreground: 'gold',
    components: [Lootr.ItemComponents.Gold]
}, {
    disableRandomCreation: false
});

// Quaffables
Lootr.ItemRepository.define('potion', {
    name: 'potion',
    character: '?',
    foreground: '#1975FF',
    quaff_value: 6,
    quaffs: 2,
    components: [Lootr.ItemComponents.Quaffable]
}, {
    disableRandomCreation: false
});

Lootr.ItemRepository.define('unidentified', {
    name: 'unidentified',
    character: '?',
    components: [Lootr.ItemComponents.RandomRarity]
}, {
    disableRandomCreation: false
});

// Weapons
Lootr.ItemRepository.define('dagger', {
    name: 'dagger',
    character: ')',
    foreground: 'gray',
    attackValue: 5,
    wieldable: true,
    slot: Lootr.ITEM_SLOTS.HAND,
    rarity: Lootr.ITEM_RARITY.COMMON,
    components: [Lootr.ItemComponents.Equippable]
}, {
    disableRandomCreation: false
});

Lootr.ItemRepository.define('silver ring', {
    name: 'silver ring',
    character: 'o',
    foreground: 'silver',
    intValue: 5,
    wearable: true,
    slot: Lootr.ITEM_SLOTS.FINGER,
    rarity: Lootr.ITEM_RARITY.RARE,
    components: [Lootr.ItemComponents.Equippable]
}, {
    disableRandomCreation: false
});

Lootr.ItemRepository.define('red ring', {
    name: 'red ring',
    character: 'o',
    foreground: 'red',
    strValue: 5,
    wearable: true,
    slot: Lootr.ITEM_SLOTS.FINGER,
    rarity: Lootr.ITEM_RARITY.RARE,
    components: [Lootr.ItemComponents.Equippable]
}, {
    disableRandomCreation: false
});

Lootr.ItemRepository.define('green ring', {
    name: 'green ring',
    character: 'o',
    foreground: 'green',
    dexValue: 5,
    wearable: true,
    slot: Lootr.ITEM_SLOTS.FINGER,
    rarity: Lootr.ITEM_RARITY.RARE,
    components: [Lootr.ItemComponents.Equippable]
}, {
    disableRandomCreation: false
});

Lootr.ItemRepository.define('metal helmet', {
    name: 'metal helmet',
    character: '^',
    foreground: 'white',
    attackValue: 2,
    defenseValue: 2,
    wearable: true,
    slot: Lootr.ITEM_SLOTS.HEAD,
    components: [Lootr.ItemComponents.Equippable]
}, {
    disableRandomCreation: false
});

// Armors
Lootr.ItemRepository.define('robe', {
    name: 'robe',
    character: ']',
    foreground: 'lightskyblue',
    wearable: true,
    slot: Lootr.ITEM_SLOTS.BODY,
    defenseValue: 3,
    components: [Lootr.ItemComponents.Equippable]
}, {
    disableRandomCreation: false
});

Lootr.ItemRepository.define('leather boots', {
    name: 'leather boots',
    character: '9',
    foreground: 'brown',
    defenseValue: 2,
    wearable: true,
    slot: Lootr.ITEM_SLOTS.FEET,
    components: [Lootr.ItemComponents.Equippable]
}, {
    disableRandomCreation: false
});

Lootr.ItemRepository.define('club', {
    name: 'club',
    character: '!',
    foreground: 'gray',
    attackValue: 7,
    wieldable: true,
    slot: Lootr.ITEM_SLOTS.HAND,
    components: [Lootr.ItemComponents.Equippable]
}, {
    disableRandomCreation: false
});

Lootr.ItemRepository.define('pumpkin', {
    name: 'pumpkin',
    character: '*',
    foreground: 'orange',
    foodValue: 50,
    attackValue: 2,
    defenseValue: 2,
    comsumptions: 1,
    wearable: true,
    wieldable: true,
    slot: Lootr.ITEM_SLOTS.HEAD,
    components: [Lootr.ItemComponents.Equippable,
                 Lootr.ItemComponents.Edible]
}, {
    disableRandomCreation: false
});


Lootr.Templates = {};

Lootr.Templates.Base = {
    name: 'You',
    character: '@',
    foreground: 'yellow',
    background: 'black',
    class: 'base',
    sightRadius: 10,        // Sight
    maxHp: 100,             // Destructible
    hp: 100,                // Destructible
    defense: 1,             // Destructible
    attack: 1,              // Attacker
    inventorySlots: 10,     // InventoryHolder
    movementSpeed: 1000,    // MovementSpeed
    maxFullness: 500,       // FoodConsumer
    components: [Lootr.EntityComponents.PlayerActor,
                 Lootr.EntityComponents.StrStat,
                 Lootr.EntityComponents.IntStat,
                 Lootr.EntityComponents.DexStat,
                 Lootr.EntityComponents.LearnedSpells,
                 Lootr.EntityComponents.Sight,
                 Lootr.EntityComponents.Destructible,
                 Lootr.EntityComponents.Attacker,
                 Lootr.EntityComponents.InventoryHolder,
                 Lootr.EntityComponents.MessageRecipient,
                 Lootr.EntityComponents.GoldHolder,
                 Lootr.EntityComponents.MovementSpeed,
                 Lootr.EntityComponents.FoodConsumer,
                 Lootr.EntityComponents.Orbs,
                 Lootr.EntityComponents.ExperienceGainer,
                 Lootr.EntityComponents.PlayerStatGainer]
};

Lootr.Templates.Wizard = {
    foreground: 'blue',
    class: 'Wizard',
    manaReplenishRate: 4,    // ManaPool
    maxMana: 100,            // ManaPool
    manaIncreaseAmount: 5,   // ManaPool
    int: 3,                  // IntStat
    increaseIntByAmount: 2,  // IntStat
    maxFullness: 300,        // FoodConsumer
    inventorySlots: 13,      // InventoryHolder
    learnedSpells: ['Teleport', 'Firebolt', 'Fireball', 'HealLight'],
    slots: {                // Slot
            "head" : {
                "slot": Lootr.ITEM_SLOTS.HEAD,
                "slot_count": 1
            },
            "hand" : {
                "slot": Lootr.ITEM_SLOTS.HAND,
                "slot_count": 2
            },
            "body" : {
                "slot": Lootr.ITEM_SLOTS.BODY,
                "slot_count": 1
            },
            "finger" : {
                "slot": Lootr.ITEM_SLOTS.FINGER,
                "slot_count": 3
            },
            "feet" : {
                "slot": Lootr.ITEM_SLOTS.FEET,
                "slot_count": 1
            }
        },
    components: [Lootr.EntityComponents.ManaPool,
                //  Lootr.EntityComponents.PassThroughWalls,
                 Lootr.EntityComponents.Bleedable,
                 Lootr.EntityComponents.Invisiblity]
};

Lootr.Templates.Assassin = {
    foreground: 'grey',
    class: 'Assassin',
    manaReplenishRate: 2,   // ManaPool
    maxMana: 50,            // ManaPool
    manaIncreaseAmount: 3,  // ManaPool
    dex: 3,                 // DexStat
    increaseDexByAmount: 2, // DexStat
    maxFullness: 200,       // FoodConsumer
    movementSpeed: 1300,    // MovementSpeed
    learnedSpells: ['Teleport'],
    slots: {                // Slot
            "head" : {
                "slot": Lootr.ITEM_SLOTS.HEAD,
                "slot_count": 1
            },
            "hand" : {
                "slot": Lootr.ITEM_SLOTS.HAND,
                "slot_count": 2
            },
            "body" : {
                "slot": Lootr.ITEM_SLOTS.BODY,
                "slot_count": 1
            },
            "finger" : {
                "slot": Lootr.ITEM_SLOTS.FINGER,
                "slot_count": 2
            },
            "feet" : {
                "slot": Lootr.ITEM_SLOTS.FEET,
                "slot_count": 2
            }
        },
    components: [Lootr.EntityComponents.ManaPool,
                 Lootr.EntityComponents.PassThroughWalls,
                 Lootr.EntityComponents.Bleedable,
                 Lootr.EntityComponents.Invisiblity]
};

Lootr.Templates.Warrior = {
    foreground: 'red',
    class: 'Warrior',
    maxHp: 200,             // Destructible
    attack: 3,              // Attacker
    inventorySlots: 40,     // InventoryHolder
    maxFullness: 800,       // FoodConsumer
    movementSpeed: 800,     // MovementSpeed
    str: 3,                 // StrStat
    increaseStrByAmount: 2, // StrStat
    slots: {                // Slot
            "head" : {
                "slot": Lootr.ITEM_SLOTS.HEAD,
                "slot_count": 1
            },
            "hand" : {
                "slot": Lootr.ITEM_SLOTS.HAND,
                "slot_count": 2
            },
            "body" : {
                "slot": Lootr.ITEM_SLOTS.BODY,
                "slot_count": 2
            },
            "finger" : {
                "slot": Lootr.ITEM_SLOTS.FINGER,
                "slot_count": 1
            },
            "feet" : {
                "slot": Lootr.ITEM_SLOTS.FEET,
                "slot_count": 2
            }
        },
    components: [Lootr.EntityComponents.Bleedable,
                 Lootr.EntityComponents.FireBreather]
};

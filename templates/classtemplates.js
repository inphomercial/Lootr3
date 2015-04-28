
Lootr.Templates = {};

Lootr.Templates.BasePlayer = {
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
    components: [Lootr.EntityComponents.PlayerActor,
                 Lootr.EntityComponents.Sight,
                 Lootr.EntityComponents.Destructible,
                 Lootr.EntityComponents.Attacker,
                 Lootr.EntityComponents.InventoryHolder,
                 Lootr.EntityComponents.MessageRecipient,
                 Lootr.EntityComponents.GoldHolder,
                 Lootr.EntityComponents.MovementSpeed,
                 Lootr.EntityComponents.Orbs,
                 Lootr.EntityComponents.ExperienceGainer,
                 Lootr.EntityComponents.Equipper,                 
                 Lootr.EntityComponents.PlayerStatGainer]
};

Lootr.Templates.WizardPlayer = {
    name: 'You',
    character: '@',
    foreground: 'blue',
    background: 'black',
    class: 'Wizard',
    manaReplenishRate: 4,  // ManaPool
    maxMana: 100,          // ManaPool
    manaIncreaseAmount: 5, // ManaPool
    maxFullness: 500,      // FoodConsumer
    components: [Lootr.EntityComponents.ManaPool,                 
                 Lootr.EntityComponents.PassThroughWalls,                 
                 Lootr.EntityComponents.FoodConsumer,                 
                 Lootr.EntityComponents.Flight,
                 Lootr.EntityComponents.Bleedable,
                 Lootr.EntityComponents.Invisiblity]
};

Lootr.Templates.OrcPlayer = {
    name: 'ORC',
    foreground: 'green',
    background: 'black',
    class: 'Orc',
    maxHp: 200,          // Destructible
    attack: 3,           // Attacker
    inventorySlots: 40,  // InventoryHolder
    maxFullness: 800,    // FoodConsumer
    movementSpeed: 800,  // MovementSpeed
    components: [Lootr.EntityComponents.FoodConsumer,                            
                 Lootr.EntityComponents.Bleedable]
};

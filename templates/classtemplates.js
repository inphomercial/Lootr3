
Lootr.TemplateHumanPlayer = {
    name: 'You',
    character: '@',
    foreground: 'yellow',
    background: 'black',

    sightRadius: 10,     // Sight

    maxHp: 100,          // Destructible
    defense: null,       // Destructible
    hp: null,            // Destructible

    maxMana: 10,         // ManaPool

    attack: null,        // Attacker

    inventorySlots: 20,  // InventoryHolder
    maxFullness: 500,    // FoodConsumer
    movementSpeed: 1000, // MovementSpeed
    components: [Lootr.EntityComponents.PlayerActor,
                 Lootr.EntityComponents.Attacker,
                 Lootr.EntityComponents.Destructible,
                 Lootr.EntityComponents.ManaPool,
                 Lootr.EntityComponents.MovementSpeed,
                 Lootr.EntityComponents.MessageRecipient,
                 Lootr.EntityComponents.Sight,
                 Lootr.EntityComponents.PassThroughWalls,
                 Lootr.EntityComponents.InventoryHolder,
                 Lootr.EntityComponents.GoldHolder,
                 Lootr.EntityComponents.FoodConsumer,
                 Lootr.EntityComponents.Equipper,
                 // Lootr.EntityComponents.Flight,
                 Lootr.EntityComponents.Bleedable,
                 Lootr.EntityComponents.Invisiblity,
                 Lootr.EntityComponents.Orbs,
                 Lootr.EntityComponents.ExperienceGainer,
                 Lootr.EntityComponents.PlayerStatGainer]
};

Lootr.TemplateOrcPlayer = {
    name: 'ORC',
    character: '@',
    foreground: 'green',
    background: 'black',
    sightRadius: 10,     // Sight

    maxHp: 100,          // Destructible
    defense: null,       // Destructible
    hp: null,            // Destructible

    maxMana: 0,         // ManaPool

    attack: 3,        // Attacker

    inventorySlots: 40,  // InventoryHolder
    maxFullness: 800,    // FoodConsumer
    movementSpeed: 800, // MovementSpeed
    components: [Lootr.EntityComponents.PlayerActor,
                 Lootr.EntityComponents.Attacker,
                 Lootr.EntityComponents.Destructible,
                 Lootr.EntityComponents.ManaPool,
                 Lootr.EntityComponents.MovementSpeed,
                 Lootr.EntityComponents.MessageRecipient,
                 Lootr.EntityComponents.Sight,                 
                 Lootr.EntityComponents.InventoryHolder,
                 Lootr.EntityComponents.GoldHolder,
                 Lootr.EntityComponents.FoodConsumer,
                 Lootr.EntityComponents.Equipper,                 
                 Lootr.EntityComponents.Bleedable,                 
                 Lootr.EntityComponents.Orbs,
                 Lootr.EntityComponents.ExperienceGainer,
                 Lootr.EntityComponents.PlayerStatGainer]
};
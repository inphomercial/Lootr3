
Lootr.TemplatePlayer = {
    name: 'You',
    character: '@',
    foreground: 'yellow',
    background: 'black',
    sightRadius: 10,
    red: true,
    maxHp: 100,
    inventorySlots: 20,
    maxFullness: 500,
    components: [Lootr.EntityComponents.PlayerActor,
                 Lootr.EntityComponents.Attacker,
                 Lootr.EntityComponents.Destructible,
                 Lootr.EntityComponents.MessageRecipient,
                 Lootr.EntityComponents.Sight,
                 //Lootr.EntityComponents.PassThroughWalls,
                 Lootr.EntityComponents.InventoryHolder,
                 Lootr.EntityComponents.GoldHolder,
                 Lootr.EntityComponents.FoodConsumer,
                 Lootr.EntityComponents.Equipper,
                 Lootr.EntityComponents.Flight,
                 Lootr.EntityComponents.Invisiblity,
                 Lootr.EntityComponents.Orbs,
                 Lootr.EntityComponents.ExperienceGainer,
                 Lootr.EntityComponents.PlayerStatGainer]
}

Lootr.EntityRepository = {};

// Create our central Entity template repository
Lootr.EntityRepository = new Lootr.Repository('entities', Lootr.Entity);

Lootr.EntityRepository.define('spider nest', {
    name: 'spider nest',
    character: '&',
    foreground: 'white',
    background: 'gray',
    maxHp: 15,
    speed: 50,
    components: [Lootr.EntityComponents.SpiderNestActor,
                 Lootr.EntityComponents.Destructible]
}, {
    disableRandomCreation: false
});

Lootr.EntityRepository.define('spider', {
    name: 'spider',
    character: '*',
    foreground: 'firebrick',
    background: 'black',
    maxHp: 5,
    speed: 1000,
    corpseDropRate: 01,
    tasks: ['hunt', 'wander'],
    components: [Lootr.EntityComponents.Destructible,
                 Lootr.EntityComponents.TaskActor,
                 Lootr.EntityComponents.Attacker,
                 Lootr.EntityComponents.HuntPlayer,
                 Lootr.EntityComponents.Wander,
                 Lootr.EntityComponents.CorpseDropper,
                 Lootr.EntityComponents.Sight,
                 Lootr.EntityComponents.ExperienceGainer,
                 Lootr.EntityComponents.RandomStatGainer]
}, {
    disableRandomCreation: false
});

Lootr.EntityRepository.define('ghost', {
    name: 'ghost',
    character: 'g',
    foreground: 'whitesmoke',
    maxHp: 15,
    speeD: 600,
    isInvisible: true,
    isFlying: true,
    task: ['wander'],
    components: [Lootr.EntityComponents.TaskActor,
                 Lootr.EntityComponents.PassThroughWalls,
                 Lootr.EntityComponents.Wander,
                 Lootr.EntityComponents.Invisiblity,
                 Lootr.EntityComponents.Flight]
}, {
    disableRandomCreation: false
});

Lootr.EntityRepository.define('fungus', {
    name: 'fungus',
    character: 'f',
    foreground: 'green',
    maxHp: 4,
    speed: 250,
    components: [Lootr.EntityComponents.FungusActor,
                 Lootr.EntityComponents.Destructible,
                 Lootr.EntityComponents.ExperienceGainer,
                 Lootr.EntityComponents.RandomStatGainer]
}, {
    disableRandomCreation: false
});

Lootr.EntityRepository.define('bat', {
    name: 'bat',
    character: 'b',
    foreground: 'purple',
    background: 'gray',
    speed: 2000,
    maxHp: 10,
    isFlying: true,
    tasks: ['wander'],
    components: [Lootr.EntityComponents.Destructible,
                 Lootr.EntityComponents.TaskActor,
                 Lootr.EntityComponents.Wander,
                 Lootr.EntityComponents.Flight,
                 Lootr.EntityComponents.Attacker,
                 Lootr.EntityComponents.CorpseDropper,
                 Lootr.EntityComponents.ExperienceGainer,
                 Lootr.EntityComponents.RandomStatGainer]
}, {
    disableRandomCreation: false
});

Lootr.EntityRepository.define('kobold', {
    name: 'kobold',
    character: 'k',
    foreground: 'white',
    maxHp: 10,
    attack: 4,
    gold: 10,
    sightRadius: 5,
    tasks: ['hunt', 'wander'],
    components: [Lootr.EntityComponents.TaskActor,
                 Lootr.EntityComponents.Sight,
                 Lootr.EntityComponents.Attacker,
                 Lootr.EntityComponents.HuntPlayer,
                 Lootr.EntityComponents.Wander,
                 Lootr.EntityComponents.GoldHolder,
                 Lootr.EntityComponents.Destructible,
                 Lootr.EntityComponents.CorpseDropper,
                 Lootr.EntityComponents.ExperienceGainer,
                 Lootr.EntityComponents.RandomStatGainer]
}, {
    disableRandomCreation: false
});

Lootr.EntityRepository.define('dragon', {
    name: 'dragon',
    character: 'D',
    foreground: 'green',
    maxHp: 40,
    attack: 15,
    defense: 15,
    sightRadius: 5,
    speed: 1000,
    tasks: ['breathFire', 'hunt', 'wander'],
    components: [Lootr.EntityComponents.TaskActor,
                 Lootr.EntityComponents.FireBreather,
                 Lootr.EntityComponents.Attacker,
                 Lootr.EntityComponents.Wander,
                 Lootr.EntityComponents.HuntPlayer,
                 Lootr.EntityComponents.Sight,
                 Lootr.EntityComponents.Destructible,
                 Lootr.EntityComponents.CorpseDropper,
                 Lootr.EntityComponents.ExperienceGainer,
                 Lootr.EntityComponents.RandomStatGainer]
}, {
    disableRandomCreation: true
});

Lootr.EntityRepository.define('fire', {
    name: 'fire',
    character: 'W',
    foreground: 'red',
    background: 'orange',
    speed: 800,
    tasks: ['fireSpread'],
    components: [Lootr.EntityComponents.TaskActor,
                 Lootr.EntityComponents.FireSpread]
}, {
    disableRandomCreation: false
});

Lootr.EntityRepository.define('vampire', {
    name: 'vampire',
    character: 'v',
    maxHp: 15,
    attack: 10,
    defense: 3,
    sightRadius: 2,
    tasks: ['corpseEater', 'hunt', 'wander'],
    components: [Lootr.EntityComponents.TaskActor,
                 Lootr.EntityComponents.Sight,
                 Lootr.EntityComponents.Attacker,
                 Lootr.EntityComponents.HuntPlayer,
                 Lootr.EntityComponents.Wander,
                 Lootr.EntityComponents.CorpseEater,
                 Lootr.EntityComponents.Destructible,
                 Lootr.EntityComponents.ExperienceGainer,
                 Lootr.EntityComponents.RandomStatGainer]
}, {
    disableRandomCreation: false
});

Lootr.EntityRepository.define('zombie', {
    name: 'zombie',
    character: 'Z',
    foreground: 'teal',
    maxHp: 30,
    attack: 8,
    defense: 5,
    level: 5,
    sightRadius: 6,
    spawnEntityType: 'slime',
    tasks: ['growArm', 'spawnEntity', 'hunt', 'wander'],
    components: [Lootr.EntityComponents.TaskActor,
                 Lootr.EntityComponents.Sight,
                 Lootr.EntityComponents.Attacker,
                 Lootr.EntityComponents.SpawnEntity,
                 Lootr.EntityComponents.Wander,
                 Lootr.EntityComponents.HuntPlayer,
                 Lootr.EntityComponents.GrowArm,
                 Lootr.EntityComponents.Destructible,
                 Lootr.EntityComponents.CorpseDropper,
                 Lootr.EntityComponents.ExperienceGainer]
}, {
    disableRandomCreation: false
});

Lootr.EntityRepository.define('slime', {
    name: 'slime',
    character: 's',
    foreground: 'lightgreen',
    maxHp: 10,
    attack: 5,
    sight: 3,
    tasks: ['leaveTrail', 'hunt', 'wander'],
    components: [Lootr.EntityComponents.TaskActor,
                 Lootr.EntityComponents.LeaveTrail,
                 Lootr.EntityComponents.Sight,
                 Lootr.EntityComponents.HuntPlayer,
                 Lootr.EntityComponents.Wander,
                 Lootr.EntityComponents.Attacker,
                 Lootr.EntityComponents.Destructible,
                 Lootr.EntityComponents.CorpseDropper,
                 Lootr.EntityComponents.ExperienceGainer,
                 Lootr.EntityComponents.RandomStatGainer]
}, {
    disableRandomCreation: false
});
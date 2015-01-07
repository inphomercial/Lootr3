
Lootr.TemplatePlayer = {
	name: 'You',
	character: '@',
	foreground: 'yellow',
	background: 'black',
	sightRadius: 6,
	maxHp: 100,
	inventorySlots: 20,
	components: [Lootr.EntityComponents.PlayerActor, 
				 Lootr.EntityComponents.Attacker,
				 Lootr.EntityComponents.Destructible,
				 Lootr.EntityComponents.MessageRecipient,
				 Lootr.EntityComponents.Sight,
				 Lootr.EntityComponents.InventoryHolder,
				 Lootr.EntityComponents.GoldHolder,
				 Lootr.EntityComponents.FoodConsumer,
				 Lootr.EntityComponents.Equipper,
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
	character: 'm',
	foreground: 'red',
	background: 'black',
	maxHp: 5,
	speed: 1000,
	corpseDropRate: 50,
	tasks: ['hunt', 'wander'],
	components: [Lootr.EntityComponents.Destructible,
				 Lootr.EntityComponents.TaskActor,
				 Lootr.EntityComponents.Attacker,
				 Lootr.EntityComponents.CorpseDropper,
				 Lootr.EntityComponents.Sight,
				 Lootr.EntityComponents.ExperienceGainer,
				 Lootr.EntityComponents.RandomStatGainer]
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
	foreground: 'white',
	background: 'gray',
	speed: 2000,
	maxHp: 10,
	components: [Lootr.EntityComponents.Destructible,
				 Lootr.EntityComponents.TaskActor,
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
	sightRadius: 5,
	tasks: ['hunt', 'wander'],
	components: [Lootr.EntityComponents.TaskActor,
			     Lootr.EntityComponents.Sight,
			     Lootr.EntityComponents.Attacker,
			     Lootr.EntityComponents.Destructible,
			     Lootr.EntityComponents.CorpseDropper,
			     Lootr.EntityComponents.ExperienceGainer,
			     Lootr.EntityComponents.RandomStatGainer]
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
	components: [Lootr.EntityComponents.VampireActor,
				 Lootr.EntityComponents.Sight,
		         Lootr.EntityComponents.Attacker,
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
	components: [Lootr.EntityComponents.GiantZombieActor,
		         Lootr.EntityComponents.Sight,
		         Lootr.EntityComponents.Attacker,
		         Lootr.EntityComponents.Destructible,
		         Lootr.EntityComponents.CorpseDropper,
		         Lootr.EntityComponents.ExperienceGainer]
}, {
	disableRandomCreation: true
});

Lootr.EntityRepository.define('slime', {
	name: 'slime',
	character: 's',
	foreground: 'lightgreen',
	maxHp: 10,
	attack: 5,
	sight: 3,	
	components: [Lootr.EntityComponents.SlimeActor,				 
			     Lootr.EntityComponents.Sight,			     
			     Lootr.EntityComponents.Attacker,
			     Lootr.EntityComponents.Destructible,
			     Lootr.EntityComponents.CorpseDropper,
			     Lootr.EntityComponents.ExperienceGainer,
			     Lootr.EntityComponents.RandomStatGainer]
}, {
	disableRandomCreation: false
});
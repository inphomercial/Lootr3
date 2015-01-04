
Lootr.TemplatePlayer = {
	name: 'You',
	character: '@',
	foreground: 'yellow',
	background: 'black',
	sightRadius: 8,
	maxHp: 10,
	inventorySlots: 20,
	components: [Lootr.EntityComponents.PlayerActor, 
				 Lootr.EntityComponents.Attacker,
				 Lootr.EntityComponents.Destructible,
				 Lootr.EntityComponents.MessageRecipient,
				 Lootr.EntityComponents.Sight,
				 Lootr.EntityComponents.InventoryHolder,
				 Lootr.EntityComponents.FoodConsumer,
				 Lootr.EntityComponents.Equipper,
				 Lootr.EntityComponents.ExperienceGainer,
				 Lootr.EntityComponents.PlayerStatGainer]
}

Lootr.EntityRepository = {};

// Create our central Entity template repository
Lootr.EntityRepository = new Lootr.Repository('entities', Lootr.Entity);

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
});

Lootr.EntityRepository.define('kobold', {
	name: 'kobold',
	character: 'k',
	foreground: 'white',
	maxHp: 6,
	attackValue: 4,
	sightRadius: 5,
	tasks: ['hunt', 'wander'],
	components: [Lootr.EntityComponents.TaskActor,
			     Lootr.EntityComponents.Sight,
			     Lootr.EntityComponents.Attacker,
			     Lootr.EntityComponents.Destructible,
			     Lootr.EntityComponents.CorpseDropper,
			     Lootr.EntityComponents.ExperienceGainer,
			     Lootr.EntityComponents.RandomStatGainer]
});

Lootr.EntityRepository.define('zombie', {
	name: 'zombie',
	character: 'Z',
	foreground: 'teal',
	maxHp: 30,
	attackValue: 8, 
	defenseValue: 5,
	level: 5,
	sightRadius: 6,
	components: [Lootr.EntityComponents.GiantZombieActor,
		         Lootr.EntityComponents.Sight,
		         Lootr.EntityComponents.Attacker,
		         Lootr.EntityComponents.Destructible,
		         Lootr.EntityComponents.CorpseDropper,
		         Lootr.EntityComponents.ExperienceGainer]
});

Lootr.EntityRepository.define('slime', {
	name: 'slime',
	character: 's',
	foreground: 'lightgreen',
	maxHp: 10,
	attackValue: 5,
	sightRadius: 3,
	tasks: ['hunt', 'wander'],
	components: [Lootr.EntityComponents.TaskActor,
			     Lootr.EntityComponents.Sight,
			     Lootr.EntityComponents.Attacker,
			     Lootr.EntityComponents.Destructible,
			     Lootr.EntityComponents.CorpseDropper,
			     Lootr.EntityComponents.ExperienceGainer,
			     Lootr.EntityComponents.RandomStatGainer]
});
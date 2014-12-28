
Lootr.TemplatePlayer = {
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
				 Lootr.EntityComponents.FoodConsumer]
}

Lootr.EntityRepository = {};

// Create our central Entity template repository
Lootr.EntityRepository = new Lootr.Repository('entities', Lootr.Entity);

Lootr.EntityRepository.define('fungus', {
	name: 'fungus',
	character: 'f',
	foreground: 'green',
	maxHp: 4,
	components: [Lootr.EntityComponents.FungusActor,
				 Lootr.EntityComponents.Destructible]	
});

Lootr.EntityRepository.define('bat', {
	name: 'bat',
	character: 'b',
	foreground: 'white',
	background: 'gray',
	maxHp: 10,
	components: [Lootr.EntityComponents.Destructible,
				 Lootr.EntityComponents.WanderActor,
				 Lootr.EntityComponents.Attacker,
				 Lootr.EntityComponents.CorpseDropper]
});

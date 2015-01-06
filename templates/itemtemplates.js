
Lootr.ItemRepository = {};

// Create our central Item template repository
Lootr.ItemRepository = new Lootr.Repository('items', Lootr.Item);

Lootr.ItemRepository.define('apple', {
	name: 'apple',
	character: '%',
	foreground: 'red',
	foodValue: 50,
	components: [Lootr.ItemComponents.Edible]
});

Lootr.ItemRepository.define('gold', {
	name: 'gold',
	character: '$',
	foreground: 'gold'	
});

Lootr.ItemRepository.define('melon', {
	name: 'melon',
	character: '%',
	foreground: '#33FF33',
	foodValue: 35,
	comsumptions: 4,
	components: [Lootr.ItemComponents.Edible]
});

Lootr.ItemRepository.define('potion', {
	name: 'potion',
	character: '?',
	foreground: '#1975FF',
	quaff_value: 6,
	quaffs: 2,
	components: [Lootr.ItemComponents.Quaffable]
});

Lootr.ItemRepository.define('corpse', {
	name: 'corpse',
	character: '&',
	foodValue: 75,
	consumptions: 1,
	components: [Lootr.ItemComponents.Edible]
}, {
	disableRandomCreation: true
});

Lootr.ItemRepository.define('dagger', {
	name: 'dagger',
	character: ')',
	foreground: 'gray',
	attackValue: 5,
	wieldable: true,
	components: [Lootr.ItemComponents.Equippable],
}, {
	disableRandomCreation: false
});

Lootr.ItemRepository.define('club', {
	name: 'club',
	character: '!',
	foreground: 'gray',
	attackValue: 7,
	wieldable: true,
	components: [Lootr.ItemComponents.Equippable],
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
	components: [Lootr.ItemComponents.Equippable,
			     Lootr.ItemComponents.Edible]
});
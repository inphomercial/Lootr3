
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

Lootr.ItemRepository.define('melon', {
	name: 'melon',
	character: '%',
	foreground: '#33FF33',
	foodValue: 35,
	consumptions: 4,
	components: [Lootr.ItemComponents.Edible]
});
module.exports = {
	extends: 'lighthouse:default',

	passes: [{
		passName: 'defaultPass',
		gatherers: [
			'memory-gatherer'
		]
	}],

	audits: [
		'memory-usage',
		'javascript-object-count'
	],

	categories: {
		mysite: {
			title: 'My Custom Audits',
			description: 'Checks the memory usage and object count',
			auditRefs: [
				{id: 'memory-usage', weight: 1},
				{id: 'javascript-object-count', weight: 1}
			]
		}
	}
};

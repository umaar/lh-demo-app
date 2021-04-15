const Audit = require('lighthouse').Audit;

const maxObjectCount = 1000000;

class JavaScriptObjectCount extends Audit {
	static get meta() {
		return {
			id: 'javascript-object-count',
			title: 'The total number of JavaScript objects is acceptable',
			failureTitle: 'There are too many JavaScript objects on the page',
			description: `An audit to check that the amount of JavaScript objects on the page is less than ${maxObjectCount}.`,
			requiredArtifacts: ['MemoryGatherer']
		};
	}

	static audit(artifacts) {
		const numberOfObjects = artifacts.MemoryGatherer.numberOfObjects;
		const success = numberOfObjects < maxObjectCount;

		return {
			score: Number(success),
			displayValue: `Object count is ${numberOfObjects}`
		};
	}
}

module.exports = JavaScriptObjectCount;

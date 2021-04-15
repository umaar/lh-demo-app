const Audit = require('lighthouse').Audit;

const maxSizeInMegabytes = 70;

class MemoryUsage extends Audit {
	static get meta() {
		return {
			id: 'memory-usage',
			title: 'Memory usage is not too high',
			failureTitle: 'JavaScript memory usage is too high',
			description: `An audit to check that the used JavaScript memory is less than ${maxSizeInMegabytes} MB`,
			requiredArtifacts: ['MemoryGatherer']
		};
	}

	static audit(artifacts) {
		const usedJSHeapSize = artifacts.MemoryGatherer.usedJSHeapSize;
		const sizeInMB = (usedJSHeapSize / (1024 * 1024)).toFixed(2);
		const success = sizeInMB < maxSizeInMegabytes;

		return {
			score: Number(success),
			displayValue: `Memory usage is ${sizeInMB} MB`
		};
	}
}

module.exports = MemoryUsage;

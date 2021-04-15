require('dotenv').config();

function sleep(ms = 1000) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

const Gatherer = require('lighthouse').Gatherer;
const Puppeteer = require('puppeteer-core');

async function connect(driver) {
	const browser = await Puppeteer.connect({
		browserWSEndpoint: await driver.wsEndpoint(),
		defaultViewport: null
	});
	const {targetInfo} = await driver.sendCommand('Target.getTargetInfo');
	const puppeteerTarget = (await browser.targets())
		.find(target => target._targetId === targetInfo.targetId);
	const page = await puppeteerTarget.page();
	return {browser, page, executionContext: driver.executionContext};
}

const countObjects = async page => {
	const prototypeHandle = await page.evaluateHandle(() => Object.prototype);
	const objectsHandle = await page.queryObjects(prototypeHandle);
	const numberOfObjects = await page.evaluate(instances => instances.length, objectsHandle);

	await Promise.all([
		prototypeHandle.dispose(),
		objectsHandle.dispose()
	]);

	return numberOfObjects;
};

class MemoryGatherer extends Gatherer {
	async afterPass(options) {
		const {driver} = options;
		const {page} = await connect(driver);

		const currentURL = page.url();
		// This is a hack!
		if (currentURL.startsWith(process.env.LOGIN_URL)) {
			await page.type('#username', process.env.USERNAME, {delay: 16});
			await sleep();
			await page.click('#button-username');
			await sleep();
			await page.type('#password', process.env.PASSWORD, {delay: 16});
			await sleep();
			await page.click('#button-password');
			await sleep(6000);
		}

		const usedJSHeapSize = await page.evaluate(() => {
			return performance.memory.usedJSHeapSize; // eslint-disable-line no-undef
		});

		const numberOfObjects = await countObjects(page);

		return {
			usedJSHeapSize,
			numberOfObjects
		};
	}
}

module.exports = MemoryGatherer;

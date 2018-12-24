const Combinatorics = require('js-combinatorics');
const chalk = require('chalk');
const { performance } = require('perf_hooks');
const { renderBlocks, renderDifference } = require('./draw.js');

const checkValidity = (v, k, l) => {
	if (l * (v - 1) !== k * (k - 1)) {
		return {
			valid: false,
			reason: {
				message: 'A BIBD with the specified parameters does not exist',
				detail: 'Failed check: λ * (v - 1) = k * (k - 1)',
			},
		};
	}

	if (!(v % 2) && Math.sqrt((k - l)) % 1 !== 0) {
		// v is even, k - λ must be a square
		return {
			valid: false,
			reason: {
				message: 'An SBIBD with the specified parameters does not exist',
				detail: 'Failed check: v is even -> (k - λ) is a square',
			},
		};
	}
	return { valid: true };
};

const getPossibleValues = (v) => {
	const input = [];
	for (let i = 0; i < v; i++) {
		input.push(i);
	}
	return input;
};

const findBlockDesign = (input, v, l, k, skip) => {
	const combinations = Combinatorics.bigCombination(input, v - k);
	const totalCombinations = combinations.length;
	if (totalCombinations > 10000) {
		console.log(chalk.yellow('[WARN] A large number of combinations must be checked. Performance may be affected.'));
		console.log(chalk.grey(`\t${totalCombinations} possibilities must be checked`));
	}
	// Find appropriate values
	let result = null;
	let combination = combinations.next();
	let iterationCount = 0;
	let elapsedTime = 0;
	let resultBlock;
	let differenceSet;
	let matchesCount = 0;
	while (combination) {
		differenceSet = [];
		iterationCount += 1;
		const start = performance.now();
		resultBlock = input;
		for (let i = 0; i < combination.length; i++) {
			resultBlock = resultBlock.filter((elem) => elem !== combination[i]);
		}
		const vals = [];
		for (let i = 0; i < resultBlock.length; i++) {
			differenceSet.push([]);
			for (let j = 0; j < resultBlock.length; j++) {
				const val = resultBlock[i] - resultBlock[j];
				if (val >= 0) {
					vals.push(val);
					differenceSet[i].push(val);
				} else if (val < 0) {
					vals.push(v + val);
					differenceSet[i].push(v + val);
				}
			}
		}
		const map = {};
		vals.forEach((value) => {
			if (!map[value]) {
				map[value] = 0;
			}
			map[value] += 1;
		});
		let success = true;
		Object.keys(map).forEach((key) => {
			if (key !== '0' && map[key] !== l) {
				success = false;
			}
		});
		if (success) {
			if (matchesCount >= skip) {
				result = resultBlock;
				break;
			}
			matchesCount += 1;

		} else {
			if (!(iterationCount % (totalCombinations > 1000000 ? 100000 : totalCombinations > 500000 ? 100000 : 1000))) {
				const remainingIterations = totalCombinations - iterationCount;
				const avgPerIteration = elapsedTime / iterationCount;
				const remainingMsEstimate = avgPerIteration * remainingIterations;
				console.log(chalk.cyan(`[UPDATE] ${iterationCount} combinations finished checking. (${Math.round(iterationCount / totalCombinations * 100)}%)`));
				console.log(chalk.grey(`\t${remainingMsEstimate} estimated ms remaining`));
			}
		}
		elapsedTime += performance.now() - start;
		combination = combinations.next();
	}

	return {
		result,
		differenceSet,
		resultBlock,
	};
};

// Params
// to generate: SBIBD(4t - 1, 2t - 1, t - 1)
const runSBIBD = (v, k, l, difference, skip = 0) => {
	// validate params
	const validity = checkValidity(v, k, l);
	if (!validity.valid) {
		console.log(chalk.red(`[ERROR] ${validity.reason.message}`));
		console.log(chalk.grey(`\t${validity.reason.detail})`));
		process.exit(1);
	}
	
	const input = getPossibleValues(v);
	const { result, differenceSet, resultBlock } = findBlockDesign(input, v, l, k, skip);

	if (result && result.length) {
		// Build starting block
		const starting = [];
		for (let i = 0; i < result.length; i++) {
			const val = result[i] - result[0];
			starting.push(val);
		}

		if (difference) {
			renderDifference(differenceSet, resultBlock, v);
		}

		renderBlocks(v, starting);

	} else {
		console.log(chalk.red('An SBIBD with the specified parameters does not exist'));
		process.exit(0);
	}
};

module.exports = {
	runSBIBD,
	checkValidity,
	getPossibleValues,
	findBlockDesign,
};
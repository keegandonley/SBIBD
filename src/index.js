#! /usr/bin/env node
const Combinatorics = require('js-combinatorics');
const program = require('commander');
const npackage = require('../package.json');
const chalk = require('chalk');
const distinctColors = require('distinct-colors');
const { performance } = require('perf_hooks');

// Params
// to generate: SBIBD(4t - 1, 2t - 1, t - 1)
const runSBIBD = (v, k, l) => {
	// validate params
	if (l * (v - 1) !== k * (k - 1)) {
		console.log(chalk.red('[ERROR] A BIBD with the specified parameters does not exist'));
		console.log(chalk.grey('\tFailed check: λ * (v - 1) = k * (k - 1)'));
		process.exit();
	}

	if (!(v % 2) && Math.sqrt((k - l)) % 1 !== 0) {
		// v is even, k - λ must be a square
		console.log(chalk.red('[ERROR] An SBIBD with the specified parameters does not exist'));
		console.log(chalk.grey('\tFailed check: v is even -> (k - λ) is a square'));
		process.exit();
	}

	// Color palette for output
	const palette = distinctColors({ count: v, lightMin: 50 }).map((Color) => Color.hex());

	// Build possible values
	const input = [];
	for (let i = 0; i < v; i++) {
		input.push(i);
	}


	// Find appropriate values
	let result = null;
	const combinations = Combinatorics.bigCombination(input, v - k);
	const totalCombinations = combinations.length;
	if (totalCombinations > 10000) {
		console.log(chalk.yellow('[WARN] A large number of combinations must be checked. Performance may be affected.'));
		console.log(chalk.grey(`\t${totalCombinations} possibilities must be checked`));
	}
	let a;
	let iters = 0;
	let elapsed = 0;
	while (a = combinations.next()) {
		iters += 1;
		const start = performance.now();
		let res = input;
		for (let i = 0; i < a.length; i++) {
			res = res.filter((elem) => elem !== a[i]);
		}
		const vals = [];
		for (let i = 0; i < res.length; i++) {
			for (let j = 0; j < res.length; j++) {
				const val = res[i] - res[j];
				if (val > 0) {
					vals.push(val);
				} else if (val < 0) {
					vals.push(v + val);
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
			if (map[key] !== l) {
				success = false;
			}
		});
		if (success) {
			result = res;
			break;
		} else {
			if (!(iters % (totalCombinations > 1000000 ? 100000 : totalCombinations > 500000 ? 100000 : 1000))) {
				const remainingIterations = totalCombinations - iters;
				const avgPerIteration = elapsed / iters;
				const remainingMsEstimate = avgPerIteration * remainingIterations;
				console.log(chalk.green(`[UPDATE] ${iters} combinations finished checking. (${Math.round(iters / totalCombinations * 100)}%)`));
				console.log(chalk.grey(`\t${remainingMsEstimate} estimated ms remaining`));
			}
		}
		elapsed += performance.now() - start;
	}


	if (result && result.length) {
		// Build starting block
		const starting = []
		for (let i = 0; i < result.length; i++) {
			const val = result[i] - result[0];
			starting.push(val);
		}

		// Render remaining blocks
		for (let i = 0; i < v; i++) {
			let idxStr = String(i);
			if (idxStr.length === 1) {
				idxStr = ` ${idxStr}`;
			}
			process.stdout.write(chalk.grey(`${idxStr}: { `))
			starting.map((val) => (val + i) % v).forEach((val, col) => {
				let str = String(val);
				if (str.length === 1) {
					str = ` ${str}`;
				}
				process.stdout.write(chalk.hex(palette[val])(`${str}`));
				process.stdout.write(chalk.grey(col === starting.length - 1 ? ' ' : `,  `));
			})
			process.stdout.write(chalk.grey('}\n'));
		}
	} else {
		console.log(chalk.red('An SBIBD with the specified parameters does not exist'));
	}
}

program
	.version(npackage.version)
	.option('-v, --vVal <vVal>', 'The value for param v')
	.option('-r, --rVal <rVal>', 'The value for param r')
	.option('-l, --lVal <lVal>', 'The value for param λ')
	.parse(process.argv);

	let { vVal, rVal, lVal } = program;
	if (!vVal || !rVal || !lVal) {
		console.log(chalk.red('[ERROR] Params not provided for an SBIBD. Use -v <v value> -r <r value> -l <λ value> '));
		process.exit(1);
	}

	try {
		vVal = parseInt(vVal);
		rVal = parseInt(rVal);
		lVal = parseInt(lVal);
	} catch (e) {
		console.log(chalk.red('[ERROR] Params must be integers'));
		console.log(chalk.grey(e.message));
	}

	runSBIBD(vVal, rVal, lVal);
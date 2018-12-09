#! /usr/bin/env node
const Combinatorics = require('js-combinatorics');
const program = require('commander');
const npackage = require('../package.json');
const chalk = require('chalk');
const distinctColors = require('distinct-colors');
const { performance } = require('perf_hooks');

const padValue = (val) => {
	let temp = String(val);
	if (temp.length === 1) {
		temp = ` ${temp}`;
	}
	return temp;
}

const renderDifference = (ds, res, v) => {
	console.log(chalk.green(`\n[SUCCESS] Difference set modulo ${v}:\n`));
	process.stdout.write('  ');
	res.forEach((val) => {
		const temp = padValue(val);
		process.stdout.write(chalk.yellow(`  ${temp}  `));
	});
	process.stdout.write('\n\n');
	ds.forEach((row, index) => {
		let temp = padValue(res[index]);
		process.stdout.write(chalk.yellow(`${temp}  `));
		row.forEach((col) => {
			temp = padValue(col);
			process.stdout.write(chalk.grey(`${temp}    `));
		});
		process.stdout.write('\n\n');
	});
}

const renderBlocks = (v, starting) => {
	// Color palette for output
	const palette = distinctColors({ count: v, lightMin: 50 }).map((Color) => Color.hex());
	console.log(chalk.green('\n[SUCCESS] Symmetric BIBD:\n'));
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
}

// Params
// to generate: SBIBD(4t - 1, 2t - 1, t - 1)
const runSBIBD = (v, k, l, difference, skip = 0) => {
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
	let res;
	let ds;
	let matches = 0;
	while (a = combinations.next()) {
		ds = [];
		iters += 1;
		const start = performance.now();
		res = input;
		for (let i = 0; i < a.length; i++) {
			res = res.filter((elem) => elem !== a[i]);
		}
		const vals = [];
		for (let i = 0; i < res.length; i++) {
			ds.push([]);
			for (let j = 0; j < res.length; j++) {
				const val = res[i] - res[j];
				if (val >= 0) {
					vals.push(val);
					ds[i].push(val);
				} else if (val < 0) {
					vals.push(v + val);
					ds[i].push(v + val);
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
			if (matches >= skip) {
				result = res;
				break;
			}
			matches += 1;

		} else {
			if (!(iters % (totalCombinations > 1000000 ? 100000 : totalCombinations > 500000 ? 100000 : 1000))) {
				const remainingIterations = totalCombinations - iters;
				const avgPerIteration = elapsed / iters;
				const remainingMsEstimate = avgPerIteration * remainingIterations;
				console.log(chalk.cyan(`[UPDATE] ${iters} combinations finished checking. (${Math.round(iters / totalCombinations * 100)}%)`));
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

		if (difference) {
			renderDifference(ds, res, v);
		}

		renderBlocks(v, starting);

	} else {
		console.log(chalk.red('An SBIBD with the specified parameters does not exist'));
	}
}

program
	.version(npackage.version)
	.option('-v, --vVal <value>', 'The value for param v')
	.option('-r, --rVal <value>', 'The value for param r')
	.option('-l, --lVal <value>', 'The value for param λ')
	.option('-s, --skip <n>', 'Skip the first n valid starting blocks')
	.option('-d, --difference', 'Output the difference set used to generate the starting block')
	.parse(process.argv);

	let { vVal, rVal, lVal, difference, skip } = program;
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

	runSBIBD(vVal, rVal, lVal, difference, skip);
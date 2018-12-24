const distinctColors = require('distinct-colors');
const chalk = require('chalk');

const padValue = (val) => {
	let temp = String(val);
	if (temp.length === 1) {
		temp = ` ${temp}`;
	}
	return temp;
};

const renderDifference = (differenceSet, resultBlock, v) => {
	console.log(chalk.green(`\n[SUCCESS] Difference set modulo ${v}:\n`));
	process.stdout.write('  ');
	resultBlock.forEach((val) => {
		const temp = padValue(val);
		process.stdout.write(chalk.yellow(`  ${temp}  `));
	});
	process.stdout.write('\n\n');
	differenceSet.forEach((row, index) => {
		let temp = padValue(resultBlock[index]);
		process.stdout.write(chalk.yellow(`${temp}  `));
		row.forEach((col) => {
			temp = padValue(col);
			process.stdout.write(chalk.grey(`${temp}    `));
		});
		process.stdout.write('\n\n');
	});
};

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
		process.stdout.write(chalk.grey(`${idxStr}: { `));
		starting.map((val) => (val + i) % v).forEach((val, col) => {
			let str = String(val);
			if (str.length === 1) {
				str = ` ${str}`;
			}
			process.stdout.write(chalk.hex(palette[val])(`${str}`));
			process.stdout.write(chalk.grey(col === starting.length - 1 ? ' ' : ',  '));
		});
		process.stdout.write(chalk.grey('}\n'));
	}
};

module.exports = {
	padValue,
	renderBlocks,
	renderDifference,
};
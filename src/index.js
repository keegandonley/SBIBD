#! /usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const npackage = require('../package.json');
const { runSBIBD } = require('./coreLogic.js');

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
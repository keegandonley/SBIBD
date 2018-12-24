const { getPossibleValues, checkValidity, findBlockDesign } = require('./coreLogic.js');
const { padValue } = require('./draw.js');

test('gets all possible values given a v', () => {
	expect(getPossibleValues(15)).toEqual([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ]);
	expect(getPossibleValues(7)).toEqual([ 0, 1, 2, 3, 4, 5, 6 ]);
});

test('properly validates parameters when correct', () => {
	const result = checkValidity(15, 7, 3);
	expect(result.valid).toBe(true);
});

test('properly invalidates parameters when incorrect', () => {
	const result = checkValidity(14, 7, 3);
	expect(result.valid).toBe(false);
});

test('finds the first starting block for a valid configuration', () => {
	const input = getPossibleValues(15);
	const result = findBlockDesign(input, 15, 3, 7, 0);
	expect(result.result).toEqual([ 4, 6, 9, 10, 12, 13, 14 ]);
});

test('finds the second starting block for a valid configuration', () => {
	const input = getPossibleValues(15);
	const result = findBlockDesign(input, 15, 3, 7, 1);
	expect(result.result).toEqual([ 1, 2, 5, 7, 12, 13, 14 ]);
});

test('pads values of length 1', () => {
	const result = padValue(1);
	expect(result).toEqual(' 1');
});

test('doesn\'t pad values of length 2', () => {
	const result = padValue(10);
	expect(result).toEqual('10');
});
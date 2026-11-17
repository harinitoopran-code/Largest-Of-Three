const test = require('node:test');
const assert = require('node:assert');
const { largest } = require('../largest');

test('first is largest', () => assert.strictEqual(largest(9, 4, 2), 9));
test('second is largest', () => assert.strictEqual(largest(3, 8, 5), 8));
test('third is largest', () => assert.strictEqual(largest(1, 2, 7), 7));
test('negative numbers', () => assert.strictEqual(largest(-5, -2, -9), -2));
test('equal numbers', () => assert.strictEqual(largest(4, 4, 4), 4));
test('decimals', () => assert.strictEqual(largest(1.5, 2.5, 2.4), 2.5));
test('invalid input throws', () => assert.throws(() => largest(1, 'x', 3), TypeError));

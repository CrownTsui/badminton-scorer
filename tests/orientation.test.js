const test = require('node:test');
const assert = require('node:assert/strict');
const { getLandscapeTextOrientation } = require('../orientation.js');

test('maps both landscape angles to opposite text rotations', () => {
  assert.equal(getLandscapeTextOrientation(90, true), 'text-rotate-cw');
  assert.equal(getLandscapeTextOrientation(270, true), 'text-rotate-ccw');
  assert.equal(getLandscapeTextOrientation(-90, true), 'text-rotate-ccw');
});

test('does not rotate text outside a recognized landscape orientation', () => {
  assert.equal(getLandscapeTextOrientation(90, false), '');
  assert.equal(getLandscapeTextOrientation(0, true), '');
  assert.equal(getLandscapeTextOrientation(180, true), '');
  assert.equal(getLandscapeTextOrientation(undefined, true), '');
});

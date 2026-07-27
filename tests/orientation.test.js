const test = require('node:test');
const assert = require('node:assert/strict');
const { getLandscapeTextOrientation, applyLandscapeTextOrientation } = require('../orientation.js');

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

test('replaces the previous direction class without disturbing unrelated classes', () => {
  const classes = new Set(['app-state']);
  const root = {
    classList: {
      remove: (...names) => names.forEach((name) => classes.delete(name)),
      add: (name) => classes.add(name)
    }
  };

  applyLandscapeTextOrientation(root, 90, true);
  assert.deepEqual([...classes].sort(), ['app-state', 'text-rotate-cw']);

  applyLandscapeTextOrientation(root, 270, true);
  assert.deepEqual([...classes].sort(), ['app-state', 'text-rotate-ccw']);
});

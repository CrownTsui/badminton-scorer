# Landscape Text Rotation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rotate all visible text 90° in the appropriate direction for each landscape device orientation while preserving the scorer's layout, controls, and game behavior.

**Architecture:** Add a tiny dependency-free browser-global/CommonJS orientation helper that maps a screen-orientation angle plus viewport orientation to a root CSS class. The page loads it before its existing script, listens to Screen Orientation API changes and legacy orientation changes, and rotates only text wrappers so panel and button surfaces remain fixed.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js built-in test runner.

## Global Constraints

- `90` applies clockwise text rotation; `270` and `-90` apply counter-clockwise text rotation.
- Apply a rotation only when `matchMedia('(orientation: landscape)').matches` is true.
- `0`, `180`, unknown values, and unsupported APIs leave text unrotated.
- Do not alter scoring, keyboard shortcuts, local storage, controls, panel geometry, or touch targets.
- Do not animate orientation changes.
- Do not stage either untracked image file.

---

### Task 1: Direction-class helper with automated tests

**Files:**
- Create: `orientation.js`
- Create: `tests/orientation.test.js`

**Interfaces:**
- Produces: `getLandscapeTextOrientation(angle, isLandscape): 'text-rotate-cw' | 'text-rotate-ccw' | ''`.
- Consumes: a numeric `screen.orientation.angle` and a boolean viewport-landscape flag.

- [ ] **Step 1: Write the failing test**

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/orientation.test.js`

Expected: FAIL because `orientation.js` does not exist.

- [ ] **Step 3: Write minimal implementation**

```js
(function (global) {
  function getLandscapeTextOrientation(angle, isLandscape) {
    if (!isLandscape) return '';
    if (angle === 90) return 'text-rotate-cw';
    if (angle === 270 || angle === -90) return 'text-rotate-ccw';
    return '';
  }

  const api = { getLandscapeTextOrientation };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.LandscapeTextOrientation = api;
})(globalThis);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/orientation.test.js`

Expected: PASS with two passing subtests.

- [ ] **Step 5: Commit**

```bash
git add orientation.js tests/orientation.test.js
git commit -m "Add landscape orientation helper"
```

### Task 2: Apply direction state and rotate text-only wrappers

**Files:**
- Modify: `index.html:1-1005`
- Modify: `orientation.js`
- Test: `tests/orientation.test.js`

**Interfaces:**
- Consumes: `getLandscapeTextOrientation(angle, isLandscape)` from `orientation.js`.
- Produces: root `text-rotate-cw` or `text-rotate-ccw` class and a `.rotatable-text` visual wrapper for every static and generated visible text string.

- [ ] **Step 1: Write the failing test**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { applyLandscapeTextOrientation } = require('../orientation.js');

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/orientation.test.js`

Expected: FAIL because `applyLandscapeTextOrientation` is not exported.

- [ ] **Step 3: Write minimal implementation**

```js
(function (global) {
  function getLandscapeTextOrientation(angle, isLandscape) {
    if (!isLandscape) return '';
    if (angle === 90) return 'text-rotate-cw';
    if (angle === 270 || angle === -90) return 'text-rotate-ccw';
    return '';
  }

  function applyLandscapeTextOrientation(root, angle, isLandscape) {
    root.classList.remove('text-rotate-cw', 'text-rotate-ccw');
    const className = getLandscapeTextOrientation(angle, isLandscape);
    if (className) root.classList.add(className);
  }

  const api = { getLandscapeTextOrientation, applyLandscapeTextOrientation };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.LandscapeTextOrientation = api;
})(globalThis);
```

In `index.html`, load `orientation.js` with `<script src="orientation.js"></script>` before the application script. Add `syncLandscapeTextOrientation()` that calls `window.LandscapeTextOrientation.applyLandscapeTextOrientation(document.documentElement, screen.orientation?.angle, matchMedia('(orientation: landscape)').matches)`, call it during initialization, listen to `screen.orientation.change` when available, and also listen to `window.orientationchange` and `window.resize`.

Wrap visible text in `.rotatable-text` child spans. For dynamic result content, emit the same wrapper in the template strings. Keep panel and button element surfaces outside the wrapper. Add:

```css
.rotatable-text { display: inline-block; }
.text-rotate-cw .rotatable-text { transform: rotate(90deg); }
.text-rotate-ccw .rotatable-text { transform: rotate(-90deg); }
```

For score nodes that already use transform-based pulse feedback, combine direction with the existing scale in their transform rule rather than replacing either effect.

- [ ] **Step 4: Run automated and static verification**

Run: `node --test tests/orientation.test.js && node -e "const fs=require('fs'); const html=fs.readFileSync('index.html','utf8'); new Function(html.match(/<script>([\\s\\S]*?)<\\/script>/)[1]); console.log('JavaScript syntax OK');" && git diff --check`

Expected: both orientation tests pass, JavaScript syntax reports `OK`, and `git diff --check` emits no output.

- [ ] **Step 5: Manually verify supported and fallback states**

Use browser device emulation or a physical phone to verify the following:

1. In `90°` landscape, text is clockwise while panels and controls remain in place.
2. In `270°` landscape, text is counter-clockwise while panels and controls remain in place.
3. In portrait, text returns to normal.
4. With `screen.orientation` unavailable, text remains normal in landscape.
5. Score, undo, pause, reset, result overlay, and keyboard controls still work.

- [ ] **Step 6: Commit**

```bash
git add index.html orientation.js tests/orientation.test.js
git commit -m "Rotate text for landscape device direction"
```

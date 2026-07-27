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

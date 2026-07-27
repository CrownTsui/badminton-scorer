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

/*
 * merlee.js - stringify
 * Copyright © Mwelwa Nkuta 2024
 * MIT Licensed
 */

function createCircularFilter() {
  const visited = new Set();
  const MAX_DEPTH = 29;

  /**
   * Filter function to handle circular references and depth limit
   * @param  {any} key
   * @param  {any} value
   * @param  {number} depth
   * @return {any} value
   */
  function circularFilter(key, value, depth) {
    if (depth > MAX_DEPTH) return '[Unknown]';

    if (typeof value === 'object' && value !== null) {
      if (visited.has(value)) return '[Circular]';
      visited.add(value); // Mark object as visited
    }

    return value;
  }

  return circularFilter;
}

/**
 * Stringify function with circular reference handling
 * @param  {any} data
 * @return {string} JSON string
 */
function stringify(data) {
  const circularFilter = createCircularFilter();

  return JSON.stringify(data, (key, value) => circularFilter(key, value, 0));
}

function isJSON(str) {
  try {
    const parsed = JSON.parse(str);
    if (parsed && typeof parsed === 'object') {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

// module.exports = {
//   stringify,
//   isJSON,
// };
export { stringify, isJSON };

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
   */
  function circularFilter(
    _key: string,
    value: unknown,
    depth: number
  ): unknown {
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
 */
export function stringify(data: unknown): string {
  const circularFilter = createCircularFilter();

  return JSON.stringify(data, (key, value) => circularFilter(key, value, 0));
}

export function isJSON(str: string) {
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

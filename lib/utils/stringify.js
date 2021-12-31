/*
 * merlee.js - stringify
 * Copyright © Mwelwa Nkuta 2021
 * MIT Licensed
 */

function filter() {
  let i = 0;
  /**
   * @param  {any} key
   * @param  {any} value
   */

  return (key, value) => {
    const isCircular = i !== 0 &&
      typeof censor === 'object' &&
      typeof value == 'object' &&
      censor == value;

    if (isCircular) {
      return '[Circular]';
    }
    if (i >= 29) return '[Unknown]';
    ++i;

    return value;
  };
}

module.exports = function stringify(data) {
  return JSON.stringify(data, filter());
};

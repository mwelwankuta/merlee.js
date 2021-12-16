function filter() {
  var i = 0;
  /**
   * @param  {any} key
   * @param  {any} value
   */
  return (key, value) => {
    if (
      i !== 0 &&
      typeof censor === 'object' &&
      typeof value == 'object' &&
      censor == value
    )
      return '[Circular]';
    if (i >= 29) return '[Unknown]';
    ++i;

    return value;
  };
}

module.exports = function stringify(data) {
  return JSON.stringify(data, filter());
};

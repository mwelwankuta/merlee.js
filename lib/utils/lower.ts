/*
 * merlee.js - lower
 * Copyright © Mwelwa Nkuta 2021
 * MIT Licensed
 */

/*
 * returns lower cased strings
 * @param {string} data
 */

export default function (data: string | undefined) {
  if (data) return data.toLowerCase();
  return '';
}

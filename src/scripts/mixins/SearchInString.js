/**
 * Search in a large string of 'key value' matches, delimited by single quote.
 * http://stackoverflow.com/a/3976066
 * @param {string} value The value to search.
 * @param {string} string The string of possible matches 'key value'.
 * @param {number} limit The results limit.
 */
var SearchInString = function(value, string, limit) {

  // Delimiter single quote.
  var reg = new RegExp("'(\\d+) ([^']*" + value + "[^']*)'", "gi");

  var results = [];

  var result;

  var i = 0;

  while (result = reg.exec(string)) {

    results.push(result[1]);
    i ++;

    if (i >= limit) {
      break;
    }
  }

  return results;
};

module.exports = SearchInString;

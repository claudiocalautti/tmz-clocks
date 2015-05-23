/**
 * Determine if DST is observed by using unpacked data from /data/unpacked/2015d.json.
 *
 * Notes:
 * 1 Year in ms: 31536000730
 * 1 Month in ms: 2628000060
 * 1 Day in ms: 86400002
 * 1 Hour in ms: 3600000
 * 1 minute in ms: 60000
 */

// http://momentjs.com/timezone/docs/#/data-formats/
// var zone = {
//   name    : 'America/Los_Angeles',          // the unique identifier
//   abbrs   : ['PDT', 'PST'],                 // the abbreviations
//   untils  : [1414918800000, 1425808800000], // the timestamps in milliseconds
//   offsets : [420, 480]                      // the offsets in minutes
// };

var zone = {
  name: 'Europe/London',
  abbrs: ['GMT', 'BST', 'GMT'],
  untils: [1427590800000, 1445734800000, null],
  offsets: [0, -60, 0]
};

var DST = {
  start: zone.untils[0],
  end: zone.untils[1]
};

// Number of milliseconds elapsed since 1 January 1970 00:00:00 UTC.
var now = Date.now();

var isDST = now > DST.start && now < DST.end;

console.log(isDST);

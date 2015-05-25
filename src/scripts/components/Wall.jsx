var React = require('react');
var Search = require('./Search.jsx');
var Clock = require('./Clock.jsx');

/**
 * Wall component.
 * @description Get zones and generate all clocks.
 *              Initialise Search component.
 *              ...filters, keep data with local storage etc.
 * @constructor
 */
module.exports = React.createClass({

  displayName: 'Wall',

  /**
   * Render.
   * @return {ReactElement} The Wall component.
   */
  render: function() {

    var city = {
      "geonameid": 3165524,
      "name": "Turin",
      "country": "IT",
      "lat": 45.07049,
      "long": 7.68682,
      "zone": "Europe/Rome"
    };

    var country = {
      "name": "Italy",
      "abbr": "IT",
      "zones": [
        "Europe/Rome"
      ]
    };

    var zone = {
      "name": "Europe/Rome",
      "abbrs": [
        "CET",
        "CEST",
        "CET"
      ],
      "untils": [
        1427590800000,
        1445734800000,
        null
      ],
      "offsets": [
        -60,
        -120,
        -60
      ]
    };

    return (
      <main>
        <h1>Wall</h1>
        <Search />
        <Clock
          city={city}
          zone={zone}
          showCountry={true}
          hours12={false}
          debug={false}
        />
      </main>
    );
  }
});

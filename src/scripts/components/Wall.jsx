/** @jsx React.DOM */

'use strict';

var React = require('react');

var Search = require('./Search.jsx');
var Clock = require('./Clock.jsx');

/**
 * Wall component.
 */
var Wall = React.createClass({

  /**
   * Render.
   * @return {ReactElement} The Wall component.
   */
  render: function() {

    var cities = this.props.cities;

    var you = this._getYou();

    // var zoneClocks = this._getClocks();
    var cityClocks = this._getCityClocks();

    return (
      <main>
        <h1>Wall</h1>
        <Search />
        <div className="you">{you}</div>
        <div className="clocks">{cityClocks}</div>
      </main>
    );
  },

  _getYou: function() {

    return <Clock
      hours12={false}
      debug={false} />;
  },

  _getClocks: function() {

    return this.props.zones.map(function(zone, i) {

      var city = {
        "name": "Turin",
        "country": "IT",
        "lat": 45.07049,
        "long": 7.68682,
        "zone": "Europe/Rome"
      };

      return <Clock
        key={i}
        city={city}
        zone={zone}
        hours12={false}
        debug={false} />;

    }, this);
  },

  _getCityClocks: function() {

    var zones = this._createZonesObject();

    return this.props.cities.map(function(city, i) {

      var zone = zones[city.zone];

      if (zone) {
        return <Clock
          key={i}
          city={city}
          zone={zone}
          showCity={true}
          showCountry={true}
          showDay={true}
          hours12={false}
          debug={false} />;
      }


    }, this);
  },

  _createZonesObject: function() {

    var zones = this.props.zones;

    var zonesObj = {};

    zones.forEach(function(zone, i) {
      zonesObj[zone.name] = zone;
    });

    return zonesObj;
  }

});

module.exports = Wall;

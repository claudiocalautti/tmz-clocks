/** @jsx React.DOM */

'use strict';

var React = require('react');

var Search = require('./Search.jsx');
var Clock = require('./Clock.jsx');
var SearchInString = require('../mixins/SearchInString.js');

/**
 * Wall component.
 */
var Wall = React.createClass({

  propTypes: {
    cities: React.PropTypes.object,
    zones: React.PropTypes.object
  },

  /**
   * Invoked once before the component is mounted.
   * The return value will be used as the initial value of this.state.
   * @type {Object}
   */
  getInitialState: function() {
    return {
      favorites: [],
      favorite: null
    };
  },

  _findCity: function(name) {

    var id = SearchInString(name, this.props.cities.search);

    var city = this.props.cities.data[id];

    console.clear();
    console.log('Found: ', city);

    this.setState({
      favorite: city
    });
  },

  _addFavorite: function() {

    var city = this.state.favorite;

    if (!city) return;

    var zone = this.props.zones[this.state.favorite.zone];

    console.log('ADD: ', city);

    var favorite = {
      city: city,
      zone: zone
    }

    this.setState({
      favorites: this.state.favorites.concat(favorite),
      favorite: null
    });
  },

  /**
   * Render.
   * @return {ReactElement} The Wall component.
   */
  render: function() {

    var cities = this.props.cities;

    var you = this._getYou();

    var favorites = this._getFavoriteClocks();

    // var zoneClocks = this._getClocks();
    // var cityClocks = this._getCityClocks();

    return (
      <main>
        <h1>Wall</h1>
        <Search onChange={this._findCity} />
        <button type="button" onClick={this._addFavorite}>ADD CITY</button>
        <div className="you">{you}</div>
        <div className="clocks">{favorites}</div>
      </main>
    );
  },

  _getYou: function() {

    return <Clock
      city={undefined}
      zone={undefined}
      hours12={false}
      debug={false} />;
  },

  _getFavoriteClocks: function() {

    return this.state.favorites.map(function(favorite, i) {

      return <Clock
        key={i}
        city={favorite.city}
        zone={favorite.zone}
        hours12={false}
        debug={true} />;

    }, this);
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

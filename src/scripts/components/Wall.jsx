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
   * Validate props.
   * @type {Object}
   */
  propTypes: {
    cities: React.PropTypes.object.isRequired,
    zones: React.PropTypes.object.isRequired,
    showUserClock: React.PropTypes.bool,
    hours12: React.PropTypes.bool
  },

  /**
   * Invoked once before the component is mounted.
   * The return value will be used as the initial value of this.state.
   */
  getInitialState: function() {
    return {
      favorites: JSON.parse(localStorage.getItem('favorites')) || []
    };
  },

  /**
   * Add new city and its timezone to favorites.
   * @param {Object} city The selected city.
   */
  addFavorite: function(city) {

    if (!city) {
      return;
    }

    var zone = this.props.zones[city.zone];

    var favorite = {
      city: city,
      zone: zone
    };

    var favorites = this.state.favorites.concat(favorite);

    localStorage.setItem('favorites', JSON.stringify(favorites));

    this.setState({
      favorites: favorites
    });
  },

  /**
   * Remove a city and its timezone from favorites.
   * @param {number} index The index of the object in the favorites array.
   */
  removeFavorite: function(index) {

    var favorites = this.state.favorites;

    favorites.splice(index, 1);

    localStorage.setItem('favorites', JSON.stringify(favorites));

    this.setState({
      favorites: favorites
    });
  },

  /**
   * Get user local time clock.
   * @return {ReactElement} The clock with the user machine time.
   * @private
   */
  _getUserClock: function() {

    return <Clock hours12={this.props.hours12} />;
  },

  /**
   * Get the user favorite clocks.
   * @return {ReactElement} The user favorite clocks.
   * @private
   */
  _getFavoriteClocks: function() {

    return this.state.favorites.map(function(favorite, i) {
      return <Clock
        key={i}
        id={i}
        city={favorite.city}
        zone={favorite.zone}
        hours12={this.props.hours12}
        removeClock={this.removeFavorite}
        debug={false} />;
    }, this);
  },

  /**
   * Render.
   * @return {ReactElement} The Wall component.
   */
  render: function() {

    return (
      <main>
        <Search
          searchString={this.props.cities.search}
          items={this.props.cities.data}
          onSelect={this.addFavorite} />

        {this.props.showUserClock ?
          <div className="user">
            {this._getUserClock()}
          </div>
        : null}

        <div className="favorites">
          {this._getFavoriteClocks()}
        </div>
      </main>
    );
  }
});

module.exports = Wall;

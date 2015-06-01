/** @jsx React.DOM */

'use strict';

var React = require('react');

var SearchInString = require('../mixins/SearchInString.js');

/**
 * Search component.
 * Capture user input and display a filtered list of cities,
 * when item is clicked dispatch new city.
 */
var Search = React.createClass({

  /**
   * Validate props.
   * @type {Object}
   */
  propTypes: {
    searchString: React.PropTypes.string.isRequired,
    items: React.PropTypes.object.isRequired,
    onSelect: React.PropTypes.func.isRequired
  },

  /**
   * Invoked once before the component is mounted.
   * The return value will be used as the initial value of this.state.
   */
  getInitialState: function() {
    return {
      matches: []
    };
  },

  /**
   * Input box text has changed, trigger update.
   * @param {Event} e The event object.
   */
  handleKeyUp: function(e) {

    var value = this.refs.searchInput.getDOMNode().value;

    this._displayMatches(value);
  },

  /**
   * Handle click event. User has clicked an item from the list,
   * dispatch selected item and clear matches.
   * @param {Event} e The event object.
   */
  handleClick: function(match) {

    this.props.onSelect(match);

    this.setState({
      matches: []
    });

    this.refs.searchInput.getDOMNode().value = '';
  },

  /**
   * Get list of matching cities.
   * @param {string} value The search value.
   * @private
   */
  _displayMatches: function(value) {

    var limit = 10;

    var ids = SearchInString(value, this.props.searchString, limit);

    var matches = ids.map(function(id) {
      return this.props.items[id];
    }, this);

    this.setState({
      matches: matches
    });
  },

  /**
   * Render.
   * @return {ReactElement} The Search component.
   */
  render: function() {
    return (
      <div className="search">

        <input
          type="search"
          ref="searchInput"
          onKeyUp={this.handleKeyUp}
          placeholder="Search City..." />

        <ul>
          {this.state.matches.map(function(match, i) {
            return <li key={i} onClick={this.handleClick.bind(this, match)}>
                {match.name} ({match.country})
              </li>;
          }, this)}
        </ul>
      </div>
    );
  }
});

module.exports = Search;

/** @jsx React.DOM */

'use strict';

var React = require('react');

/**
 * Search component.
 * Capture user input and display a filtered list of countries
 * with related timezone, when item clicked dispatch new country.
 */
var Search = React.createClass({

  displayName: 'Search',

  /**
   * Render.
   * @return {ReactElement} The Search component.
   */
  render: function() {
    return (
      <div>
        <h2>Search</h2>
        <input type="search" value="" />
        <ul>
          <li>item</li>
          <li>item</li>
          <li>item</li>
        </ul>
      </div>
    );
  }
});

module.exports = Search;

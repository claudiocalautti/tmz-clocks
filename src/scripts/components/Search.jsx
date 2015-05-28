/** @jsx React.DOM */

'use strict';

var React = require('react');
var SearchInString = require('../mixins/SearchInString.js');

/**
 * Search component.
 * Capture user input and display a filtered list of countries
 * with related timezone, when item clicked dispatch new country.
 * http://stackoverflow.com/a/3976066
 */
var Search = React.createClass({

  propTypes: {
    onChange: React.PropTypes.func
  },

  getInitialState: function(){
    return {
      items:  this.props.items,
      matchingItems: [],
      searchValue: ''
    };
  },

  /**
   * Input box text has changed, trigger update.
  **/
  changeInput: function (e) {

    var value = this.refs.searchInput.getDOMNode().value;

    // On change input, trigger callback function.
    if (typeof this.props.onChange !== 'undefined') {
      this.props.onChange(value);
    }

  },

  /**
   * Render.
   * @return {ReactElement} The Search component.
   */
  render: function() {
    return (
      <div>
        <h2>Search</h2>
        <input type="search" ref="searchInput" onKeyUp={this.changeInput} />
      </div>
    );
  }
});

module.exports = Search;

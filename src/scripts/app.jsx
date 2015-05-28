/** @jsx React.DOM */

'use strict';

var React = require('react');

var Wall = require('./components/Wall.jsx');

var cities = require('./data/cities100000.min.js');
var zones = require('./data/zones.min.js');

/**
 * App.
 */
var App = React.createClass({

  render: function () {
    return (
      <Wall cities={cities} zones={zones} />
    );
  }

});

React.render(<App />, document.getElementById('main'));

/** @jsx React.DOM */

'use strict';

var React = require('react');

var Wall = require('./components/Wall.jsx');

var cities = require('./data/cities100000.js');
var zones = require('./data/zones.js');

/**
 * Render Wall with cities and zones.
 */
React.render(

  <Wall
    cities={cities}
    zones={zones}
    showUserClock={true}
    hours12={false} />,

  document.body
);

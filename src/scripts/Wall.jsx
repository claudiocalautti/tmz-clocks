/**
 * Wall Component.
 * @jsx React.DOM
 */
var Wall =  React.createClass({

  componentWillMount: function() {

    var database = 'api/tz-database-2014b.json';

    var XHR = new XMLHttpRequest();

    XHR.onload = this._onDataLoaded;

    XHR.open('GET', database, true);
    XHR.send();
  },

  getInitialState: function() {

    var state = {
      database: []
    };

    return state;
  },

  _onDataLoaded: function(event) {

    var jsonDB = JSON.parse(event.target.response);

    console.log(jsonDB.length);

    this.setState({
      database: jsonDB
    });
  },

  render: function() {

    var clocks = this.state.database.map(function(item, i) {

      var timezone = item.timezone;
      var offsets = item.offsets;

      // if (timezone === 'Australia/Hobart') {
        return <Clock key={i} timezone={item.timezone} offsets={item.offsets} />
      // }
    });

    var element = (
      <main>{clocks}</main>
    );

    return element;
  }

});

/**
 * Wall Component.
 * @jsx React.DOM
 */
var Wall =  React.createClass({

  getInitialState: function() {

    var state = {
      zones: [],
      countries: null
    };

    return state;
  },

  componentWillMount: function() {

    var zones = '/data/unpacked/2015d.json';
    var countries = '/data/meta/2015d.json';

    this._loadData(zones, this._addZones);
    this._loadData(countries, this._addCountries);
  },

  _loadData: function(path, callback) {

    var XHR = new XMLHttpRequest();

    XHR.onload = callback;

    XHR.open('GET', path, true);
    XHR.send();

    return XHR;
  },

  _addZones: function(e) {

    var json = JSON.parse(e.target.response);

    this.setState({
      zones: json.zones
    });
  },

  _addCountries: function(e) {

    var json = JSON.parse(e.target.response);

    this.setState({
      countries: json.countries
    });
  },

  render: function() {

      console.log('country',this.state.countries)
    if (this.state.countries && this.state.countries['Africa/Casablanca']) {

    }

    // console.log(this.state.countries);
    // console.log('zone', zone);

    var zone = this.state.zones;
    console.log('zone', zone);

    var clocks = this.state.zones.map(function(item, i) {

      // console.log(item);

      var timezone = item.name;
      var offsets = item.offsets;

      // if (timezone === 'Australia/Hobart') {
        return <Clock key={i} timezone={timezone} offsets={offsets} />
      // }
    });

    var element = (
      <main>{clocks}</main>
    );

    return element;
  }

});

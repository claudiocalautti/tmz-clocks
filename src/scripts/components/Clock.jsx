var React = require('react');

/**
 * Clock component (React docs on api methods).
 * @description Get country with its timezone data and calculate time.
 * @constructor
 */
module.exports = React.createClass({

  /**
   * Manually set component name because with browserify
   * react detect `exports` by default.
   * @type {string}
   */
  displayName: 'Clock',

  /**
   * Validate props.
   * @type {Object}
   */
  propTypes: {
    country: React.PropTypes.string.isRequired,
    zone: React.PropTypes.object.isRequired
  },

  /**
   * Invoked once before the component is mounted.
   * The return value will be used as the initial value of this.state.
   * Set initial time and date.
   * @type {Object}
   */
  getInitialState: function() {
    return {
      time: this._getTime(),
      date: this._getDate()
    };
  },

  /**
   * Invoked once, immediately before the initial rendering occurs.
   * Sync and start ticker.
   */
  componentWillMount: function() {

    var delay = this._syncTime();

    setTimeout(function() {

      this._tick();
      this.timer = setInterval(this._tick, 1000);

    }.bind(this), delay);
  },

  /**
   * Remove the timer when the component unmounts.
   */
  componentWillUnmount: function() {
    this.timer && clearInterval(this.timer);
  },

  /**
   * Sync time by detecting when next tick will occour.
   * @return {number} The amount of ms left before next tick.
   * @private
   */
  _syncTime: function() {

    var date = new Date();

    return 1000 - date.getMilliseconds();
  },

  /**
   * Ticker, update state to current time.
   * @private
   */
  _tick: function() {

    this.setState({
      time: this._getTime()
    });
  },

  /**
   * Set the clock object to current time.
   * @return {Object} The current time.
   * @private
   */
  _getTime: function() {

    var date = new Date();
    var offset = this._getOffset(date);

    var hh = date.getHours() + offset.HH;
    var mm = date.getMinutes() + offset.MM;

    if (hh < 0) {
      hh = 24 - Math.abs(hh);
    }

    if (mm > 60) {
      mm = mm - 60;
    }

    return {
      HH: this._pad(hh),
      MM: this._pad(mm),
      SS: this._pad(date.getSeconds())
    };
  },

  /**
   * Get offset.
   * @param {Object} date The `new Date()` object.
   * @private
   */
  _getOffset: function(date) {

    var isDST = this._isDST();

    var offset = date.getTimezoneOffset();

    var offsets = this.props.zone.offsets;

    // Last offset in array is associated with
    // untils `null` and never refer to DST.
    var lastOffset = offsets.length - 1;

    if (isDST) {
      offset -= offsets[lastOffset - 1];
    } else {
      offset -= offsets[lastOffset];
    }

    var HH = Math.floor(offset / 60);
    var MM = offset - (HH * 60);

    return {
      HH: HH,
      MM: MM
    };
  },

  /**
   * Detect if DST is currently observed.
   * @param {Object} date The `new Date()` object.
   * @private
   */
  _isDST: function() {

    var isDST = false;

    var PAIR = 2;

    var now = Date.now();

    var untils = this.props.zone.untils;

    // Remove last item in array when it's null.
    if (!untils[untils.length - 1]) {
      untils.pop();
    }

    // Warn if DST is observed more than twice.
    if (untils.length > PAIR * 2) {
      var zone = this.props.zone.name;
      console.warn('DST is observed more than twice this year in ' + zone);
    }

    // When there are [start, end] pairs.
    if (untils.length % PAIR === 0) {

      // Loop by 2 and check DST.
      for (var i = 0; i < untils.length; i += PAIR) {

        var start = untils[i];
        var end = untils [i + 1];

        // DST not started or finished.
        if (now < start || now > end) {
          continue;
        }

        // DST observed.
        if (now < end) {
          isDST = true;
        }
      }
    } else if (untils.length === 1) {
      // When there is only end, check if DST is still observed.
      if (now < untils[0]) {
        isDST = true;
      }
    }

    return isDST;
  },


  /**
   * Get current date.
   * @return {string} The current date formatted as DD:MM:YYYY.
   * @private
   */
  _getDate: function() {

    var date = new Date();

    var options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };

    return date.toLocaleDateString('en-GB', options);
  },

  /**
   * Format a Number in two length.
   * @param  {number} n The number to be converted.
   * @return {string}   The formatted string.
   * @private
   */
  _pad: function(n) {

    var nString = n.toString();

    return (n < 10) ? '0' + nString : nString;
  },

  /**
   * Render.
   * @return {ReactElement} The Clock component.
   */
  render: function() {

    var country = this.props.country;
    var zone = this.props.zone;

    var time = this.state.time;

    return (
      <div className="clock">
        <p>
          Country: <strong>{country}</strong>
        </p>
        <p>
          Zone: <strong>{zone.name} ({zone.abbrs[0]})</strong>
        </p>
        <p>
          Time: <strong>{time.HH}:{time.MM}:{time.SS}</strong>
        </p>
        <p>
          Date: <strong>{this.state.date}</strong>
        </p>
      </div>
    );
  }
});

/** @jsx React.DOM */

'use strict';

var React = require('react');

/**
 * Clock component.
 * Get city with its timezone data and calculate correct time.
 */
var Clock = React.createClass({

  /**
   * Validate props.
   * @type {Object}
   */
  propTypes: {
    id: React.PropTypes.number,
    city: React.PropTypes.object,
    zone: React.PropTypes.object,
    hours12: React.PropTypes.bool,
    removeClock: React.PropTypes.func,
    debug: React.PropTypes.bool
  },

  /**
   * Invoked once before the component is mounted.
   * The return value will be used as the initial value of this.state.
   */
  getInitialState: function() {

    var date = new Date();

    if (this.props.debug) {
      this.props.hours12 = false;
      this._testTime(date);
    }

    return {
      time: this._getTime(date)
    };
  },

  /**
   * Sync and start ticker.
   * Invoked once, immediately before the initial rendering occurs.
   */
  componentWillMount: function() {

    this._syncTick(function() {
      this._tick();
      this.timer = setInterval(this._tick, 1000);
    }, this);
  },

  /**
   * Remove the timer when the component unmounts.
   */
  componentWillUnmount: function() {

    this.timer && clearInterval(this.timer);
  },

  /**
   * Handle click event. Dispatch remove clock with id.
   * @param {Event} e The event object.
   */
  handleClick: function(e) {

    if (typeof this.props.removeClock === 'function') {
      this.props.removeClock(this.props.id);
    }
  },

  /**
   * Sync tick by detecting when next second will occour and fire callback.
   * @param {Function} callback The callback to run when second change.
   * @param {Object} context The instance context.
   * @private
   */
  _syncTick: function(callback, context) {

    var date = new Date();
    var delay = 1000 - date.getMilliseconds();

    setTimeout(callback.bind(context), delay);
  },

  /**
   * Ticker, update state to current time.
   * @private
   */
  _tick: function() {

    var date = new Date();

    this.setState({
      time: this._getTime(date)
    });
  },

  /**
   * Set the clock object to zone time, obtain difference
   * and add/subtract to local time (notice that diff.hh can be negative).
   * @param {Object} date The `new Date()` object.
   * @return {Object} The current zone time.
   * @private
   */
  _getTime: function(date) {

    var diff = this._getDifference(date);

    var hh = date.getHours() + diff.hh;
    var mm = date.getMinutes() + diff.mm;

    var hours12 = this.props.hours12;

    var when = this._setWhenSentence('Today, ', diff);

    // Once obtained the local hours/minutes and added the
    // difference from the desidered zone check edge cases A, B, C.

    // A: Minutes above one hour, go to next hour.
    if (mm >= 60) {
      hh ++;
      mm = mm - 60;
    }

    // B: At midnight local time, minus zone difference
    // hh will be negative and refer to a day behind.
    if (hh < 0) {

      // More than 24 hours behind, it can happen only between
      // UTC +14 (local) and UTC -12 (zone) and least for 2 hours or more.
      if (diff.hh < -24) {
        // TODO: Decrease a day in date can be done here.
        when = 'Two days behind';
        // Restart from midnight.
        hh += 24;
      } else {
        // TODO: Decrease a day in date can be done here.
        when = this._setWhenSentence('Yesterday, ', diff);
      }

      hh = 24 - Math.abs(hh);
    }

    // C: When difference greater than hours left to midnight,
    // hh will be equal to at least 24 and refer to a day ahead.
    if (hh > 23) {

      // More than a 24 hours ahead, it can happen only between
      // UTC -12 (local) and UTC +14 (zone) and least for 2 hours or more.
      if (diff.hh > 24) {
        // TODO: Increase a day in date can be done here.
        when = 'Two days ahead.';
      } else {
        // TODO: Increase a day in date can be done here.
        when = this._setWhenSentence('Tomorrow, ', diff);
      }

      hh = hh - 24;
    }

    // Set 12-hours clock.
    if (hours12) {
      hours12 = (hh >= 12) ? 'PM' : 'AM';
      // http://stackoverflow.com/a/14399178
      hh = ((hh + 11) % 12 + 1);
    }

    return {
      hh: this._pad(hh),
      mm: this._pad(mm),
      ss: this._pad(date.getSeconds()),
      hours12: hours12,
      when: when
    };
  },

  /**
   * Calculate zone difference from local time, subtract the zone UTC
   * offset (based on DST) to the local UTC offset and calculate zone
   * difference in hours and minutes.
   * @param {Object} date The `new Date()` object.
   * @return {Object} The zone difference in hours and minutes.
   * @private
   */
  _getDifference: function(date) {

    if (!this.props.zone) {
      return {
        hh: 0,
        mm: 0
      };
    }

    var isDST = this._isDST();

    // Local UTC offset in minutes.
    var offset = date.getTimezoneOffset(); // -60

    // Zone UTC offset in minutes.
    var offsets = this.props.zone.offsets; // 285 (4.75hrs)

    // Last offset in array is associated with
    // untils `null` and never refer to DST.
    var lastOffset = offsets.length - 1;

    if (isDST) {
      offset -= offsets[lastOffset - 1]; // -345
    } else {
      offset -= offsets[lastOffset];
    }

    // Zone difference in hours and minutes,
    // notice that minutes are never negative.
    var hh = Math.floor(offset / 60); // (-5.75) = -6
    var mm = offset - (hh * 60); // -345 - (-6*60) = 15

    return {
      hh: hh, // -6
      mm: mm // 15
    };
  },

  /**
   * Detect if DST is currently observed.
   * @return {boolean} True if DST is currently observed in the given zone.
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
    if (untils.length > 1) {

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
   * Set when sentence.
   * @param {String} day The named day(s) like `Today`, `Tomorrow`, etc.
   * @param {Object} diff The zone difference from local time.
   * @return {String} The when sentence.
   * @private
   */
  _setWhenSentence: function(day, diff) {

    var hh = diff.hh;
    var mm = diff.mm;

    // Just `Today` if no difference from local time.
    if (hh === 0 && mm === 0) {
      return day.replace(', ', '');
    }

    var hours;
    var direction = (hh > 0) ? ' ahead.' : ' behind.';

    if (Math.abs(hh) > 1) {
      hours = Math.abs(hh) + ' hours';
    } else {
      hours = Math.abs(hh) + ' hour';
    }

    if (hh > 0 && mm > 0) {
      hours = hh + 'h ' + mm + 'm'
    }

    return day + hours + direction;
  },

  /**
   * Format a Number in two length.
   * @param {number} n The number to be converted.
   * @return {string}   The formatted string.
   * @private
   */
  _pad: function(n) {

    var nString = n.toString();

    return (n < 10) ? '0' + nString : nString;
  },

  /**
   * Test my computed time with time given from `toLocaleString`
   * for supported zones only and log results.
   * @private
   */
  _testTime: function(date) {

    try {

      var zone = this.props.zone.name;

      var correctDateString = date.toLocaleString(undefined, {
        timeZone: zone
      });

      var correctDate = new Date(correctDateString);

      var myDate = this._getTime(date);

      console.log('\n');

      if (correctDate.getHours() !== Number(myDate.hh)) {

        console.log('%cHOURS WRONG in ' + zone,
          'color: red; font-weight:bold;');
      } else if (correctDate.getMinutes() !== Number(myDate.mm)) {

        console.log('%cHOURS WRONG in ' + zone,
          'color: red; font-weight:bold;');
      } else if (correctDate.getSeconds() !== Number(myDate.ss)) {

        console.log('%cSECONDS WRONG in ' + zone,
          'color: red; font-weight:bold;');
      } else {

        console.log('%cTIME CORRECT in ' + zone,
          'color: green; font-weight:bold;');
        console.log(correctDate);
        console.log(myDate);
      }

    } catch (e) {

      if (e instanceof RangeError) {
        console.log('%c' + e.message + ':', 'color: orange;');
      }
    }
  },

  /**
   * Render.
   * @return {ReactElement} The Clock component.
   */
  render: function() {

    var city = this.props.city;
    var time = this.state.time;

    return (
      <div className="clock">

        {this.props.debug && this.props.zone ?
          <p>TZ: {this.props.zone.name}</p>
        : null}

        {city ?
          <span className="remove" onClick={this.handleClick}>X</span>
        : null}

        <p>
          <strong>
            {city ? city.name : 'YOU'}
            {city && city.country ? ' (' + city.country + ')' : null}
          </strong>
        </p>

        <time>{time.hh}:{time.mm}:{time.ss}{
          time.hours12 ? ' ' + time.hours12 : null
        }</time>

        <p>{time.when}{time.diff}</p>
      </div>
    );
  }
});

module.exports = Clock;

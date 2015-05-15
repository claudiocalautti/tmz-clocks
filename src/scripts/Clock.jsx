/**
 * Clock Component.
 * Generate an element with the current time and name of a specific city.
 * @jsx React.DOM
 */
var Clock = React.createClass({

  /**
   * Validate props.
   * @type {Object}
   */
  propTypes: {
    timezone: React.PropTypes.string.isRequired,
    offsets: React.PropTypes.object
  },

  /**
   * Defines the value of `this.state` when the component is first mounted.
   * @return {Object} The state.
   */
  getInitialState: function() {

    var state = {
      city: this._getCity(),
      clock: this._setClock(),
      date: 'ADD DATE'
    };

    return state;
  },

  /**
   * Start a timer when the component mounts.
   */
  componentDidMount: function() {
    this.timer = setInterval(this._tick, 500);
  },

  /**
   * Remove the timer when the component unmounts.
   */
  componentWillUnmount: function() {
    this.timer && clearInterval(this.timer);
  },

  /**
   * Update method called from timer, which update one or more keys of state.
   * @private
   */
  _tick: function() {
    this.setState({
      clock: this._setClock()
    });
  },

  /**
   * Get the city from a timezone.
   * @return {String} The name of the city.
   * @private
   */
  _getCity: function() {

    var timezone = this.props.timezone.split('/');
    var city = timezone.pop();

    return city;
  },

  /**
   * Set the clock object to current time.
   * @return {Object} The current time.
   * @private
   */
  _setClock: function() {

    var date = new Date();
    var offset = this._computeOffset();

    var hh = date.getHours() + offset.hh;
    var mm = date.getMinutes() + offset.mm;

    if (hh < 0) {
      hh = 24 - Math.abs(hh);
    }

    if (mm > 60) {
      mm = mm - 60;
    }

    var clock = {
      hh: this._pad(hh),
      mm: this._pad(mm),
      ss: this._pad(date.getSeconds())
    };

    return clock;
  },

  /**
   * Compute offset.
   * @private
   */
  _computeOffset: function() {

    var date = new Date();

    var currentOffset = date.getTimezoneOffset() / 60;

    var givenOffset = (this._isDST() && this.props.offsets.utc_dst) ? this.props.offsets.utc_dst : this.props.offsets.utc;

    givenOffset += currentOffset;

    var hhOffset = (givenOffset > 0) ? Math.floor(givenOffset) : Math.ceil(givenOffset);
    var mmOffset = ((givenOffset > 0) ? Math.abs(givenOffset) - hhOffset : Math.abs(givenOffset) + hhOffset) * 60;

    return {
      hh: hhOffset,
      mm: mmOffset
    }
  },

  /**
   * Detect Daylight Saving Time.
   * @private
   */
  _isDST: function() {

    var date = new Date();

    var jan = new Date(date.getFullYear(), 0, 1);
    var jul = new Date(date.getFullYear(), 6, 1);

    var stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());

    var isDST = date.getTimezoneOffset() < stdTimezoneOffset;

    return isDST;
  },

  /**
   * Format a Number in two length.
   * @param  {Number} n The number to be converted.
   * @return {String}   The formatted string.
   * @private
   */
  _pad: function(n) {
    var nString = n.toString();
    var pad = (n < 10) ? '0' + nString : nString;

    return pad;
  },

  /**
   * Render.
   */
  render: function() {

    var city = this.state.city;
    var clock = this.state.clock;
    var date = this.state.date;

    var element = (
      <div className="clock">
        <p>
          City: <strong>{city}</strong>
        </p>
        <p>
          Time: <strong style={{color: 'red'}}>{clock.hh}:{clock.mm}:{clock.ss}</strong>
        </p>
        <p>
          Date: <strong>{date}</strong>
        </p>
      </div>
    );

    return element;
  }

});

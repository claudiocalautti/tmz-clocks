/**
 * Clock Widget Component.
 * Generate an element with the current time and name of a specific city.
 */
var ClockWidget = React.createClass({

  /**
   * Defines the value of `this.state` when the component is first mounted.
   * @return {Object} The state.
   */
  getInitialState: function() {

    var state = {
      city: this._getCity(),
      clock: this._setClock()
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
   * @return {Object} The current time and offset.
   * @private
   */
  _setClock: function() {

    var date = new Date();
    var clock = {
      hours: this._pad(date.getHours()),
      minutes: this._pad(date.getMinutes()),
      seconds: this._pad(date.getSeconds()),
      offset: date.getTimezoneOffset() / 60
    };

    return clock;
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

    var element = (
      <div className="clock">
        <p>
          City: <strong>{city}</strong>
        </p>
        <p>
          Time: <strong>{clock.hours}:{clock.minutes}:{clock.seconds}</strong>
        </p>
        <p>
          Offset: <strong>{clock.offset}</strong>
        </p>
      </div>
    );

    return element;
  }

});


// Append the ClockWidget to the body.
React.render(
  <ClockWidget timezone="Europe/London" />,
  document.querySelector('body')
);

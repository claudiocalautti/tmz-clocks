/**
 * Clock Widget Component.
 */
var ClockWidget = React.createClass({
  /**
   * Render.
   */
  render: function() {

    var city = this.props.city;

    var date = this.props.date;

    var clock = {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      offset: date.getTimezoneOffset() / 60
    }

    return (
      <div>
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
  }
});



// Render
setInterval(function() {
  React.render(
    <ClockWidget city="London" date={new Date()} />,
    document.querySelector('body')
  );
}, 500);

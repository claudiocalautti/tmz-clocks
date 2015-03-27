// Class
var Clock = {
  render: function() {
    return (
      <p>
        Hello, <input type="text" placeholder="Your name here" />!
        It is {this.props}
      </p>
    );
  }
};


var HelloWorld = React.createClass(Clock);



// Render
setInterval(function() {
  React.render(
    <HelloWorld date={new Date()} />,
    document.querySelector('body')
  );
}, 500);

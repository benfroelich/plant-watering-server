'use strict';

function hello()
{
  console.log("hello from diagnostics.js");
}

hello();

$.get('/diagnostics-update', {content: "TODO"}, new_data => {
  console.log(`new_data = ${new_data}`);
});

const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }
    // Display a "Like" <button>
    return (
      <button onClick={() => this.setState({ liked: true })}>
        Like
      </button>
    );
  }
}

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);

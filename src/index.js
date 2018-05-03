import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/** React supports a simpler syntax called functional components 
 * for component types like Square that only consist of a render method. 
 * Rather than define a class extending React.Component, we simply write 
 * a function that takes props and returns what should be rendered.*/
function Square(props) {
  return (
    // Note that onClick={props.onClick()} would not work 
    // because it would call props.onClick immediately instead of passing it down.
    <button className="square" onClick={props.clicked}>
      {props.v}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const sqrs = this.state.squares.slice(); // no start and end, so copy the whole
    sqrs[i] = 'X';
    this.setState({squares: sqrs});
  }

  renderSquare(i) {
    return (
      <Square
        v={this.state.squares[i]}
        clicked={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

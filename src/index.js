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
      xIsNext: true,
    };
  }

  handleClick(i) {
    const sqrs = this.state.squares.slice(); // no start and end, so copy the whole
    if (calculateWinner(sqrs) || sqrs[i]) {
      return;
    }
    sqrs[i] = this.state.xIsNext ? 'X' : 'O'; // const sqrs but ok to change props
    this.setState({
      squares: sqrs,
      xIsNext: !this.state.xIsNext, // toggle btw X and O
    });
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
    const w = calculateWinner(this.state.squares);
    let brdStatus;
    if (w) {
      brdStatus = 'Winner: ' + w;
    } else {
      brdStatus = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{brdStatus}</div>
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

function calculateWinner(squares) {
  const lines = [ // exaughst list of all possible 3-in-a-row winning cases
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    const tmp = squares[a];
    if (tmp && tmp === squares[b] && tmp === squares[c]) {
      return tmp;
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

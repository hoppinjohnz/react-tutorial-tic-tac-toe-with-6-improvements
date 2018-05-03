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
  renderSquare(i) {
    return (
      <Square
        v={this.props.squares[i]}
        clicked={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
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
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {squares: Array(9).fill(null)},
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    // to be aware of stepNumber when reading the current board state 
    // so that you can go back in time then click in the board to create a new entry
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // to read from that step in the history
    const current = history[this.state.stepNumber];
    const sqrs = current.squares.slice(); // no start and end, so copy the whole
    if (gameWon(sqrs) || sqrs[i]) {
      return;
    }
    sqrs[i] = this.state.xIsNext ? 'X' : 'O'; // const sqrs but ok to change props
    this.setState({
      history: history.concat( // trailing commas allowed
        [
          {squares: sqrs},
        ],
      ),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext, // toggle btw X and O
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0, // even step == true
    });
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = gameWon(current.squares);

    // For each step in the history, we create a list item <li> 
    // with a button <button> inside it that has a click handler.
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function gameWon(squares) {
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
      return tmp; // winning
    }
  }
  return null; // not winning yet
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

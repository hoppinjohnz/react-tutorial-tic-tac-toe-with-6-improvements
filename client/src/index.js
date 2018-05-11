import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/** React supports a simpler syntax called functional components 
 * for component types like Square that only consist of a render method. 
 * Rather than define a class extending React.Component, we simply write 
 * a function that takes props and returns what should be rendered.*/
function Square(props) {
  return (
    <button className="square" onClick={props.clicked} style={{ backgroundColor: props.bgcProp }}>
      {props.v}
    </button>
  );
}


class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        v={this.props.squares[i]}
        clicked={() => this.props.onClick(i)}
        bgcProp={this.props.bgColorsProp[i]}
      />
    );
  }

  board_row(r) {
    const cols = [];
    for (let i = 0; i < 3; i++) {
      cols.push(3 * r + i);
    }
    return (
      <div key={r} className="board-row">
        {cols.map((i) => this.renderSquare(i))}
      </div>
    );
  }

  render() {
    const row_index = [0,1,2,];
    return (
      <div>
        {row_index.map((i) => this.board_row(i))}
      </div>
    );
  }
}


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {squares: Array(9).fill(null), cell: -1},
      ],
      stepNumber: 0,
      xIsNext: true,
      isAsc: true,
      bgColors: Array(9).fill('white'),
    };
    // removed "TypeError: Cannot read property 'setState' of undefined"
    this.handleSort = this.handleSort.bind(this);
  }

  handleClick(i) {
    // to be aware of stepNumber when reading the current board state 
    // so that you can go back in time then click in the board to create a new entry
    const hstr = this.state.history.slice(0, this.state.stepNumber + 1);
    // to read from that step in the history
    const crrt = hstr[this.state.stepNumber];
    const sqrs = crrt.squares.slice(); // no start and end, so copy the whole
    if (sqrs[i] || gameWon(sqrs)) { // donw when cell is already taken or won
      return;
    }

    sqrs[i] = this.state.xIsNext ? 'X' : 'O'; // const sqrs but ok to change props
    this.setState({
      history: hstr.concat( // trailing commas allowed
        [
          {squares: sqrs, cell: i},
        ],
      ),
      stepNumber: hstr.length,
      xIsNext: !this.state.xIsNext, // toggle btw X and O
    });

    // only checking at the end of the handleClick
    const w = gameWon(sqrs);
    if (w) {
      // highlight winning cells
      const w_clrs = this.state.bgColors.slice();
      for (let i = 0; i < 3; i++) {
        w_clrs[w[i+1]] = 'lightblue';
      }

      this.setState({
        bgColors: w_clrs,
      });
    }
  }

  jumpTo(i) {
    this.setState({
      stepNumber: i,
      xIsNext: (i % 2) === 0, // even i == true
      bgColors: Array(9).fill('white'), // to clear the winning highlights
    });
  }

  handleSort() {
    this.setState({
      isAsc: !this.state.isAsc,
    });
  }

  render() {
    const hstry = this.state.history;
    const cIndex = hstry.length - 1;
    const currt = hstry[cIndex];

    // For each step in the history, we create a list item <li> 
    // with a button <button> inside it which has a click handler.
    const moves = hstry.map((step, i) => { // (step, index) such as hstry[index] = step
      const desc = i ? 'Move #' + i : 'Start'; // when i = 0, go to game start
      const descMarked = (i === this.state.stepNumber) ? '=> ' + desc : desc;
      const rowCol = i ? '(' + rowNum(step.cell) + ', ' + colNum(step.cell) + ')' : null;
      return (
        <li key={i}>
          <button onClick={() => this.jumpTo(i)}>{descMarked}</button> {rowCol}
        </li>
      );
    });

    let sortedMoves;
    if (this.state.isAsc) {
      sortedMoves = moves.slice();
    } else {
      sortedMoves = moves.sort((a, b) => a.key < b.key); // descending sort
    }

    const w = gameWon(currt.squares);
    let status;
    if (gameDraw(currt.squares)) {
      status = 'Good play. It\'s a draw!';
    } else {
      status = w ? 'Winner: ' + w[0] : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={currt.squares}
            onClick={(i) => this.handleClick(i)}
            bgColorsProp={this.state.bgColors}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button type="button" onClick={this.handleSort}> Sort </button>
          <ol>{sortedMoves}</ol>
        </div>
      </div>
    );
  }
}

function rowNum(cellNum) {
  let r = -1;
  switch (true) {
    case -1 < cellNum < 3:
      r = 0;
      break;
    case 2 < cellNum < 6:
      r = 1;
      break;
    case 5 < cellNum < 9:
      r = 2;
      break;
    default:
  }
  return r;
}

function colNum(cellNum) {
  let c = -1;
  switch (cellNum) {
    case 0:
    case 3:
    case 6:
      c = 0;
      break;
    case 1:
    case 4:
    case 7:
      c = 1;
      break;
    case 2:
    case 5:
    case 8:
      c = 2;
      break;
    default:
  }
  return c;
}

function gameWon(squares) {
  const lines = [ // exhaust list of all possible 3-in-a-row winning cases
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
      return [tmp, a, b, c]; // winning
    }
  }
  return null; // not winning yet
}

function gameDraw(squares) {
  let draw = true;
  if (gameWon(squares)) {
    draw = false;
  } else {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        draw = false;
      }
    }
  }
  return draw;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
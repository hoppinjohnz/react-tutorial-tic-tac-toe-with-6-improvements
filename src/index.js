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
    <button className="square" onClick={props.clicked} style={{backgroundColor: props.bgColor}}>
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
        bgColor={this.props.bgColor}
      />
    );
  }

  row(cells) {
    const cols = cells.slice();
    return (
      <div key={cells} className="board-row">
        {cols.map((i) => this.renderSquare(i))}
      </div>
    );
  }

  render() {
    const cols = [0,1,2,];
    return (
      <div>
        {cols.map((i) => this.row([3*i, 3*i+1, 3*i+2,]))}
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
      bgColor: 'red',
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
    if (sqrs[i]) { // cell is already taken
      return;
    }
    if (gameWon(sqrs)) {
      // highlight the winning line
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
  }

  jumpTo(i) {
    console.log(i);
    this.setState({
      stepNumber: i,
      xIsNext: (i % 2) === 0, // even i == true
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
            bgColor={this.state.bgColor}
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

function rowNum(cell) {
  let r = -1;
  switch (cell) {
    case 0:
    case 1:
    case 2:
      r = 0;
      break;
    case 3:
    case 4:
    case 5:
      r = 1;
      break;
    case 6:
    case 7:
    case 8:
      r = 2;
      break;
    default:
  }
  return r;
}

function colNum(cell) {
  let c = -1;
  switch (cell) {
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

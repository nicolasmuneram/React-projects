import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button 
            className="square" 
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
    
  }
  
  class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]} 
                key={"square " + i}
                onClick= { () => this.props.onClick(i)}
            />
        );
    }


  
    render() {

      const board =[] 
      const rows = []
      let idSquare = 0;
      for (let i = 1; i <= 3; i++){
        for (let j = 1; j <= 3; j++){
          rows.push(this.renderSquare(idSquare));
          idSquare++;
          console.log((idSquare))
        }
        board.push(<div className="board-row" key = {i}>{rows.slice(idSquare-3,idSquare)}</div>)
      }
      console.log(rows);

        return (
         board
        );
    }
  }
  
  class Game extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          lastMove:{}
        }],
        xIsNext: true,
        stepNumber: 0,
      };
    }

    handleClick(i){ 
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length -1];
      const squares = current.squares.slice();

      if (calculateWinner(squares) || squares[i]){
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O" ;
      this.setState({
          history: history.concat([{ squares: squares,lastMove: determineColAndRow(i)}]),
          stepNumber:history.length,
          xIsNext: !this.state.xIsNext,
      });

      //console.log(this.state.history[this.state.stepNumber].lastMove)


    }

    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext : (step % 2) === 0,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      
      const moves = history.map((step, move) => {
        
        const desc = move ? 
        "Go to move #" + move + " => Col: "+ this.state.history[move].lastMove.column + " and row: " + this.state.history[move].lastMove.row:
        "Go to game start";
        if (move !== this.state.stepNumber){
          return (
            <li key = {move}>
              <button onClick={() => this.jumpTo(move)}> {desc} </button>
            </li>
          );
        }  else { 
          return (
            <li key = {move}> 
              <button onClick={() => this.jumpTo(move)}> <b>{desc}</b> </button>
            </li>
          )
        }
          
      });
      

      let status

      if (winner){
          status = "Winner is: " + winner + ", congratulations!"
      }else{
          status = 'Next player is: ' + (this.state.xIsNext ? "X" : "O");
      }


      if (this.state.stepNumber > 8 && !winner){
        status = "There is a tie, restart the game!"
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares = {current.squares}
              onClick = {(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{ status}</div>
            <ol>{ moves }</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
  function calculateWinner(squares) {
    const lines = [
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
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  function determineColAndRow(num){
    const col = num % 3;
    const row = Math.floor(num/3);

    return {"column" : col+1, "row": row +1};
  }
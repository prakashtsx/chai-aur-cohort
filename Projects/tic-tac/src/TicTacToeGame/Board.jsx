import React, { useState } from "react";
import Square from "./Square";
import "./Board.css";

const Board = () => {
  const [state, setState] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);

  const checkWinner = (currentState) => {
    const winnerLogic = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let logic of winnerLogic) {
      const [a, b, c] = logic;
      if (
        currentState[a] !== null &&
        currentState[a] === currentState[b] &&
        currentState[a] === currentState[c]
      ) {
        return currentState[a];
      }
    }
    return null;
  };

  const winner = checkWinner(state);
  const isGameOver = winner !== null;

  const handleClick = (index) => {
    if (state[index] !== null || isGameOver) {
      return;
    }

    const copyState = [...state];
    copyState[index] = isXTurn ? "X" : "O";
    setState(copyState);
    setIsXTurn(!isXTurn);
  };

  const restartGame = () => {
    setState(Array(9).fill(null));
    setIsXTurn(true);
  };

  const statusMessage = winner
    ? `Congratulations ${winner} won 🎉`
    : isXTurn
      ? "X turn"
      : "O turn";

  return (
    <div className="board-wrapper">
      <h2 className="game-status">{statusMessage}</h2>
      {isGameOver && (
        <button type="button" className="restart-button" onClick={restartGame}>
          Restart Game
        </button>
      )}

      <div className="board-container">
        <div className="board-row">
          <Square onClick={() => handleClick(0)} value={state[0]} />
          <Square onClick={() => handleClick(1)} value={state[1]} />
          <Square onClick={() => handleClick(2)} value={state[2]} />
        </div>
        <div className="board-row">
          <Square onClick={() => handleClick(3)} value={state[3]} />
          <Square onClick={() => handleClick(4)} value={state[4]} />
          <Square onClick={() => handleClick(5)} value={state[5]} />
        </div>
        <div className="board-row">
          <Square onClick={() => handleClick(6)} value={state[6]} />
          <Square onClick={() => handleClick(7)} value={state[7]} />
          <Square onClick={() => handleClick(8)} value={state[8]} />
        </div>
      </div>
    </div>
  );
};

export default Board;

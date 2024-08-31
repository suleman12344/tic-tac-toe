"use client";
import React, { useState } from "react";
import styles from "./style.module.css";
import { Button } from "./ui/button";

function Board() {
  const [board, setBoard] = useState(Array(9).fill(" "));
  const [count, setCount] = useState(0);
  const [player, setPlayer] = useState("O");
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[][]>([]);

  const Square = ({ value }: { value: number }) => {
    return (
      <button className={styles.square} onClick={() => setValue(value)}>
        {board[value]}
      </button>
    );
  };

  function setValue(index: number) {
    if (board[index] !== " " || winner) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);
    setCount(count + 1);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setPlayer(player === "O" ? "X" : "O");
    }

    setHistory([...history, newBoard]);
  }

  function calculateWinner(board: string[]) {
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
      if (board[a] !== " " && board[a] === board[b] && board[b] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  const WhoPlay = () => {
    if (winner) {
      return <div>Winner: {winner}</div>;
    } else {
      return <div>Next player: {player}</div>;
    }
  };

  function ResetButton() {
    return (
      <Button variant="destructive" onClick={reset}>
        Go to game start
      </Button>
    );
  }

  function reset() {
    setBoard(Array(9).fill(" "));
    setPlayer("O");
    setWinner(null);
    setCount(0);
    setHistory([]);
  }
  function jumpto(index: number) {
    const previousBoard = history[index - 1];
    setBoard(previousBoard);
    setCount(index);
    setPlayer(index % 2 === 0 ? "O" : "X");
    setWinner(calculateWinner(previousBoard));
    setHistory(history.slice(0, index));
  }

  function HistoryButton({ moveIndex }: { moveIndex: number }) {
    return (
      <Button
        onClick={() => jumpto(moveIndex)}
      >{`Go to move #${moveIndex}`}</Button>
    );
  }
  function rerender() {
    return history.map((_, index) => (
      <li key={index}>
        <HistoryButton moveIndex={index + 1} />
      </li>
    ));
  }

  return (
    <div className={`p-28 grid grid-cols-[repeat(4,auto)]`}>
      <div className="grid">
        <WhoPlay />
        <div>
          <Square value={0} />
          <Square value={1} />
          <Square value={2} />
        </div>
        <div>
          <Square value={3} />
          <Square value={4} />
          <Square value={5} />
        </div>
        <div>
          <Square value={6} />
          <Square value={7} />
          <Square value={8} />
        </div>
      </div>
      <div className="ml-20 row-span-2">
        <ol className="list-decimal">
          <li>
            <ResetButton />
          </li>
          {rerender()}
        </ol>
      </div>
    </div>
  );
}

export default Board;

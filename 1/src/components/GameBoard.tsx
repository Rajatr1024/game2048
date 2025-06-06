'use client';

import React, { useEffect, useState } from 'react';
import Tile from './Tile';

type MoveResult = {
  newRow: number[];
  scoreGained: number;
};

function createInitialBoard(): number[][] {
  const emptyBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  return addRandomTile(addRandomTile(emptyBoard));
}

function moveRowLeftWithScore(row: number[]): MoveResult {
  const filtered = row.filter(n => n !== 0);
  const newRow: number[] = [];
  let skip = false;
  let scoreGained = 0;

  for (let i = 0; i < filtered.length; i++) {
    if (skip) {
      skip = false;
      continue;
    }

    if (filtered[i] === filtered[i + 1]) {
      const mergedValue = filtered[i] * 2;
      newRow.push(mergedValue);
      scoreGained += mergedValue;
      skip = true;
    } else {
      newRow.push(filtered[i]);
    }
  }

  while (newRow.length < 4) {
    newRow.push(0);
  }

  return { newRow, scoreGained };
}

function moveRowLeft(row: number[]): number[] {
  return moveRowLeftWithScore(row).newRow;
}

function moveRowRightWithScore(row: number[]): MoveResult {
  const reversed = [...row].reverse();
  const { newRow, scoreGained } = moveRowLeftWithScore(reversed);
  return { newRow: newRow.reverse(), scoreGained };
}

function moveRowRight(row: number[]): number[] {
  return moveRowRightWithScore(row).newRow;
}

function transpose(board: number[][]): number[][] {
  return board[0].map((_, i) => board.map(row => row[i]));
}

function addRandomTile(board: number[][], score: number = 0): number[][] {
  const emptyCells: { row: number; col: number }[] = [];

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 0) {
        emptyCells.push({ row: rowIndex, col: colIndex });
      }
    });
  });

  if (emptyCells.length === 0) return board;

  // Determine which tile to spawn based on score thresholds
  const base = 2;
  // How many times to double the base tile?
  const power = Math.min(10, Math.floor(score / 500) + 1);
  const tileToSpawn = base * (2 ** (power - 1));

  // Pick random empty cell
  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = tileToSpawn;

  return newBoard;
}


const emptyBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// Check if any moves are possible
function canMove(board: number[][]): boolean {
  // Check for any zero (empty) cells
  for (let row of board) {
    if (row.includes(0)) return true;
  }

  // Check horizontal moves
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[r][c] === board[r][c + 1]) return true;
    }
  }

  // Check vertical moves
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 3; r++) {
      if (board[r][c] === board[r + 1][c]) return true;
    }
  }

  return false;
}

const boardsAreEqual = (b1: number[][], b2: number[][]): boolean => {
  for (let i = 0; i < b1.length; i++) {
    for (let j = 0; j < b1[i].length; j++) {
      if (b1[i][j] !== b2[i][j]) {
        return false;
      }
    }
  }
  return true;
};


const GameBoard: React.FC = () => {
  const [board, setBoard] = useState<number[][]>(emptyBoard);
  const [score, setScore] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setBoard(createInitialBoard());
    setInitialized(true);
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    if (!initialized || gameOver) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      setBoard(prevBoard => {
        let newBoard: number[][] = prevBoard;
        let gained = 0;

        switch (event.key) {
          case 'ArrowLeft': {
            const resultRows = prevBoard.map(row => moveRowLeftWithScore(row));
            newBoard = resultRows.map(r => r.newRow);
            gained = resultRows.reduce((acc, r) => acc + r.scoreGained, 0);
            break;
          }
          case 'ArrowRight': {
            const resultRows = prevBoard.map(row => moveRowRightWithScore(row));
            newBoard = resultRows.map(r => r.newRow);
            gained = resultRows.reduce((acc, r) => acc + r.scoreGained, 0);
            break;
          }
          case 'ArrowUp': {
            const transposed = transpose(prevBoard);
            const resultRows = transposed.map(row => moveRowLeftWithScore(row));
            newBoard = transpose(resultRows.map(r => r.newRow));
            gained = resultRows.reduce((acc, r) => acc + r.scoreGained, 0);
            break;
          }
          case 'ArrowDown': {
            const transposed = transpose(prevBoard);
            const resultRows = transposed.map(row => moveRowRightWithScore(row));
            newBoard = transpose(resultRows.map(r => r.newRow));
            gained = resultRows.reduce((acc, r) => acc + r.scoreGained, 0);
            break;
          }
          default:
            return prevBoard;
        }

        const boardChanged = !boardsAreEqual(prevBoard, newBoard);

        if (!boardChanged) return prevBoard;

        setScore(prev => prev + gained);

        const newBoardWithTile = addRandomTile(newBoard, score + gained);


        // Check if game over after move
        if (!canMove(newBoardWithTile)) {
          setGameOver(true);
        }

        return newBoardWithTile;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [initialized, gameOver]);

  if (!initialized) return null;

  return (
 <div className="flex flex-col items-center justify-center min-h-screen bg-[#faf8ef] p-4">
    <h1 className="text-5xl font-extrabold mb-6 text-[#776e65] drop-shadow-md">
      2048 Game
    </h1>

    <div className="mb-6 flex items-center space-x-10">
      <div className="text-2xl font-bold text-[#f9f6f2] bg-[#776e65] px-6 py-3 rounded shadow-lg select-none">
        Score: {score}
      </div>
      <button
        onClick={() => {
          setBoard(createInitialBoard());
          setScore(0);
          setGameOver(false);
        }}
        className="px-6 py-3 bg-[#8f7a66] text-white rounded-lg shadow-md hover:bg-[#a1887f] active:bg-[#7a6a58] transition duration-200"
      >
        Restart Game
      </button>
    </div>

    <div className="bg-[#bbada0] p-4 rounded">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => (
            <Tile key={`${rowIndex}-${colIndex}`} value={cell} />
          ))}
        </div>
      ))}
    </div>

    {gameOver && (
      <div className="mt-6 text-2xl font-bold text-red-600">
        Game Over! No more moves possible.
      </div>
    )}
  </div>
  );
};

export default GameBoard; 
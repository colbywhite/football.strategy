import type {Ctx, Game} from 'boardgame.io';
import {INVALID_MOVE} from 'boardgame.io/core';

export interface TicTacToeBoard {
  cells: string[];
}

function IsVictory(cells: string[]) {
  const positions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ];

  const isRowComplete = (row: number[]) => {
    const symbols = row.map(i => cells[i]);
    return symbols.every(i => i !== null && i === symbols[0]);
  };

  return positions.map(isRowComplete).some(i => i === true);
}

function IsDraw(cells: string[]) {
  return cells.filter(c => c === null).length === 0;
}

export type TicTacToeMoves = { clickCell: (id: number) => void }

export const TicTacToe: Game<TicTacToeBoard> = {
  name: 'TicTacToe',
  setup: () => ({cells: Array(9).fill(null)}),
  turn: {
    maxMoves: 1,
    minMoves: 1
  },
  moves: {
    clickCell: (G: TicTacToeBoard, ctx: Ctx, id: number) => {
      if (G.cells[id] !== null) {
        return INVALID_MOVE;
      }
      G.cells[id] = ctx.currentPlayer;
    }
  },
  endIf: (G: TicTacToeBoard, ctx: Ctx) => {
    if (IsVictory(G.cells)) {
      return {winner: ctx.currentPlayer};
    }
    if (IsDraw(G.cells)) {
      return {draw: true};
    }
  },
  ai: {
    enumerate: (G: TicTacToeBoard) => {
      let moves = [];
      for (let i = 0; i < 9; i++) {
        if (G.cells[i] === null) {
          moves.push({move: 'clickCell', args: [i]});
        }
      }
      return moves;
    }
  }
};

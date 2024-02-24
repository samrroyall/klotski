import { Block, BlockMove, BoardState, Move } from './game';

export interface Board {
  id: number;
  state: BoardState;
  blocks: Block[];
  grid: number[][];
  nextMoves: Move[][];
}

interface SolvedData {
  moves: BlockMove[];
}

export interface Solved extends SolvedData {
  type: 'solved';
}

interface UnableToSolve {
  type: 'unable_to_solve';
}

export type Solve = Solved | UnableToSolve;

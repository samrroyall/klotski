import { Block, BlockMove, BoardState, Move, PositionedBlock } from './game';

export interface Board {
  id: number;
  state: BoardState;
  blocks: PositionedBlock[];
  grid: (Block | null)[];
  next_moves: Move[][];
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

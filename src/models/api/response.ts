import { Block, BlockMove, BoardState, Move } from './game';

export interface Board {
  id: number;
  blocks: Block[];
  state: BoardState;
  next_moves: Move[][] | null;
}

interface SolvedData {
  moves: BlockMove[];
}

interface Solved extends SolvedData {
  type: 'solved';
}

interface UnableToSolve {
  type: 'unable_to_solve';
}

export type Solve = Solved | UnableToSolve;

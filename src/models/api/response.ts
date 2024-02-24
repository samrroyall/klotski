import { Block, BlockMove, BoardState, Move } from './game';

export interface Board {
  id: number;
  state: string;
  blocks: string;
  filled: string;
  next_moves: string;
}

export interface ParsedBoard {
  id: number;
  state: BoardState;
  blocks: Block[];
  filled: boolean[][];
  nextMoves: Move[][];
}

export const parseBoard = (board: Board): ParsedBoard => ({
  id: board.id,
  state: JSON.parse(board.state) as BoardState,
  blocks: JSON.parse(board.blocks) as Block[],
  filled: JSON.parse(board.filled) as boolean[][],
  nextMoves: JSON.parse(board.next_moves) as Move[][],
});

interface SolvedData {
  moves: string;
}

interface Solved extends SolvedData {
  type: 'solved';
}

export interface ParsedSolved {
  type: 'solved';
  moves: BlockMove[];
}

export const parseSolved = (solved: Solved): ParsedSolved => ({
  type: solved.type,
  moves: JSON.parse(solved.moves) as BlockMove[],
});

interface UnableToSolve {
  type: 'unable_to_solve';
}

export type Solve = Solved | UnableToSolve;

export type ParsedSolve = ParsedSolved | UnableToSolve;

import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { blockToBoardBlock, BoardBlock, Move } from '../models/api/game';
import { NUM_COLS, NUM_ROWS } from '../constants';
import { BoardState as BoardState_ } from '../models/api/game';
import { ParsedBoard as ParsedBoardResponse } from '../models/api/response';

export enum Status {
  Start = 'start',
  Building = 'building',
  AlreadySolved = 'already_solved',
  ReadyToSolve = 'ready_to_solve',
  ManualSolving = 'manual_solving',
  AlgoSolving = 'algo_solving',
  Solved = 'solved',
  SolvedOptimally = 'solved_optimally',
  UnableToSolve = 'unable_to_solve',
}

const boardStateToStatus = (state: BoardState_, defaultStatus: Status): Status => {
  switch (state) {
    case BoardState_.Building:
      return Status.Building;
    case BoardState_.ReadyToSolve:
      return Status.ReadyToSolve;
    case BoardState_.Solved:
      return Status.Solved;
    default:
      return defaultStatus;
  }
};

interface BoardState {
  id: number | null;
  status: Status;
  blocks: BoardBlock[];
  filled: boolean[][];
  nextMoves: Move[][];
}

const initialState: BoardState = {
  id: null,
  status: 'start' as Status,
  blocks: [],
  filled: new Array(NUM_ROWS).fill(new Array(NUM_COLS).fill(false)),
  nextMoves: [],
};

const resetReducer: CaseReducer<BoardState> = (state) => {
  state.id = initialState.id;
  state.status = initialState.status;
  state.blocks = initialState.blocks;
  state.filled = initialState.filled;
  state.nextMoves = initialState.nextMoves;
};

const updateBoardReducer: CaseReducer<BoardState, PayloadAction<ParsedBoardResponse>> = (
  state,
  { payload }
) => {
  state.id = payload.id;
  state.status = boardStateToStatus(payload.state, state.status);
  state.blocks = payload.blocks.map((block, idx) => blockToBoardBlock(block, idx));
  state.filled = payload.filled;
  state.nextMoves = payload.nextMoves || [];
};

const updateStatusReducer: CaseReducer<BoardState, PayloadAction<Status>> = (
  state,
  { payload }
) => {
  state.status = payload;
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    reset: resetReducer,
    update: updateBoardReducer,
    updateStatus: updateStatusReducer,
  },
});

export const { reset, update, updateStatus } = boardSlice.actions;

export default boardSlice.reducer;

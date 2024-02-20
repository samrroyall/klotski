import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { blockToBoardBlock, BoardBlock } from '../models/api/game';
import { NUM_COLS, NUM_ROWS } from '../constants';
import { BoardState as _BoardState } from '../models/api/game';
import { Board as BoardResponse } from '../models/api/response';

export enum Status {
  Start = 'start',
  Building = 'building',
  ReadyToSolve = 'ready_to_solve',
  ManualSolving = 'manual_solving',
  AlgoSolving = 'algo_solving',
  Solved = 'solved',
  SolvedOptimally = 'solved_optimally',
  UnableToSolve = 'unable_to_solve',
}

const boardStateToStatus = (state: _BoardState): Status => {
  switch (state) {
    case _BoardState.Building:
      return Status.Building;
    case _BoardState.ReadyToSolve:
      return Status.ReadyToSolve;
    case _BoardState.ManualSolving:
      return Status.ManualSolving;
    case _BoardState.AlgoSolving:
      return Status.AlgoSolving;
    case _BoardState.Solved:
      return Status.Solved;
  }
};

interface BoardState {
  id: number | null;
  status: Status;
  blocks: BoardBlock[];
  filled: boolean[][];
}

const initialState: BoardState = {
  id: null,
  status: 'start' as Status,
  blocks: [],
  filled: new Array(NUM_ROWS).fill(new Array(NUM_COLS).fill(false)),
};

const updateBoardReducer: CaseReducer<BoardState, PayloadAction<BoardResponse>> = (
  state,
  { payload }
) => {
  state.status = boardStateToStatus(payload.state);
  state.blocks = payload.blocks.map((block, idx) => blockToBoardBlock(block, idx));
  state.filled = payload.filled;
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
    updateBoard: updateBoardReducer,
    updateStatus: updateStatusReducer,
  },
});

export const { updateBoard, updateStatus } = boardSlice.actions;

export default boardSlice.reducer;

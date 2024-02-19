import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { BlockWithDimensions, blockToBlockWithDimensions } from '../models/api/game';
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
  blocks: BlockWithDimensions[];
  filled: boolean[][];
}

const emptyFilled = new Array(NUM_ROWS).fill(new Array(NUM_COLS).fill(false));

const initialState: BoardState = {
  id: null,
  status: 'start' as Status,
  blocks: [],
  filled: emptyFilled,
};

const initBoardReducer: CaseReducer<BoardState, PayloadAction<BoardResponse>> = (
  state,
  { payload }
) => {
  state.id = payload.id;
  state.blocks = payload.blocks.map(blockToBlockWithDimensions);
};

const updateBoardReducer: CaseReducer<BoardState, PayloadAction<BoardResponse>> = (
  state,
  { payload }
) => {
  state.status = boardStateToStatus(payload.state);
  state.blocks = payload.blocks.map(blockToBlockWithDimensions);

  let filled = emptyFilled;
  state.blocks.forEach((block) => {
    for (let i = 0; i < block.rows; i++) {
      for (let j = 0; j < block.cols; j++) {
        filled[block.min_position.row + i][block.min_position.col + j] = true;
      }
    }
  });

  state.filled = filled;
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
    initBoard: initBoardReducer,
    updateBoard: updateBoardReducer,
    updateStatus: updateStatusReducer,
  },
});

export const { initBoard, updateBoard, updateStatus } = boardSlice.actions;

export default boardSlice.reducer;

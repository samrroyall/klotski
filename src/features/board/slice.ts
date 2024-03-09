import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  Block,
  BlockMove,
  BoardBlock,
  Move,
  positionedBlockToBoardBlock,
} from '../../models/api/game';
import { NUM_COLS, NUM_ROWS } from '../../constants';
import { Board as BoardResponse } from '../../models/api/response';
import { Status, boardStateToStatus } from '../../models/ui';

interface State {
  id: number | null;
  status: Status;
  blocks: BoardBlock[];
  grid: (Block | null)[];
  nextMoves: Move[][];
}

const initialState: State = {
  id: null,
  status: 'start' as Status,
  blocks: [],
  grid: new Array(NUM_ROWS * NUM_COLS).fill(null),
  nextMoves: [],
};

const resetReducer: CaseReducer<State> = (state) => {
  state.id = initialState.id;
  state.status = initialState.status;
  state.blocks = initialState.blocks;
  state.grid = initialState.grid;
  state.nextMoves = initialState.nextMoves;
};

const updateReducer: CaseReducer<State, PayloadAction<BoardResponse>> = (state, { payload }) => {
  state.id = payload.id;
  state.status = boardStateToStatus(payload.state, state.status);
  state.blocks = payload.blocks.map(positionedBlockToBoardBlock);
  state.grid = payload.grid;
  state.nextMoves = payload.next_moves;
};

const updateBlockReducer: CaseReducer<State, PayloadAction<BlockMove>> = (state, { payload }) => {
  const block = state.blocks[payload.block_idx];
  state.blocks = [
    ...state.blocks.slice(0, payload.block_idx),
    {
      ...block,
      min_position: {
        row: block.min_position.row + payload.row_diff,
        col: block.min_position.col + payload.col_diff,
      },
      max_position: {
        row: block.max_position.row + payload.row_diff,
        col: block.max_position.col + payload.col_diff,
      },
    },
    ...state.blocks.slice(payload.block_idx + 1),
  ];
};

const updateStatusReducer: CaseReducer<State, PayloadAction<Status>> = (state, { payload }) => {
  state.status = payload;
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    reset: resetReducer,
    update: updateReducer,
    updateBlock: updateBlockReducer,
    updateBoardStatus: updateStatusReducer,
  },
});

export const { reset, update, updateBlock, updateBoardStatus } = boardSlice.actions;

export default boardSlice.reducer;

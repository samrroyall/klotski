import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Block, BoardBlock, Move, positionedBlockToBoardBlock } from '../../models/api/game';
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

const updateStatusReducer: CaseReducer<State, PayloadAction<Status>> = (state, { payload }) => {
  state.status = payload;
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    reset: resetReducer,
    update: updateReducer,
    updateBoardStatus: updateStatusReducer,
  },
});

export const { reset, update, updateBoardStatus } = boardSlice.actions;

export default boardSlice.reducer;

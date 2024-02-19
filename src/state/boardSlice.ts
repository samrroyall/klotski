import { createSlice } from '@reduxjs/toolkit';
import { Block } from '../models/api/game';

interface BoardState {
  blocks: Block[];
}

const initialState: BoardState = {
  blocks: [],
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    updateBlocks: (state, { payload: BoardResponse }) => {
      state.blocks = BoardResponse.blocks;
    },
  },
});

export const { updateBlocks } = boardSlice.actions;

export default boardSlice.reducer;

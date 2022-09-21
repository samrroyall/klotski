import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Block } from '../models/Block';
import { Board } from '../models/Board';
import { PositionedBlock } from '../models/PositionedBlock';
import { Grid, UIMove, UIPosBlock } from '../models/global';
import { solveBoard } from '../models/Solver';

// State

interface AlgoSolveState {
  isSolved: boolean;
  steps: UIMove[] | null;
  stepIdx: number;
}

const initialState: AlgoSolveState = {
  isSolved: false,
  steps: null,
  stepIdx: -1,
};

// Actions

const initReducer: CaseReducer<
  AlgoSolveState,
  PayloadAction<{ blocks: UIPosBlock[]; grid: Grid }>
> = (state, { payload: { blocks, grid } }) => {
  const board = new Board();
  board.setBlocks(
    blocks.map((pb) => new PositionedBlock(new Block(pb.block.rows, pb.block.cols), pb.pos))
  );
  board.setGrid(grid);

  state.steps =
    solveBoard(board)?.map(({ block, pos, dirs }) => ({
      block: { rows: block.rows, cols: block.cols },
      pos,
      dirs,
    })) || null;
  state.stepIdx = state.steps ? state.steps.length - 1 : -1;
  state.isSolved = true;
};

const decrementStepReducer: CaseReducer<AlgoSolveState> = (state) => {
  state.stepIdx -= 1;
};

const incrementStepReducer: CaseReducer<AlgoSolveState> = (state) => {
  state.stepIdx += 1;
}

// Slice

const algoSolveSlice = createSlice({
  name: 'algoSolve',
  initialState,
  reducers: {
    init: initReducer,
    decrementStepIdx: decrementStepReducer,
    incrementStepIdx: incrementStepReducer,
  },
});

export const { init, decrementStepIdx, incrementStepIdx } = algoSolveSlice.actions;

export default algoSolveSlice.reducer;

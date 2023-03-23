import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';

// State

export enum Status {
  Start='start',
  ManualBuild='manualBuild',
  ManualSolve='manualSolve',
  ReadyToSolve='readyToSolve',
  StepThroughSolution='stepThrough',
  Done='done',
  DoneOptimal='doneOptimal',
  Failed='failed',
  AlreadySolved='alreadySolved',
}

export enum Severity {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Success = 'success',
}

interface AppState {
  status: Status;
}

const initialState: AppState = {
  status: Status.Start,
};

// Actions

const changeStatusReducer: CaseReducer<
  AppState,
  PayloadAction<Status>
> = (state, {payload: status}) => {
  state.status = status;
};

// Slice

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeStatus: changeStatusReducer,
  },
});

export const { changeStatus } = appSlice.actions;

export default appSlice.reducer;

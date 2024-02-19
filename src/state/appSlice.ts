import { Satellite } from '@mui/icons-material';
import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Status {
  Start = 'start',
  Building = 'building',
  ReadyToSolve = 'ready_to_solve',
  ManualSolving = 'manual_solving',
  AlgoSolving = 'algo_solving',
  Solved = 'solved',
  UnableToSolve = 'unable_to_solve',
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

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeStatus: (state, { payload: status }) => { state.status = status; },
  },
});

export const { changeStatus } = appSlice.actions;

export default appSlice.reducer;

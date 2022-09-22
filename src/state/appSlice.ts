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

interface Alert {
  msg: string;
  severity: Severity;
}

interface AppState {
  alerts: Alert[];
  status: Status;
}

const initialState: AppState = {
  alerts: [],
  status: Status.Start,
};

// Actions

const changeStatusReducer: CaseReducer<
  AppState,
  PayloadAction<{ status: Status }>
> = (state, {payload: {status}}) => {
  state.status = status;
};

const removeAlertReducer: CaseReducer<AppState> = (state) => {
  if (state.alerts.length > 0) {
    const [_, ...others] = state.alerts;
    state.alerts = others;
  }
}

const addAlertReducer: CaseReducer<
  AppState, 
  PayloadAction<{ alert: Alert }>
> = (state, {payload: {alert}}) => {
  state.alerts = [...state.alerts, alert];
}

// Slice

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeStatus: changeStatusReducer,
    addAlert: addAlertReducer,
    removeAlert: removeAlertReducer,
  },
});

export const { changeStatus, addAlert, removeAlert } = appSlice.actions;

export default appSlice.reducer;

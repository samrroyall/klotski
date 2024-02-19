import { createSlice } from '@reduxjs/toolkit';

export enum Severity {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Success = 'success',
}

interface AppState {}

const initialState: AppState = {};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
});

export default appSlice.reducer;

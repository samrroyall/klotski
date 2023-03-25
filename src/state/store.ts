import { configureStore } from '@reduxjs/toolkit';
import algoSolveReducer from './algoSolveSlice';
import appReducer from './appSlice';
import boardReducer from './boardSlice';
import manualSolveReducer from './manualSolveSlice';

const store = configureStore({
  reducer: {
    algoSolve: algoSolveReducer,
    app: appReducer,
    board: boardReducer,
    manualSolve: manualSolveReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

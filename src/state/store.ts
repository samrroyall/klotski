import { configureStore } from '@reduxjs/toolkit';
import algoSolveReducer from './solve/algoSolveSlice';
import boardReducer from './board/boardSlice';
import manualSolveReducer from './solve/manualSolveSlice';

const store = configureStore({
  reducer: {
    algoSolve: algoSolveReducer,
    board: boardReducer,
    manualSolve: manualSolveReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

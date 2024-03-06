import { AsyncThunkPayloadCreator, configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import algoSolveReducer from './features/algoSolve/slice';
import boardReducer from './features/board/slice';
import manualSolveReducer from './features/manualSolve/slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const store = configureStore({
  reducer: {
    algoSolve: algoSolveReducer,
    board: boardReducer,
    manualSolve: manualSolveReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const createThunk = <T, U>(
  key: string,
  func: AsyncThunkPayloadCreator<U, T, { state: RootState; dispatch: AppDispatch }>
) => createAsyncThunk<U, T, { state: RootState; dispatch: AppDispatch }>(key, func);

export default store;

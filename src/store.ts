import { AsyncThunkPayloadCreator, configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import algoSolveReducer from './features/algoSolve/slice';
import boardReducer from './features/board/slice';
import manualSolveReducer from './features/manualSolve/slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const persistedState = localStorage.getItem('reduxState');

const store = configureStore({
  reducer: {
    algoSolve: algoSolveReducer,
    board: boardReducer,
    manualSolve: manualSolveReducer,
  },
  preloadedState: persistedState ? JSON.parse(persistedState) : {},
});

store.subscribe(() => {
  localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

type ThunkApiConfig = { state: RootState; dispatch: AppDispatch };

export const createThunk = <T, U>(
  key: string,
  func: AsyncThunkPayloadCreator<U, T, ThunkApiConfig>
) => createAsyncThunk<U, T, { state: RootState; dispatch: AppDispatch }>(key, func);

export default store;

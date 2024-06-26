import {
  BORDER_SIZE,
  DESKTOP_CELL_SIZE,
  MOBILE_CELL_SIZE,
  NUM_COLS,
  NUM_ROWS,
  TABLET_CELL_SIZE,
} from '../constants';
import { BoardState } from './api/game';

export enum AppState {
  Start = 'start',
  Building = 'building',
  AlreadySolved = 'already_solved',
  ReadyToSolve = 'ready_to_solve',
  ManualSolving = 'manual_solving',
  AlgoSolving = 'algo_solving',
  Solved = 'solved',
  SolvedOptimally = 'solved_optimally',
  UnableToSolve = 'unable_to_solve',
  Solving = 'Solving',
}

export const boardStateToAppState = (state: BoardState, defaultAppState: AppState): AppState => {
  switch (state) {
    case BoardState.Building:
      return AppState.Building;
    case BoardState.ReadyToSolve:
      return AppState.ReadyToSolve;
    case BoardState.Solved:
      return AppState.Solved;
    default:
      return defaultAppState;
  }
};

export interface Sizes {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  borderSize: string;
  cellSize: string;
  boardHeight: string;
  boardWidth: string;
}

export const getSizes = (isMobile: boolean, isTablet: boolean): Sizes => {
  const borderSize = `${BORDER_SIZE}px`;
  const cellSize = isMobile ? MOBILE_CELL_SIZE : isTablet ? TABLET_CELL_SIZE : DESKTOP_CELL_SIZE;

  return {
    isMobile,
    isTablet: !isMobile && isTablet,
    isDesktop: !isMobile && !isTablet,
    borderSize,
    cellSize,
    boardHeight: `(${NUM_ROWS} * (${cellSize} + ${borderSize}) + ${borderSize})`,
    boardWidth: `(${NUM_COLS} * (${cellSize} + ${borderSize}) + ${borderSize})`,
  };
};

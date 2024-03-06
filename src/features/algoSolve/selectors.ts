import { BlockMove } from '../../models/api/game';
import { RootState } from '../../store';

export const selectIsAlgoSolved = (state: RootState): boolean => state.algoSolve.isSolved;

export const selectNumSteps = (state: RootState): number | null =>
  state.algoSolve.steps?.length || null;

export const selectSteps = (state: RootState): BlockMove[] | null => state.algoSolve.steps;

export const selectStepIdx = (state: RootState): number => state.algoSolve.stepIdx;

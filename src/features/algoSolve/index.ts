import { reset, init, decrementStep, incrementStep } from './slice';
import { selectIsAlgoSolved, selectSteps, selectStepIdx } from './selectors';
import { nextStep, prevStep, resetBoard, solveBoard } from './thunks';

export {
  reset as resetAlgoSolve,
  init as initAlgoSolve,
  decrementStep,
  incrementStep,
  nextStep,
  prevStep,
  resetBoard,
  solveBoard as algoSolveBoard,
  selectIsAlgoSolved,
  selectStepIdx,
  selectSteps,
};

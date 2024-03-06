import { reset, init, decrementStep, incrementStep } from './slice';
import { selectIsAlgoSolved, selectSteps, selectStepIdx } from './selectors';
import { nextStep, prevStep, solveBoard } from './thunks';

export {
  reset as resetAlgoSolve,
  init as initAlgoSolve,
  decrementStep,
  incrementStep,
  nextStep,
  prevStep,
  solveBoard as algoSolveBoard,
  selectIsAlgoSolved,
  selectStepIdx,
  selectSteps,
};

import { FunctionComponent } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import { changeStatus, Status } from '../state/appSlice';
import { moveBlock, moveBlockToPos, randomize, reset as boardReset } from '../state/boardSlice';
import { init as algoInit, incrementStepIdx, decrementStepIdx } from '../state/algoSolveSlice';
import {
  init as manualInit,
  undoMove,
  reset as manualSolveReset,
  clearBlockToMove,
  clearAvailablePositions,
} from '../state/manualSolveSlice';
import { getOppositeMove, getSizes } from '../models/global';
import store, { RootState } from '../state/store';
import ButtonWrapper from './ButtonWrapper';

const Buttons: FunctionComponent = () => {
  // State
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.app.status);
  const blocks = useAppSelector((state) => state.board.blocks);
  const currentStep = useAppSelector((state) =>
    state.algoSolve.steps ? state.algoSolve.steps[state.algoSolve.stepIdx] : null
  );
  const numSteps = useAppSelector((state) => state.algoSolve.steps?.length);
  const getPreviousStep = (state: RootState) => {
    const steps = state.algoSolve.steps;
    const stepIdx = state.algoSolve.stepIdx;
    return steps && stepIdx < steps.length - 1 ? steps[stepIdx + 1] : null;
  };
  const stepIdx = useAppSelector((state) => state.algoSolve.stepIdx);
  const getCurrentMove = (state: RootState) =>
    state.manualSolve.moves[state.manualSolve.moveIdx - 1];
  const moveIdx = useAppSelector((state) => state.manualSolve.moveIdx);

  // Button Actions
  const getRandomBoard = () => {
    dispatch(randomize());
    dispatch(changeStatus(Status.ReadyToSolve));
  };
  const clearBoard = () => {
    dispatch(boardReset());
    dispatch(manualSolveReset());
    dispatch(changeStatus(Status.Start));
  };
  const initAlgoSolve = () => {
    dispatch(algoInit(blocks));
    const steps = store.getState().algoSolve.steps;
    dispatch(
      changeStatus(
        !steps
          ? Status.Failed
          : steps.length > 0
          ? Status.StepThroughSolution
          : Status.AlreadySolved
      )
    );
  };
  const undoStep = () => {
    const previousStep = getPreviousStep(store.getState());
    if (previousStep) {
      dispatch(moveBlock(getOppositeMove(previousStep)));
      dispatch(incrementStepIdx());
    }
  };
  const getNextStep = () => {
    if (status !== Status.StepThroughSolution) {
      dispatch(changeStatus(Status.StepThroughSolution));
    }
    if (currentStep) {
      dispatch(moveBlock(currentStep));
      dispatch(decrementStepIdx());
    }
  };
  const initManualSolve = () => {
    dispatch(manualInit(blocks));

    const optimalMoves = store.getState().manualSolve.optimalMoves;
    dispatch(
      changeStatus(
        !optimalMoves
          ? Status.Failed
          : optimalMoves.length > 0
          ? Status.ManualSolve
          : Status.AlreadySolved
      )
    );
  };
  const undoLastMove = () => {
    const { block, oldPos, newPos } = getCurrentMove(store.getState());
    dispatch(moveBlockToPos({ pb: { block, pos: newPos }, newPos: oldPos }));
    dispatch(undoMove());
    dispatch(clearBlockToMove());
    dispatch(clearAvailablePositions());
  };
  const startOver = () => {
    if (status === Status.StepThroughSolution) {
      for (let i = stepIdx; i < numSteps!; i++) {
        undoStep();
      }
    } else {
      for (let i = moveIdx; i > 0; i--) {
        undoLastMove();
      }
    }
    dispatch(changeStatus(Status.ReadyToSolve));
  };

  // Buttons
  const randomizeButton = <ButtonWrapper title="Create board for me" onClick={getRandomBoard} />;
  const clearButton = <ButtonWrapper title="Clear" onClick={clearBoard} />;
  const startOverButton = <ButtonWrapper title="Start Over" onClick={startOver} />;
  const readyToSolveButtons = (
    <>
      <ButtonWrapper title="Solve myself" onClick={initManualSolve} />
      {clearButton}
      <ButtonWrapper title="Solve for me" onClick={initAlgoSolve} />
    </>
  );
  const stepThroughSolutionButtons = (
    <>
      {startOverButton}
      <ButtonWrapper
        title="Previous Step"
        onClick={undoStep}
        disabled={!numSteps || stepIdx >= numSteps - 1}
      />
      <ButtonWrapper title="Next Step" onClick={getNextStep} disabled={stepIdx < 0} />
    </>
  );
  const manualSolveButtons = (
    <>
      {startOverButton}
      <ButtonWrapper title="Undo Move" onClick={undoLastMove} disabled={moveIdx <= 0} />
    </>
  );

  // Styling
  const { boardHeight } = getSizes(useMediaQuery);
  const buttonStyling = { position: 'absolute', width: '100%', left: 0 };

  return (
    <Box
      sx={{
        ...buttonStyling,
        top: `calc(${boardHeight} + 0.5rem)`,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {[Status.Done, Status.DoneOptimal].includes(status) ? (
        startOverButton
      ) : [Status.ManualBuild, Status.Failed, Status.AlreadySolved].includes(status) ? (
        clearButton
      ) : status === Status.StepThroughSolution ? (
        stepThroughSolutionButtons
      ) : status === Status.Start ? (
        randomizeButton
      ) : status === Status.ManualSolve ? (
        manualSolveButtons
      ) : status === Status.ReadyToSolve ? (
        readyToSolveButtons
      ) : (
        <></>
      )}
    </Box>
  );
};

export default Buttons;

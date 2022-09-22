import { FunctionComponent } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import { changeStatus, Status } from '../state/appSlice';
import {
  moveBlock,
  moveBlockToPos,
  randomize,
  reset as boardReset,
} from '../state/boardSlice';
import {
  init as algoInit,
  incrementStepIdx,
  decrementStepIdx,
} from '../state/algoSolveSlice';
import {
  init as manualInit,
  undoMove,
  reset as manualSolveReset,
  clearBlockToMove,
  clearAvailablePositions,
} from '../state/manualSolveSlice';
import { Board } from '../models/Board';
import { getOppositeMove } from '../models/global';
import { DESKTOP_CELL_SIZE, MOBILE_CELL_SIZE, MOBILE_CUTOFF } from '../constants';
import store from '../state/store';
import ButtonWrapper from './ButtonWrapper';

const Buttons: FunctionComponent = () => {
  // State
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.app.status);
  const blocks = useAppSelector((state) => state.board.blocks);
  const grid = useAppSelector((state) => state.board.grid);
  const currentStep = useAppSelector((state) => (
    state.algoSolve.steps 
      ? state.algoSolve.steps[state.algoSolve.stepIdx] 
      : null
  ));
  const numSteps = useAppSelector((state) => state.algoSolve.steps?.length);
  const stepIdx = useAppSelector((state) => state.algoSolve.stepIdx);
  const previousStep = useAppSelector((state) => (
    state.algoSolve.steps 
      ? state.algoSolve.steps[state.algoSolve.stepIdx + 1] 
      : null
  ));
  const currentMove = useAppSelector((state) => (
    state.manualSolve.moves[state.manualSolve.moveIdx - 1]
  ));
  const moveIdx = useAppSelector((state) => state.manualSolve.moveIdx);

  // Button Actions
  const getRandomBoard = () => {
    dispatch(randomize());
    dispatch(changeStatus({ status: Status.ReadyToSolve }));
  }
  const startOver = () => {
    dispatch(boardReset());
    dispatch(manualSolveReset());
    dispatch(changeStatus({ status: Status.Start }));
  }
  const getPreviousStep = () => {
    if (previousStep) {
      dispatch(moveBlock({ move: getOppositeMove(previousStep) }));
      dispatch(incrementStepIdx());
    }
  }
  const getNextStep = () => {
    if (status !== Status.StepThroughSolution) {
      dispatch(changeStatus({ status: Status.StepThroughSolution }));
    }

    if (currentStep) {
      dispatch(moveBlock({ move: currentStep }));
      dispatch(decrementStepIdx());
    }
  }
  const undoLastMove = () => {
    const { block, oldPos, newPos } = currentMove;
    dispatch(moveBlockToPos({ pb: { block, pos: newPos }, newPos: oldPos }));
    dispatch(undoMove());
    dispatch(clearBlockToMove());
    dispatch(clearAvailablePositions());
  } 
  const initManualSolve = () => {
    dispatch(manualInit({ blocks, grid }));

    const optimalMoves = store.getState().manualSolve.optimalMoves;
    dispatch(changeStatus({
      status: !optimalMoves
        ? Status.Failed
        : optimalMoves.length > 0
          ? Status.ManualSolve
          : Status.AlreadySolved
    }));
  }
  const initAlgoSolve = () => {
    dispatch(algoInit({ blocks, grid }));

    const steps = store.getState().algoSolve.steps;
    dispatch(changeStatus({ 
      status: !steps
        ? Status.Failed
        : steps.length > 0 
          ? Status.StepThroughSolution 
          : Status.AlreadySolved 
    }));
  };

  // Buttons
  const randomizeButton = <ButtonWrapper title="Create board for me" onClick={getRandomBoard} />;
  const startOverButton = <ButtonWrapper title="Start Over" onClick={startOver} />;
  const stepThroughSolutionButtons = (
    <>
      { stepIdx < 0 ? startOverButton : <></>}
      <ButtonWrapper title="Previous Step" onClick={getPreviousStep} disabled={!numSteps || stepIdx >= numSteps - 1} />
      <ButtonWrapper title="Next Step" onClick={getNextStep} disabled={stepIdx < 0} />
    </>
  );
  const manualSolveButtons = (
    <>
      <ButtonWrapper title="Undo Move" onClick={undoLastMove} disabled={moveIdx <= 0} />
      <ButtonWrapper title="Clear Board" onClick={startOver} />
    </>
  );
  const readyToSolveButtons = (
    <>
      {startOverButton}
      <ButtonWrapper title="Solve myself" onClick={initManualSolve} />
      <ButtonWrapper title="Solve for me" onClick={initAlgoSolve} />
    </>
  );

  // Styling
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
  const cellSize = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
  const boardHeight = cellSize * Board.rows + 1;
  const buttonStyling = { position: 'absolute', width: '100%', left: 0 };

  return (
    <Box
      sx={{
        ...buttonStyling,
        top: `${boardHeight + 1}rem`,
        display: 'flex',
        justifyContent: 'center',
      }}
    >{
      [
        Status.Done, 
        Status.DoneOptimal, 
        Status.ManualBuild, 
        Status.Failed, 
        Status.AlreadySolved
      ].includes(status) ? startOverButton
        : status === Status.StepThroughSolution ? stepThroughSolutionButtons
        : status === Status.Start ? randomizeButton
        : status === Status.ManualSolve ? manualSolveButtons
        : status === Status.ReadyToSolve ? readyToSolveButtons
        : <></>
    }</Box>
  );
};

export default Buttons;

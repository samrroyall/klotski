import { FunctionComponent } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import { changeStatus, Status } from '../state/appSlice';
import {
  moveBlock,
  moveBlockToPos,
  randomize,
  reset as boardReset,
  selectBoardIsValid,
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
  const boardIsValid = useAppSelector((state) => selectBoardIsValid(state));
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

  // Button Groups
  const randomizeButton = (
    <ButtonWrapper
      title="Create board for me"
      onClick={() => {
        dispatch(changeStatus({ status: Status.AlgoBuild }));
        dispatch(randomize());
      }}
    />
  );
  const startOverButton = (
    <ButtonWrapper
      title="Start Over"
      onClick={() => {
        dispatch(boardReset());
        dispatch(changeStatus({ status: Status.Start }));
      }}
    />
  );
  const stepThroughSolutionButtons = (
    <>
      <ButtonWrapper
        title="Previous Step"
        onClick={() => {
          if (previousStep) {
            dispatch(moveBlock({ move: getOppositeMove(previousStep) }));
            dispatch(incrementStepIdx());
          }
        }}
        disabled={!numSteps || stepIdx >= numSteps - 1}
      />
      <ButtonWrapper
        sx={{ marginLeft: '1rem' }}
        title="Next Step"
        onClick={() => {
          if (status !== Status.StepThroughSolution) {
            dispatch(changeStatus({ status: Status.StepThroughSolution }));
          }
          if (currentStep) {
            dispatch(moveBlock({ move: currentStep }));
            dispatch(decrementStepIdx());
          }
        }}
        disabled={stepIdx < 0}
      />
      {stepIdx < 0 ? <div style={{ marginLeft: '1rem' }}>{startOverButton}</div> : <></>}
    </>
  );
  const manualSolveButtons = (
    <>
      <ButtonWrapper
        title="Undo Move"
        onClick={() => {
          const { block, oldPos, newPos } = currentMove;
          dispatch(moveBlockToPos({ pb: { block, pos: newPos }, newPos: oldPos }));
          dispatch(undoMove());
          dispatch(clearBlockToMove());
          dispatch(clearAvailablePositions());
        }}
        disabled={moveIdx <= 0}
      />
      <ButtonWrapper
        sx={{ marginLeft: '1rem' }}
        title="Clear Board"
        onClick={() => {
          dispatch(boardReset());
          dispatch(manualSolveReset());
          dispatch(changeStatus({ status: Status.Start }));
        }}
      />
    </>
  );
  const buildButtons = (
    <>
      <ButtonWrapper
        title="Clear Board"
        onClick={() => {
          dispatch(boardReset());
          dispatch(changeStatus({ status: Status.Start }));
        }}
      />
      <ButtonWrapper
        sx={{ marginLeft: '1rem' }}
        title="Solve myself"
        disabled={!boardIsValid}
        onClick={() => {
          dispatch(manualInit({ blocks, grid }));

          const optimalMoves = store.getState().manualSolve.optimalMoves;

          if (!optimalMoves) {
            dispatch(changeStatus({ status: Status.Failed }));
          } else if (optimalMoves.length === 0) {
            dispatch(changeStatus({ status: Status.AlreadySolved }));
          } else {
            dispatch(changeStatus({ status: Status.ManualSolve }));
          }
        }}
      />
      <ButtonWrapper
        sx={{ marginLeft: '1rem' }}
        title="Solve board for me"
        disabled={!boardIsValid}
        onClick={() => {
          dispatch(algoInit({ blocks, grid }));

          const steps = store.getState().algoSolve.steps;

          if (!steps) {
            dispatch(changeStatus({ status: Status.Failed }));
          } else if (steps.length === 0) {
            dispatch(changeStatus({ status: Status.AlreadySolved }));
          } else {
            dispatch(changeStatus({ status: Status.StepThroughSolution }));
          }
        }}
      />
    </>
  );
  const buttons = status === Status.Start ? randomizeButton
    : status === Status.ManualBuild ? buildButtons
    : status === Status.AlgoBuild ? buildButtons
    : status === Status.Solved ? stepThroughSolutionButtons
    : status === Status.StepThroughSolution ? stepThroughSolutionButtons
    : status === Status.ManualSolve ? manualSolveButtons
    : status === Status.Done ? startOverButton
    : status === Status.Failed ? startOverButton
    : status === Status.AlreadySolved ? startOverButton
    : <></>;

  // Styling
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
  const cellSize = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
  const boardHeight = cellSize * Board.rows + 1;
  const buttonStyling = {
    position: 'absolute',
    width: '100%',
    left: 0,
  };

  return (
    <Box
      sx={{
        ...buttonStyling,
        top: `${boardHeight}rem`,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {buttons}
    </Box>
  );
};

export default Buttons;

import { FunctionComponent } from 'react';
import { Box, Button, SxProps, Theme, useMediaQuery } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import {
  moveBlock,
  moveBlockToPos,
  randomize,
  reset as boardReset,
  selectBoardIsValid,
} from '../state/board/boardSlice';
import {
  init as algoInit,
  incrementStepIdx,
  decrementStepIdx,
} from '../state/solve/algoSolveSlice';
import {
  init as manualInit,
  undoMove,
  reset as manualSolveReset,
  clearBlockToMove,
  clearAvailablePositions,
} from '../state/solve/manualSolveSlice';
import { Board } from '../models/Board';
import { getOppositeMove } from '../models/global';
import { Status } from '../App';
import { DESKTOP_CELL_SIZE, MOBILE_CELL_SIZE, MOBILE_CUTOFF } from '../constants';
import store from '../state/store';

////////////////////////////////////////////////////

interface ButtonProps {
  title: string;
  onClick: () => any;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const ButtonWrapper: FunctionComponent<ButtonProps> = ({ title, onClick, disabled, sx }) => {
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
  const size = isMobile ? 'small' : 'medium';

  return (
    <Button
      sx={{
        ...sx,
        fontSize: `${isMobile ? '0.6rem' : '1rem'} !important`,
      }}
      variant="outlined"
      size={size}
      disabled={disabled || false}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

interface ButtonsProps {
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

const Buttons: FunctionComponent<ButtonsProps> = ({ status, setStatus }) => {
  const dispatch = useAppDispatch();

  // Board State
  const blocks = useAppSelector((state) => state.board.blocks);
  const boardIsValid = useAppSelector((state) => selectBoardIsValid(state));
  const grid = useAppSelector((state) => state.board.grid);
  // Algo-Solve State
  const currentStep = useAppSelector((state) =>
    state.algoSolve.steps ? state.algoSolve.steps[state.algoSolve.stepIdx] : null
  );
  const numSteps = useAppSelector((state) => state.algoSolve.steps?.length);
  const stepIdx = useAppSelector((state) => state.algoSolve.stepIdx);
  const previousStep = useAppSelector((state) =>
    state.algoSolve.steps ? state.algoSolve.steps[state.algoSolve.stepIdx + 1] : null
  );
  // Manual-Solve State
  const currentMove = useAppSelector(
    (state) => state.manualSolve.moves[state.manualSolve.moveIdx - 1]
  );
  const moveIdx = useAppSelector((state) => state.manualSolve.moveIdx);

  const randomizeButton = (
    <ButtonWrapper
      title="Create board for me"
      onClick={() => {
        setStatus(Status.AlgoBuild);
        dispatch(randomize());
      }}
    />
  );

  const startOverButton = (
    <ButtonWrapper
      title="Start Over"
      onClick={() => {
        dispatch(boardReset());
        setStatus(Status.Start);
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
          if (status !== Status.StepThroughSolution) setStatus(Status.StepThroughSolution);
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
          setStatus(Status.Start);
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
          setStatus(Status.Start);
        }}
      />
      <ButtonWrapper
        sx={{ marginLeft: '1rem' }}
        title="Solve myself"
        disabled={!boardIsValid}
        onClick={() => {
          dispatch(manualInit({ blocks, grid }));

          const optimalMoves = store.getState().manualSolve.optimalMoves;

          if (!optimalMoves) setStatus(Status.Failed);
          else if (optimalMoves.length === 0) setStatus(Status.AlreadySolved);
          else setStatus(Status.ManualSolve);
        }}
      />
      <ButtonWrapper
        sx={{ marginLeft: '1rem' }}
        title="Solve board for me"
        disabled={!boardIsValid}
        onClick={() => {
          dispatch(algoInit({ blocks, grid }));

          const steps = store.getState().algoSolve.steps;

          if (!steps) setStatus(Status.Failed);
          else if (steps.length === 0) setStatus(Status.AlreadySolved);
          else setStatus(Status.StepThroughSolution);
        }}
      />
    </>
  );

  const buttons = () => {
    switch (status) {
      case Status.Start:
        return randomizeButton;
      case Status.ManualBuild:
        return buildButtons;
      case Status.AlgoBuild:
        return buildButtons;
      case Status.Solved:
        return stepThroughSolutionButtons;
      case Status.StepThroughSolution:
        return stepThroughSolutionButtons;
      case Status.ManualSolve:
        return manualSolveButtons;
      case Status.Done:
        return startOverButton;
      case Status.Failed:
        return startOverButton;
      case Status.AlreadySolved:
        return startOverButton;
      default:
        return <></>;
    }
  };

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
      {buttons()}
    </Box>
  );
};

export default Buttons;

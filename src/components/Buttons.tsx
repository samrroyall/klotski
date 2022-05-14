import { FunctionComponent } from 'react';
import { Box, Button } from '@mui/material';
import { Board, Move } from '../models/Board';
import { BoardStatus, Status } from '../App';
import { globals } from '../globals';

interface Props {
  boardStatus: BoardStatus;
  functions: {
    createRandomBoard: () => void;
    clearBlocks: () => void;
    doStep: () => void;
    undoStep: () => void;
    algoSolve: () => void;
    manualSolve: () => void;
  };
  moves: Move[];
  moveIdx: number;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

const Buttons: FunctionComponent<Props> = ({
  boardStatus,
  functions,
  moves,
  moveIdx,
  status,
  setStatus,
}) => {
  const { createRandomBoard, clearBlocks, doStep, undoStep, algoSolve, manualSolve } = functions;

  const randomizeButton = (
    <Button
      variant="outlined"
      onClick={() => {
        setStatus(Status.AlgoBuild);
        createRandomBoard();
      }}
    >
      Create board for me
    </Button>
  );

  const showSolutionButtons = (
    <>
      <Button variant="outlined" onClick={() => undoStep()} disabled={moveIdx >= moves.length - 1}>
        Previous Step
      </Button>
      <Button
        sx={{ marginLeft: '1rem' }}
        variant="outlined"
        onClick={() => {
          if (status !== Status.StepThroughSolution) setStatus(Status.StepThroughSolution);
          doStep();
        }}
        disabled={moveIdx < 0}
      >
        Next Step
      </Button>
    </>
  );

  const buildButtons = (
    <>
      <Button variant="outlined" onClick={() => clearBlocks()}>
        Clear Board
      </Button>
      <Button
        sx={{ marginLeft: '1rem' }}
        variant="outlined"
        disabled={!boardStatus.isValid}
        onClick={() => {
          setStatus(Status.ManualSolve);
          manualSolve();
        }}
      >
        Solve myself
      </Button>
      <Button
        sx={{ marginLeft: '1rem' }}
        variant="outlined"
        disabled={!boardStatus.isValid}
        onClick={() => {
          setStatus(Status.AlgoSolve);
          algoSolve();
        }}
      >
        Solve board for me
      </Button>
    </>
  );

  const startOverButton = (
    <Button
      variant="outlined"
      onClick={() => {
        clearBlocks();
      }}
    >
      Start Over
    </Button>
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
        return showSolutionButtons;
      case Status.StepThroughSolution:
        return showSolutionButtons;
      case Status.Done:
        return startOverButton;
      case Status.Failed:
        return startOverButton;
      default:
        return <></>;
    }
  };

  const boardHeight = globals.cellSize * Board.rows + 1;
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

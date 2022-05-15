import { FunctionComponent } from 'react';
import { Box, Button } from '@mui/material';
import { Board } from '../models/Board';
import { BoardStatus, Status } from '../App';
import { globals } from '../globals';

interface Props {
  boardStatus: BoardStatus;
  functions: {
    createRandomBoard: () => void;
    clearBlocks: () => void;
    doStep: () => void;
    undoStep: () => void;
    undoMove: () => void;
    algoSolve: () => void;
    manualSolve: () => void;
  };
  numMoves: number;
  algoMoveIdx: number;
  manualMoveIdx: number;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

const Buttons: FunctionComponent<Props> = ({
  boardStatus,
  functions,
  numMoves,
  algoMoveIdx,
  manualMoveIdx,
  status,
  setStatus,
}) => {
  const { createRandomBoard, clearBlocks, doStep, undoStep, undoMove, algoSolve, manualSolve } =
    functions;

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

  const stepThroughSolutionButtons = (
    <>
      <Button variant="outlined" onClick={() => undoStep()} disabled={algoMoveIdx >= numMoves - 1}>
        Previous Step
      </Button>
      <Button
        sx={{ marginLeft: '1rem' }}
        variant="outlined"
        onClick={() => {
          if (status !== Status.StepThroughSolution) setStatus(Status.StepThroughSolution);
          doStep();
        }}
        disabled={algoMoveIdx < 0}
      >
        Next Step
      </Button>
    </>
  );

  const manualSolveButtons = (
    <>
      <Button variant="outlined" onClick={() => undoMove()} disabled={manualMoveIdx <= 0}>
        Undo Move
      </Button>
      <Button sx={{ marginLeft: '1rem' }} variant="outlined" onClick={() => clearBlocks()}>
        Clear Board
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

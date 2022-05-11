import { FunctionComponent } from 'react';
import { Box, Button } from '@mui/material';
import { Board, Move } from '../models/Board';
import { BoardStatus, Status } from '../App';
import { globals } from '../globals';

interface Props {
  boardStatus: BoardStatus;
  functions: {
    addDefaultBlocks: () => void;
    clearBlocks: () => void;
    doStep: () => void;
    undoStep: () => void;
    solve: () => void;
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
  const { addDefaultBlocks, clearBlocks, doStep, undoStep, solve } = functions;

  const randomizeButton = (
    <Button
      variant="outlined"
      onClick={() => {
        setStatus(Status.AlgoBuild);
        addDefaultBlocks();
      }}
    >
      Randomize
    </Button>
  );

  const solveForMeButton = (
    <Button
      variant="outlined"
      onClick={() => {
        setStatus(Status.AlgoSolve);
        solve();
      }}
    >
      Solve For Me
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
        onClick={() => setStatus(Status.ReadyToSolve)}
        disabled={!boardStatus.isValid}
      >
        Continue
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
      case Status.ReadyToSolve:
        return solveForMeButton;
      case Status.Solved:
        return showSolutionButtons;
      case Status.StepThroughSolution:
        return showSolutionButtons;
      case Status.Done:
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

import { FunctionComponent } from 'react';
import { Box, Button, SxProps, Theme, useMediaQuery } from '@mui/material';
import { Board } from '../models/Board';
import { BoardStatus, Status } from '../App';
import { globals } from '../globals';

interface ButtonProps {
  title: string;
  onClick: () => any;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const ButtonWrapper: FunctionComponent<ButtonProps> = ({ title, onClick, disabled, sx }) => {
  const isMobile = useMediaQuery(`(max-width:${globals.mobileCutoff}px)`);
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

const Buttons: FunctionComponent<ButtonsProps> = ({
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
    <ButtonWrapper
      title="Create board for me"
      onClick={() => {
        setStatus(Status.AlgoBuild);
        createRandomBoard();
      }}
    />
  );

  const stepThroughSolutionButtons = (
    <>
      <ButtonWrapper
        title="Previous Step"
        onClick={() => undoStep()}
        disabled={algoMoveIdx >= numMoves - 1}
      />
      <ButtonWrapper
        sx={{ marginLeft: '1rem' }}
        title="Next Step"
        onClick={() => {
          if (status !== Status.StepThroughSolution) setStatus(Status.StepThroughSolution);
          doStep();
        }}
        disabled={algoMoveIdx < 0}
      />
    </>
  );

  const manualSolveButtons = (
    <>
      <ButtonWrapper title="Undo Move" onClick={() => undoMove()} disabled={manualMoveIdx <= 0} />
      <ButtonWrapper
        sx={{ marginLeft: '1rem' }}
        title="Clear Board"
        onClick={() => clearBlocks()}
      />
    </>
  );

  const buildButtons = (
    <>
      <ButtonWrapper title="Clear Board" onClick={() => clearBlocks()} />
      <ButtonWrapper
        sx={{ marginLeft: '1rem' }}
        title="Solve myself"
        disabled={!boardStatus.isValid}
        onClick={() => {
          setStatus(Status.ManualSolve);
          manualSolve();
        }}
      />
      <ButtonWrapper
        sx={{ marginLeft: '1rem' }}
        title="Solve board for me"
        disabled={!boardStatus.isValid}
        onClick={() => {
          setStatus(Status.AlgoSolve);
          algoSolve();
        }}
      />
    </>
  );

  const startOverButton = <ButtonWrapper title="Start Over" onClick={() => clearBlocks()} />;

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

  const isMobile = useMediaQuery(`(max-width:${globals.mobileCutoff}px)`);
  const cellSize = isMobile ? globals.mobileCellSize : globals.desktopCellSize;
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

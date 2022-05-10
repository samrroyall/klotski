import { FunctionComponent, useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Block } from '../models/Block';
import { oppositeDir, Pos, updatePos } from '../models/PositionedBlock';
import { Board, Move } from '../models/Board';
import { solveBoard } from '../models/Solver';
import { Status } from '../App';
import { globals } from '../globals';

interface Props {
  board: Board;
  addBlock: (block: Block, pos: Pos) => void;
  moveBlock: (move: Move) => void;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

const Buttons: FunctionComponent<Props> = ({ board, addBlock, moveBlock, status, setStatus }) => {
  const initialMoveIdx: number = -1;
  const [moveIdx, setMoveIdx] = useState(initialMoveIdx);

  const initialMoves: Move[] = [];
  const [moves, setMoves] = useState(initialMoves);

  // Helpers

  const placeDefaultBoard = () => {
    addBlock(Block.TWO_BY_ONE, { row: 0, col: 0 });
    addBlock(Block.TWO_BY_TWO, { row: 0, col: 1 });
    addBlock(Block.TWO_BY_ONE, { row: 0, col: 3 });
    addBlock(Block.TWO_BY_ONE, { row: 2, col: 0 });
    addBlock(Block.ONE_BY_TWO, { row: 2, col: 1 });
    addBlock(Block.TWO_BY_ONE, { row: 2, col: 3 });
    addBlock(Block.ONE_BY_ONE, { row: 3, col: 1 });
    addBlock(Block.ONE_BY_ONE, { row: 3, col: 2 });
    addBlock(Block.ONE_BY_ONE, { row: 4, col: 0 });
    addBlock(Block.ONE_BY_ONE, { row: 4, col: 3 });
  };

  const undoStep = () => {
    const prevMove = moves[moveIdx + 1];

    const newPos = { row: prevMove.pos.row, col: prevMove.pos.col };
    prevMove.dirs.forEach((dir) => updatePos(newPos, dir));

    const oppositeDirs = prevMove.dirs.map((dir) => oppositeDir(dir)).reverse();

    moveBlock({ block: prevMove.block, pos: newPos, dirs: oppositeDirs });
    setMoveIdx(moveIdx + 1);
  };

  const doStep = () => {
    const currMove = moves[moveIdx];

    moveBlock(currMove);
    setMoveIdx(moveIdx - 1);
  };

  // Status Dispatcher

  useEffect(() => {
    switch (status) {
      case Status.AlgoBuild: {
        placeDefaultBoard();
        setStatus(Status.ReadyToSolve);
        return;
      }
      case Status.AlgoSolve: {
        const solution = solveBoard(board);
        if (solution) {
          setStatus(Status.Solved);
          setMoves(solution);
          setMoveIdx(solution.length - 1);
        } else {
          setStatus(Status.Done);
        }
        return;
      }
      default:
        return;
    }
  }, [status]);

  useEffect(() => {
    if (moves.length > 0 && moveIdx < 0) setStatus(Status.Done);
  }, [moveIdx]);

  // Status Text

  const statusText = () => {
    switch (status) {
      case Status.Solved:
        return `An optional solution of length ${moves.length} was found!`;
      case Status.StepThroughSolution:
        return `${moveIdx + 1} moves remain`;
      case Status.Done:
        return moves.length === 0 ? 'No Solution Found :(' : 'Done!';
      default:
    }
  };

  // Buttons

  const randomizeButton = (
    <Button variant="outlined" onClick={() => setStatus(Status.AlgoBuild)}>
      Randomize
    </Button>
  );

  const solveForMeButton = (
    <Button variant="outlined" onClick={() => setStatus(Status.AlgoSolve)}>
      Solve For Me
    </Button>
  );

  const prevStepButton = (
    <Button variant="outlined" onClick={() => undoStep()} disabled={moveIdx >= moves.length - 1}>
      Previous Step
    </Button>
  );

  const nextStepButton = (
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
  );

  const showSolutionButtons = (
    <>
      {prevStepButton}
      {nextStepButton}
    </>
  );

  const buttons = () => {
    switch (status) {
      case Status.Start:
        return randomizeButton;
      case Status.ReadyToSolve:
        return solveForMeButton;
      case Status.Solved:
        return showSolutionButtons;
      case Status.StepThroughSolution:
        return showSolutionButtons;
      case Status.Done:
        return <></>;
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
    <>
      <Box
        sx={{
          ...buttonStyling,
          top: '-2rem',
          display: 'block',
          height: '1rem',
          textAlign: 'center',
        }}
      >
        {statusText()}
      </Box>
      ;
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
      ;
    </>
  );
};

export default Buttons;

import { FunctionComponent, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Block } from './models/Block';
import {
  oppositeDir,
  isSamePositionedBlock,
  PositionedBlock,
  Pos,
  updatePos,
} from './models/PositionedBlock';
import { Board, Move } from './models/Board';
import { solveBoard } from './models/Solver';
import BoardUI from './components/BoardUI';
import Buttons from './components/Buttons';

export enum Status {
  Start,
  ManualBuild,
  AlgoBuild,
  ManualSolve,
  AlgoSolve,
  Solved,
  StepThroughSolution,
  SimulateSolution,
  Done,
}

export interface BoardStatus {
  isValid: boolean;
  isValidDebug: {
    numTwoByTwos: number;
    numCellsFilled: number;
  };
}

const App: FunctionComponent = () => {
  // Status State
  const initialStatus = Status.Start;
  const [status, setStatus] = useState(initialStatus);

  // Board/Blocks State

  const [board, _] = useState(new Board());
  const [blocks, setBlocks] = useState(board.getBlocks());

  // Board Status

  const validateBoard = (): BoardStatus => {
    return {
      isValid: board.isValid(),
      isValidDebug: {
        numTwoByTwos: board.numTwoByTwos(),
        numCellsFilled: board.numCellsFilled(),
      },
    };
  };

  const [boardStatus, setBoardStatus] = useState({ ...validateBoard() });

  // Board/Blocks Helpers

  const addBlock = (block: Block, pos: Pos) => {
    board.addBlock(block, pos);
    setBlocks(board.getBlocks());
    setBoardStatus({ ...validateBoard() });
  };

  const getRandomAvailableCoords = (
    maxRow: number = Board.rows,
    maxCol: number = Board.cols
  ): { row: number; col: number } => {
    const getRandomCoords = () => [
      Math.floor(Math.random() * maxRow),
      Math.floor(Math.random() * maxCol),
    ];

    const grid = board.getGrid();
    let [i, j] = getRandomCoords();
    while (grid[i][j] !== 0) {
      [i, j] = getRandomCoords();
    }

    return { row: i, col: j };
  };

  const numCellsAvailable = () => Board.rows * Board.cols - 2 - board.numCellsFilled();

  const getRandomBlock = (): Block | null => {
    const cellsAvailable = numCellsAvailable();
    if (cellsAvailable <= 0) return null;

    let availableBlocks: Block[] = [];
    if (board.numTwoByTwos() === 0) availableBlocks = [Block.TWO_BY_TWO];
    else if (cellsAvailable === 1) availableBlocks = [Block.ONE_BY_ONE];
    else availableBlocks = [Block.ONE_BY_ONE, Block.ONE_BY_TWO, Block.TWO_BY_ONE];

    return availableBlocks[Math.floor(Math.random() * availableBlocks.length)];
  };

  const createRandomBoard = () => {
    while (numCellsAvailable() > 0) {
      try {
        addBlock(getRandomBlock()!, getRandomAvailableCoords());
      } catch {
        continue;
      }
    }
  };

  const moveBlock = (move: Move) => {
    const movePosBlock = new PositionedBlock(move.block, move.pos);
    for (let i = 0; i < blocks.length; i++) {
      if (!isSamePositionedBlock(blocks[i], movePosBlock)) continue;

      setBlocks(blocks.slice(0, i).concat(blocks.slice(i + 1, blocks.length)));
      const blockToMove = blocks[i];
      blockToMove.move(move.dirs);
      setBlocks([...blocks, blockToMove]);
    }
  };

  // Solution State

  const initialMoveIdx: number = -1;
  const [moveIdx, setMoveIdx] = useState(initialMoveIdx);

  const initialMoves: Move[] = [];
  const [moves, setMoves] = useState(initialMoves);

  // Solution Helpers

  useEffect(() => {
    if (moves.length > 0 && moveIdx < 0) setStatus(Status.Done);
  }, [moveIdx, moves, moves.length]);

  const solve = () => {
    const solution = solveBoard(board);
    if (!solution) {
      setStatus(Status.Done);
      return;
    }

    setMoves(solution);
    setMoveIdx(solution.length - 1);
    setStatus(Status.Solved);
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

  // Status Message

  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (status === Status.Start) setMsg('Hover over the board to add blocks');
    else if (status === Status.ManualBuild)
      setMsg(`A valid board has exactly one 2x2 block and two empty cells`);
    else if (status === Status.Solved)
      setMsg(`An optional solution of length ${moves.length} was found!`);
    else if (status === Status.StepThroughSolution)
      setMsg(`${moves.length - moveIdx - 1}/${moves.length}`);
    else if (status === Status.Done) setMsg(moves.length === 0 ? 'No Solution Found :(' : 'Done!');
    else setMsg('');
  }, [status, moves, moveIdx]);

  // resetState

  const resetState = () => {
    board.reset();
    setBlocks(board.getBlocks());
    setStatus(initialStatus);
    setMoves(initialMoves);
    setMoveIdx(initialMoveIdx);
    setBoardStatus(validateBoard());
  };

  return (
    <Box className="App">
      <h1 style={{ textAlign: 'center' }}>KLOTSKI SOLVER</h1>
      <h4 style={{ textAlign: 'center' }}>{msg}</h4>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <BoardUI
          boardStatus={boardStatus}
          blocks={blocks}
          addBlock={addBlock}
          status={status}
          setStatus={setStatus}
        />
        <Buttons
          boardStatus={boardStatus}
          functions={{
            createRandomBoard,
            clearBlocks: resetState,
            doStep,
            undoStep,
            solve,
          }}
          moves={moves}
          moveIdx={moveIdx}
          status={status}
          setStatus={setStatus}
        />
      </Box>
    </Box>
  );
};

export default App;

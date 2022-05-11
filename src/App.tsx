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
  ReadyToSolve,
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

  const [status, setStatus] = useState(Status.Start);

  // Board/Blocks State

  const initialBoardStatus = {
    isValid: false,
    isValidDebug: { numCellsFilled: 0, numTwoByTwos: 0 },
  };
  const [boardStatus, setBoardStatus] = useState(initialBoardStatus);

  const initialBlocks: PositionedBlock[] = [];
  const [blocks, setBlocks] = useState(initialBlocks);

  const [board, _] = useState(new Board());

  // Board/Blocks Helpers

  const validateBoard = (): BoardStatus => {
    return {
      isValid: board.isValid(),
      isValidDebug: {
        numTwoByTwos: board.numTwoByTwos(),
        numCellsFilled: board.numCellsFilled(),
      },
    };
  };

  const addBlock = (block: Block, pos: Pos) => {
    try {
      board.addBlock(block, pos);

      const newBlock = new PositionedBlock(block, pos);
      setBlocks([...blocks, newBlock]);

      const validation = validateBoard();
      setBoardStatus({
        isValid: validation.isValid,
        isValidDebug: {
          numTwoByTwos: validation.isValidDebug.numTwoByTwos,
          numCellsFilled: validation.isValidDebug.numCellsFilled,
        },
      });
    } catch {
      alert('Add block failed!');
    }
  };

  const addDefaultBlocks = () => {
    const defaultBlocks = [
      { block: Block.TWO_BY_ONE, pos: { row: 0, col: 0 } },
      { block: Block.TWO_BY_TWO, pos: { row: 0, col: 1 } },
      { block: Block.TWO_BY_ONE, pos: { row: 0, col: 3 } },
      { block: Block.TWO_BY_ONE, pos: { row: 2, col: 0 } },
      { block: Block.ONE_BY_TWO, pos: { row: 2, col: 1 } },
      { block: Block.TWO_BY_ONE, pos: { row: 2, col: 3 } },
      { block: Block.ONE_BY_ONE, pos: { row: 3, col: 1 } },
      { block: Block.ONE_BY_ONE, pos: { row: 3, col: 2 } },
      { block: Block.ONE_BY_ONE, pos: { row: 4, col: 0 } },
      { block: Block.ONE_BY_ONE, pos: { row: 4, col: 3 } },
    ];
    try {
      board.addBlocks(defaultBlocks);

      setBlocks([
        ...blocks,
        ...defaultBlocks.map(({ block, pos }) => new PositionedBlock(block, pos)),
      ]);

      const validation = validateBoard();
      setBoardStatus({
        isValid: validation.isValid,
        isValidDebug: {
          numTwoByTwos: validation.isValidDebug.numTwoByTwos,
          numCellsFilled: validation.isValidDebug.numCellsFilled,
        },
      });
    } catch {
      alert('Adding default blocks failed!');
      board.reset();
    }
  };

  const clearBlocks = () => {
    board.reset();
    setBlocks([]);
    setStatus(Status.Start);
    setBoardStatus(initialBoardStatus);
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
  }, [moveIdx]);

  const solve = () => {
    const solution = solveBoard(board);
    if (!solution) {
      setStatus(Status.Done);
      return;
    }

    setStatus(Status.Solved);
    setMoves(solution);
    setMoveIdx(solution.length - 1);
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
    let newMsg = '';
    if (status === Status.Solved)
      newMsg = `An optional solution of length ${moves.length} was found!`;
    else if (status === Status.StepThroughSolution)
      newMsg = `${moves.length - moveIdx - 1}/${moves.length}`;
    else if (status === Status.Done) newMsg = moves.length === 0 ? 'No Solution Found :(' : 'Done!';

    setMsg(newMsg);
  }, [status, moves, moveIdx]);

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
            addDefaultBlocks,
            clearBlocks,
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

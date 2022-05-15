import { FunctionComponent, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Block } from './models/Block';
import { oppositeDir, PositionedBlock, Pos, getNewPos } from './models/PositionedBlock';
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
  Failed,
  AlreadySolved,
}

export interface BoardStatus {
  isValid: boolean;
  isValidDebug: {
    numTwoByTwos: number;
    numCellsFilled: number;
  };
}

export interface ManualMove {
  block: Block;
  oldPos: Pos;
  newPos: Pos;
}

const App: FunctionComponent = () => {
  // Status State

  const [status, setStatus] = useState(Status.Start);
  const [board, _] = useState(new Board());
  const [blocks, setBlocks] = useState(board.getBlocks());
  const [msg, setMsg] = useState<JSX.Element>(<></>);

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

  // Solution State

  const [moves, setMoves] = useState<Move[]>([]);
  const [manualMoves, setManualMoves] = useState<ManualMove[]>([]);
  const [numMoves, setNumMoves] = useState(-1);
  const [algoMoveIdx, setAlgoMoveIdx] = useState(-1);
  const [manualMoveIdx, setManualMoveIdx] = useState(-1);

  // AlgoSolve Helpers

  useEffect(() => {
    if (status === Status.StepThroughSolution && moves.length > 0 && algoMoveIdx < 0)
      setStatus(Status.Done);
  }, [status, algoMoveIdx, moves, moves.length]);

  const algoSolve = () => {
    const solution = solveBoard(board);
    if (!solution) {
      setStatus(Status.Failed);
      return;
    } else if (solution.length === 0) {
      setStatus(Status.AlreadySolved);
      return;
    }

    setMoves(solution);
    setNumMoves(solution.length);
    setAlgoMoveIdx(solution.length - 1);
    setStatus(Status.Solved);
  };

  const undoStep = () => {
    const prevMove = moves[algoMoveIdx + 1];

    const newPos = { row: prevMove.pos.row, col: prevMove.pos.col };
    prevMove.dirs.forEach((dir) => getNewPos(newPos, dir));

    const oppositeDirs = prevMove.dirs.map((dir) => oppositeDir(dir)).reverse();

    moveBlock({ block: prevMove.block, pos: newPos, dirs: oppositeDirs });
    setAlgoMoveIdx(algoMoveIdx + 1);
  };

  const doStep = () => {
    const currMove = moves[algoMoveIdx];
    moveBlock(currMove);
    setAlgoMoveIdx(algoMoveIdx - 1);
  };

  const moveBlock = (move: Move) => {
    // This call moves a block during the Solved/StepThroughSolution phase
    if (![Status.Solved, Status.StepThroughSolution].includes(status)) return;

    board.moveBlock(move);
    setBlocks(board.getBlocks());
  };

  // ManualSolve Helpers

  const manualSolve = () => {
    const solution = solveBoard(board);
    if (!solution) {
      setStatus(Status.Failed);
      return;
    } else if (solution.length === 0) {
      setStatus(Status.AlreadySolved);
      return;
    }

    setNumMoves(solution.length);
    setManualMoveIdx(0);
  };

  const moveBlockToPos = (posBlock: PositionedBlock, pos: Pos) => {
    // This call moves a block during the ManualSolve phase
    if (status !== Status.ManualSolve) return;

    setManualMoves([
      ...manualMoves,
      { block: posBlock.block, oldPos: posBlock.minPos(), newPos: pos },
    ]);
    board.moveBlockToPos(posBlock, pos);
    setBlocks(board.getBlocks());
    setManualMoveIdx(manualMoveIdx + 1);

    if (board.isSolved()) setStatus(Status.Done);
  };

  const undoMove = () => {
    if (manualMoves.length === 0) return;

    const { block, oldPos, newPos } = manualMoves.pop()!;
    board.moveBlockToPos(new PositionedBlock(block, newPos), oldPos);
    setBlocks(board.getBlocks());
    setManualMoveIdx(manualMoveIdx - 1);
  };

  // Status Message

  useEffect(() => {
    if (status === Status.Start) setMsg(<span>Hover over the board to add blocks</span>);
    else if (status === Status.ManualBuild && !boardStatus.isValid)
      setMsg(<span>A valid board has exactly one 2x2 block and two empty cells</span>);
    else if (boardStatus.isValid && [Status.ManualBuild, Status.AlgoBuild].includes(status))
      setMsg(<span>The board is ready to solve</span>);
    else if (status === Status.ManualSolve)
      setMsg(
        <span>
          Current Moves: <strong>{manualMoveIdx}</strong> Fewest Possible Moves:{' '}
          <strong>{numMoves}</strong>
        </span>
      );
    else if (status === Status.Solved)
      setMsg(
        <span>
          The optimal solution is <strong>{numMoves}</strong> steps long
        </span>
      );
    else if (status === Status.StepThroughSolution)
      setMsg(
        <span>
          <strong>{numMoves - algoMoveIdx - 1}</strong>/<strong>{numMoves}</strong>
        </span>
      );
    else if (status === Status.Done)
      setMsg(
        manualMoveIdx > 0 ? (
          manualMoveIdx === numMoves ? (
            <span>
              You solved the board in <strong>{manualMoveIdx}</strong> moves. That's the fewest
              moves possible!
            </span>
          ) : (
            <span>
              You solved the board in <strong>{manualMoveIdx}</strong> moves!
            </span>
          )
        ) : (
          <span>Done!</span>
        )
      );
    else if (status === Status.Failed) setMsg(<span>No Solution Found :(</span>);
    else if (status === Status.AlreadySolved)
      setMsg(<span>Oops! It looks like the board is already solved</span>);
    else setMsg(<span></span>);
  }, [status, boardStatus, numMoves, algoMoveIdx, manualMoveIdx]);

  // resetState

  const resetState = () => {
    board.reset();
    setBlocks(board.getBlocks());
    setStatus(Status.Start);
    setMoves([]);
    setAlgoMoveIdx(-1);
    setManualMoveIdx(-1);
    setBoardStatus(validateBoard());
  };

  return (
    <Box className="App">
      <h1 style={{ textAlign: 'center' }}>KLOTSKI SOLVER</h1>
      <p style={{ display: 'block', textAlign: 'center', marginBottom: '2rem' }}>{msg}</p>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <BoardUI
          boardStatus={boardStatus}
          blocks={blocks}
          functions={{
            addBlock,
            getPotentialNewPositions: (block: Block, pos: Pos) =>
              board.availablePositions(block, pos),
            moveBlockToPos,
          }}
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
            undoMove,
            algoSolve,
            manualSolve,
          }}
          numMoves={numMoves}
          algoMoveIdx={algoMoveIdx}
          manualMoveIdx={manualMoveIdx}
          status={status}
          setStatus={setStatus}
        />
      </Box>
    </Box>
  );
};

export default App;

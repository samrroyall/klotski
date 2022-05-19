import { FunctionComponent, useEffect, useState } from 'react';
import { Box, Tooltip, useMediaQuery } from '@mui/material';
import { HelpOutlineOutlined } from '@mui/icons-material';
import { Block } from './models/Block';
import { oppositeDir, PositionedBlock, Pos, getNewPosFromDir } from './models/PositionedBlock';
import { Board, Move } from './models/Board';
import { solveBoard } from './models/Solver';
import BoardUI from './components/BoardUI';
import Buttons from './components/Buttons';
import StatusMsg from './components/StatusMsg';
import { Toast, Severity } from './components/Toast';
import { globals } from './globals';

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
    prevMove.dirs.forEach((dir) => getNewPosFromDir(newPos, dir));

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

  const [potentialPositions, setPotentialPositions] = useState<Pos[]>([]);

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
    setPotentialPositions([]);
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
    setPotentialPositions([]);
    if (manualMoves.length === 0) return;

    const { block, oldPos, newPos } = manualMoves.pop()!;
    board.moveBlockToPos(new PositionedBlock(block, newPos), oldPos);
    setBlocks(board.getBlocks());
    setManualMoveIdx(manualMoveIdx - 1);
  };

  // Alert State

  const [alert, setAlert] = useState<JSX.Element | null>(null);

  const addAlert = (msg: string, severity: Severity) =>
    setAlert(<Toast severity={severity} msg={msg} closeCallback={() => setAlert(null)} />);

  const AlertContainer: FunctionComponent = () => (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3rem',
        paddingY: '1rem',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {alert}
    </Box>
  );

  // Title Container
  const isMobile = useMediaQuery(`(max-width:${globals.mobileCutoff}px)`);

  const TitleContainer = () => {
    const helpText = `${isMobile ? 'Clock on ' : 'Hover over '} the cells bellow to add a block of 
    size HEIGHT x WIDTH. A valid board contains exactly one 2x2 block and exactly two free spaces. 
    You can also click 'Create Board For Me' to get a random board.`;

    return (
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}
      >
        <h1 style={{ padding: 0, margin: 0 }}>KLOTSKI SOLVER</h1>
        <Tooltip title={helpText} arrow>
          <HelpOutlineOutlined color="action" fontSize="small" style={{ marginLeft: '1rem' }} />
        </Tooltip>
      </Box>
    );
  };

  // Reset State

  const resetState = () => {
    board.reset();
    setBlocks(board.getBlocks());
    setStatus(Status.Start);
    setMoves([]);
    setAlgoMoveIdx(-1);
    setManualMoveIdx(-1);
    setBoardStatus(validateBoard());
    setPotentialPositions([]);
  };

  return (
    <Box className="App">
      <AlertContainer />
      <TitleContainer />
      <StatusMsg
        status={status}
        boardIsValid={boardStatus.isValid}
        numMoves={numMoves}
        algoMoveIdx={algoMoveIdx}
        manualMoveIdx={manualMoveIdx}
      />
      <Box sx={{ position: 'relative', width: '100%' }}>
        <BoardUI
          boardStatus={boardStatus}
          blocks={blocks}
          functions={{
            addBlock,
            addAlert,
            getPotentialPositions: (block: Block, pos: Pos) => board.availablePositions(block, pos),
            setPotentialPositions,
            moveBlockToPos,
          }}
          potentialPositions={potentialPositions}
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

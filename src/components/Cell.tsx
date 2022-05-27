import { FunctionComponent, useEffect, useState } from 'react';
import { Box, colors, useMediaQuery } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  addBlock,
  moveBlockToPos,
  selectBoardIsSolved,
  selectNumCellsFilled,
  selectNumTwoByTwoBlocks,
} from '../state/board/boardSlice';
import { doMove, clearAvailablePositions, clearBlockToMove } from '../state/solve/manualSolveSlice';
import { Board } from '../models/Board';
import { UIBlock } from '../models/global';
import { Status } from '../App';
import { Severity } from './Toast';
import { DESKTOP_CELL_SIZE, MOBILE_CELL_SIZE, MOBILE_CUTOFF } from '../constants';
import store, { RootState } from '../state/store';

interface MBSProps {
  size: number;
  show: boolean;
  onClick: () => any;
}

const MoveBlockSelector: FunctionComponent<MBSProps> = ({ size, show, onClick }) => {
  return (
    <Box
      sx={{
        height: `${size}rem`,
        width: `${size}rem`,
        backgroundColor: colors.deepPurple[300],
        '&:hover': { backgroundColor: colors.deepPurple[400] },
        zIndex: show ? 20 : 0,
      }}
      onClick={() => onClick()}
    ></Box>
  );
};

interface ABSProps {
  block: UIBlock;
  show: boolean;
  onClick: () => any;
}

const AddBlockSelector: FunctionComponent<ABSProps> = ({ block, onClick }) => {
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50%',
        width: '50%',
        color: colors.grey[400],
        '&:hover': { color: colors.grey[800] },
        fontSize: isMobile ? '0.8rem' : '1rem',
        fontWeight: 'bold',
      }}
      onClick={() => onClick()}
    >
      {block.rows}×{block.cols}
    </Box>
  );
};

interface CellProps {
  row: number;
  col: number;
  addAlert: (msg: string, severity: Severity) => void;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

const Cell: FunctionComponent<CellProps> = ({ row, col, addAlert, status, setStatus }) => {
  const inLastRow = row === Board.rows - 1;
  const inLastCol = col === Board.cols - 1;

  // State
  const dispatch = useAppDispatch();
  const availablePositions = useAppSelector((state) => state.manualSolve.availablePositions);
  const blockToMove = useAppSelector((state) => state.manualSolve.blockToMove);
  const numCellsFilled = useAppSelector((state) => selectNumCellsFilled(state));
  const numTwoByTwoBlocks = useAppSelector((state) => selectNumTwoByTwoBlocks(state));

  const getBoardIsSolved = (state: RootState) => selectBoardIsSolved(state);

  const [isAvailablePosition, setIsAvailablePosition] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    setIsAvailablePosition(
      availablePositions.filter((pos) => pos.row === row && pos.col === col).length > 0
    );
  }, [col, row, availablePositions, setIsAvailablePosition]);

  // Helpers
  const isWinningCell =
    (row === Board.winningPos.row || row === Board.winningPos.row + 1) &&
    (col === Board.winningPos.col || col === Board.winningPos.col + 1);
  const maxCellsFilled = Board.cols * Board.rows - 2;

  const ONE_BY_ONE: UIBlock = { rows: 1, cols: 1 };
  const TWO_BY_ONE: UIBlock = { rows: 2, cols: 1 };
  const ONE_BY_TWO: UIBlock = { rows: 1, cols: 2 };
  const TWO_BY_TWO: UIBlock = { rows: 2, cols: 2 };

  const validBlocks = [];
  if (numCellsFilled < maxCellsFilled) {
    validBlocks.push(ONE_BY_ONE);
    if (numCellsFilled < maxCellsFilled - 1) {
      if (!inLastCol) validBlocks.push(ONE_BY_TWO);
      if (!inLastRow) validBlocks.push(TWO_BY_ONE);
    }
    if (numCellsFilled < maxCellsFilled - 3 && numTwoByTwoBlocks === 0 && !inLastRow && !inLastCol)
      validBlocks.push(TWO_BY_TWO);
  }

  // Moving Blocks

  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
  const cellSize = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
  const availablePositionBoxScaleFactor = 0.2;

  return (
    <Box
      sx={{
        height: `${cellSize}rem`,
        width: `${cellSize}rem`,
        borderTop: 1,
        borderBottom: Number(inLastRow),
        borderLeft: 1,
        borderRight: Number(inLastCol),
        borderColor: colors.grey[500],
        backgroundColor: isWinningCell ? colors.red[100] : null,
        cursor:
          isAvailablePosition || [Status.Start, Status.ManualBuild].includes(status)
            ? 'pointer'
            : 'default',
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Box
        sx={{
          display: isAvailablePosition ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <MoveBlockSelector
          size={availablePositionBoxScaleFactor * cellSize}
          show={isAvailablePosition}
          onClick={() => {
            setHovering(false);
            if (isAvailablePosition && blockToMove) {
              dispatch(moveBlockToPos({ pb: { ...blockToMove }, newPos: { row, col } }));
              dispatch(doMove({ pb: { ...blockToMove }, newPos: { row, col } }));
              dispatch(clearAvailablePositions());
              dispatch(clearBlockToMove());

              if (getBoardIsSolved(store.getState())) setStatus(Status.Done);
            }
          }}
        />
      </Box>

      <Box
        sx={{
          display: hovering ? 'flex' : 'none',
          flexWrap: 'wrap',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        {validBlocks.map((block) => (
          <AddBlockSelector
            key={`cell-${row}-${col}-${block.rows}x${block.cols}-add-block-selector`}
            show={hovering}
            block={block}
            onClick={() => {
              try {
                if (status !== Status.ManualBuild) setStatus(Status.ManualBuild);

                dispatch(addBlock({ block, pos: { row, col } }));
                setHovering(false);
              } catch {
                addAlert(
                  'Invalid block placement! Placed block overlaps another.',
                  Severity.Warning
                );
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Cell;

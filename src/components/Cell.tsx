import { FunctionComponent, useEffect, useState } from 'react';
import { Box, colors, useMediaQuery } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { Severity, Status, changeStatus, addAlert, removeAlert } from '../state/appSlice';
import {
  addBlock,
  moveBlockToPos,
  selectBoardIsSolved,
  selectBoardIsValid,
  selectNumCellsFilled,
  selectNumTwoByTwoBlocks,
} from '../state/boardSlice';
import { doMove, clearAvailablePositions, clearBlockToMove } from '../state/manualSolveSlice';
import { Board } from '../models/Board';
import { UIBlock } from '../models/global';
import { DESKTOP_CELL_SIZE, MOBILE_CELL_SIZE, MOBILE_CUTOFF } from '../constants';
import store, { RootState } from '../state/store';
import AddBlockSelector from './AddBlockSelector';
import MoveBlockSelector from './MoveBlockSelector';

interface Props {
  row: number;
  col: number;
}

const Cell: FunctionComponent<Props> = ({ row, col }) => {
  // State
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.app.status);
  const addNewAlert = (msg: string, severity: Severity) => {
    dispatch(addAlert({ alert: { msg, severity }}));
    setTimeout(() => {
      dispatch(removeAlert());
    }, 3000);
  }
  const availablePositions = useAppSelector((state) => state.manualSolve.availablePositions);
  const blockToMove = useAppSelector((state) => state.manualSolve.blockToMove); 
  const numCellsFilled = useAppSelector((state) => selectNumCellsFilled(state)); 
  const numTwoByTwoBlocks = useAppSelector((state) => selectNumTwoByTwoBlocks(state));
  const getBoardIsSolved = (state: RootState) => selectBoardIsSolved(state);
  const getBoardIsValid = (state: RootState) => selectBoardIsValid(state);
  const [isAvailablePosition, setIsAvailablePosition] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    setIsAvailablePosition(
      availablePositions.filter((pos) => pos.row === row && pos.col === col).length > 0
    );
  }, [col, row, availablePositions, setIsAvailablePosition]);

  // Helpers
  const inLastRow = row === Board.rows - 1;
  const inLastCol = col === Board.cols - 1;
  const isWinningCell =
    (row === Board.winningPos.row || row === Board.winningPos.row + 1) &&
    (col === Board.winningPos.col || col === Board.winningPos.col + 1);
  const maxCellsFilled = Board.cols * Board.rows - 2;
  const ONE_BY_ONE: UIBlock = { rows: 1, cols: 1 };
  const TWO_BY_ONE: UIBlock = { rows: 2, cols: 1 };
  const ONE_BY_TWO: UIBlock = { rows: 1, cols: 2 };
  const TWO_BY_TWO: UIBlock = { rows: 2, cols: 2 };

  // Valid Blocks
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

  // Handlers
  const onClickMoveBlockSelector = () => {
    setHovering(false);
    if (isAvailablePosition && blockToMove) {
      dispatch(moveBlockToPos({ pb: { ...blockToMove }, newPos: { row, col } }));
      dispatch(doMove({ pb: { ...blockToMove }, newPos: { row, col } }));
      dispatch(clearAvailablePositions());
      dispatch(clearBlockToMove());

      const state = store.getState()
      if (getBoardIsSolved(state)) {
        const moveIdx = state.manualSolve.moveIdx; 
        const numOptimalMoves = state.manualSolve.optimalMoves?.length;
        dispatch(changeStatus({ status:  moveIdx === numOptimalMoves 
          ? Status.DoneOptimal
          : Status.Done
        }));
      }
    }
  }
  const onClickAddBlockSelector = (block: UIBlock) => {
    try {
      if (status !== Status.ManualBuild) {
        dispatch(changeStatus({ status: Status.ManualBuild }));
      }

      dispatch(addBlock({ block, pos: { row, col } }));
      setHovering(false);
      
      if (getBoardIsValid(store.getState())) {
        dispatch(changeStatus({ status: Status.ReadyToSolve }));
      }
    } catch {
      addNewAlert('Invalid block placement! Placed block overlaps another.', Severity.Warning); 
    }
  }

  // Styling
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
  const cellSize = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
  const availablePositionBoxScaleFactor = 0.2;

  return (
    <Box
      sx={{
        height: `${cellSize}rem`,
        width: `${cellSize}rem`,
        borderTop: 1,
        borderRight: Number(inLastCol),
        borderBottom: Number(inLastRow),
        borderLeft: 1,
        borderColor: colors.grey[500],
        backgroundColor: isWinningCell ? colors.red[100] : null,
        cursor: isAvailablePosition || [Status.Start, Status.ManualBuild].includes(status)
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
          onClick={onClickMoveBlockSelector}
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
            onClick={() => onClickAddBlockSelector(block)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Cell;

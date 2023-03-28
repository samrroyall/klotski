import { FunctionComponent, useEffect, useState } from 'react';
import { Box, colors, useMediaQuery } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { Status, changeStatus } from '../state/appSlice';
import { addBlock, moveBlockToPos } from '../state/boardSlice';
import { doMove, clearAvailablePositions, clearBlockToMove } from '../state/manualSolveSlice';
import { Block, boardIsSolved, boardIsValid, getSizes } from '../models/global';
import { WINNING_COL, WINNING_ROW } from '../constants';
import store, { RootState } from '../state/store';
import MoveBlockSelector from './MoveBlockSelector';

interface Props {
  row: number;
  col: number;
}

const Cell: FunctionComponent<Props> = ({ row, col }) => {
  // State
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.app.status);
  const availablePositions = useAppSelector((state) => state.manualSolve.availablePositions);
  const blockToMove = useAppSelector((state) => state.manualSolve.blockToMove);
  const getBoardIsSolved = (state: RootState) => boardIsSolved(state.board);
  const getBoardIsValid = (state: RootState) => boardIsValid(state.board);
  const [isAvailablePosition, setIsAvailablePosition] = useState(false);

  // Helpers
  const isWinningCell =
    (row === WINNING_ROW || row === WINNING_ROW + 1) &&
    (col === WINNING_COL || col === WINNING_COL + 1);
  const ONE_BY_ONE: Block = { rows: 1, cols: 1 };

  useEffect(() => {
    setIsAvailablePosition(
      availablePositions.filter((pos) => pos.row === row && pos.col === col).length > 0
    );
  }, [col, row, availablePositions, setIsAvailablePosition]);

  // Handlers
  const onClickMoveBlockSelector = () => {
    if (isAvailablePosition && blockToMove) {
      dispatch(moveBlockToPos({ pb: { ...blockToMove }, newPos: { row, col } }));
      dispatch(doMove({ pb: { ...blockToMove }, newPos: { row, col } }));
      dispatch(clearAvailablePositions());
      dispatch(clearBlockToMove());

      const state = store.getState();
      if (getBoardIsSolved(state)) {
        const moveIdx = state.manualSolve.moveIdx;
        const numOptimalMoves = state.manualSolve.optimalMoves?.length;
        dispatch(changeStatus(moveIdx === numOptimalMoves ? Status.DoneOptimal : Status.Done));
      }
    }
  };

  const onClickCell = (e: any) => {
    if (![Status.Start, Status.ManualBuild].includes(status)) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      return;
    }
    if (status === Status.Start) {
      dispatch(changeStatus(Status.ManualBuild));
    }
    dispatch(addBlock({ block: ONE_BY_ONE, pos: { row, col } }));
    if (getBoardIsValid(store.getState())) {
      dispatch(changeStatus(Status.ReadyToSolve));
    }
  };

  // Styling
  const { borderSize, cellSize } = getSizes(useMediaQuery);
  const availablePositionBoxScaleFactor = 0.2;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: `calc(${row} * ${cellSize})`,
        left: `calc(${col} * ${cellSize})`,
        height: `calc(${cellSize})`,
        width: `calc(${cellSize})`,
        border: `${borderSize} solid black`,
        backgroundColor: isWinningCell ? colors.red[100] : colors.grey[100],
        '&:hover': {
          backgroundColor: [Status.Start, Status.ManualBuild].includes(status)
            ? isWinningCell
              ? colors.red[200]
              : colors.grey[200]
            : isWinningCell
            ? colors.red[100]
            : colors.grey[100],
        },
        cursor: [Status.Start, Status.ManualBuild].includes(status) ? 'pointer' : 'default',
        pointerEvents: [Status.Start, Status.ManualBuild].includes(status) ? 'auto' : 'none',
      }}
      onClick={onClickCell}
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
          size={availablePositionBoxScaleFactor * 10}
          show={isAvailablePosition}
          onClick={onClickMoveBlockSelector}
        />
      </Box>
    </Box>
  );
};

export default Cell;

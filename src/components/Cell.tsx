import { FunctionComponent, useEffect, useState } from 'react';
import { Box, colors, useTheme } from '@mui/material';
import MoveBlockSelector from './MoveBlockSelector';
import { WINNING_COL, WINNING_ROW } from '../constants';
import { addBlock, createEmptyBoard, selectBoardId, selectBoardStatus } from '../features/board';
import { useSelector } from 'react-redux';
import {
  moveBlock,
  selectAvailableMinPositions,
  selectCurrentBlock,
} from '../features/manualSolve';
import { Status } from '../models/ui';
import { RootState, useAppDispatch } from '../store';
import { selectCurrentBlockMinPosition } from '../features/manualSolve/selectors';
import { Block } from '../models/api/game';

const _ = require('lodash/fp');

interface Props {
  row: number;
  col: number;
}

const Cell: FunctionComponent<Props> = ({ row, col }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [isAvailablePosition, setIsAvailablePosition] = useState(false);

  const boardId = useSelector(selectBoardId);
  const boardStatus = useSelector(selectBoardStatus);
  const availableMinPositions = useSelector(selectAvailableMinPositions);
  const currentBlock = useSelector(selectCurrentBlock);
  const currentBlockPos = useSelector(selectCurrentBlockMinPosition);

  useEffect(() => {
    setIsAvailablePosition(
      availableMinPositions.filter((pos) => _.isEqual(pos, { row, col })).length > 0
    );
  }, [availableMinPositions, setIsAvailablePosition, row, col]);

  const associatedMove = useSelector((state: RootState) =>
    currentBlock && currentBlockPos
      ? state.board.nextMoves[currentBlock.idx].find(({ row_diff, col_diff }) =>
          _.isEqual(
            { row, col },
            { row: currentBlockPos.row + row_diff, col: currentBlockPos.col + col_diff }
          )
        ) || null
      : null
  );

  const isWinningCell =
    [WINNING_ROW, WINNING_ROW + 1].includes(row) && [WINNING_COL, WINNING_COL + 1].includes(col);

  const winningCellColor = theme.palette.mode === 'dark' ? colors.red[200] : colors.red[100];
  const winningCellHoverColor = theme.palette.mode === 'dark' ? colors.red[100] : colors.red[200];

  const cellColor = isWinningCell ? winningCellColor : theme.palette.action.hover;
  const cellHoverColor = [Status.Start, Status.Building].includes(boardStatus)
    ? isWinningCell
      ? winningCellHoverColor
      : theme.palette.action.selected
    : isWinningCell
    ? winningCellColor
    : theme.palette.action.hover;

  const cursor = [Status.Start, Status.Building].includes(boardStatus) ? 'pointer' : 'default';

  const pointerEvents = [Status.Start, Status.Building].includes(boardStatus) ? 'auto' : 'none';

  const availablePositionBoxScaleFactor = 0.2;

  const onClickMoveBlockSelector = () => {
    if (currentBlock && associatedMove) {
      dispatch(moveBlock({ block_idx: currentBlock.idx, ...associatedMove }));
    }
  };

  const onClickCell = (e: any) => {
    if (![Status.Start, Status.Building].includes(boardStatus)) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      return;
    }

    if (boardStatus === Status.Start) {
      dispatch(createEmptyBoard()).then(() => {
        dispatch(addBlock({ block: Block.OneByOne, cell: { row, col } }));
      });
    } else if (boardId) {
      dispatch(addBlock({ block: Block.OneByOne, cell: { row, col } }));
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        backgroundColor: cellColor,
        '&:hover': {
          backgroundColor: cellHoverColor,
        },
        cursor,
        pointerEvents,
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

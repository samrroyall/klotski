import { FunctionComponent, useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import store from '../../state/store';
import MoveBlockSelector from '../MoveBlockSelector';
import { ApiService } from '../../services/api';
import {
  AddBlock as AddBlockRequest,
  MoveBlock as MoveBlockRequest,
} from '../../models/api/request';
import { Helpers } from './helpers';
import { Status, updateBoard, updateStatus } from '../../state/boardSlice';
import { Styles } from './styles';

interface Props {
  row: number;
  col: number;
}

const Cell: FunctionComponent<Props> = ({ row, col }) => {
  const theme = useTheme();
  const [isAvailablePosition, setIsAvailablePosition] = useState(false);

  const Api = new ApiService();

  const dispatch = useAppDispatch();

  const boardId = useAppSelector((state) => state.board.id);

  const isAvailableMinPosition = Helpers.getIsAvailableMinPosition(store.getState(), row, col);

  const currentBlock = useAppSelector((state) => state.manualSolve.currentBlock);

  useEffect(() => {
    setIsAvailablePosition(isAvailableMinPosition);
  }, [isAvailableMinPosition, setIsAvailablePosition]);

  const onClickMoveBlockSelector = async () => {
    if (isAvailablePosition && boardId && currentBlock) {
      const move = Helpers.getAssociatedMove(store.getState(), currentBlock, row, col);

      if (move) {
        const body: MoveBlockRequest = { type: 'move_block', move };
        const response = await Api.moveBlock(boardId, currentBlock.idx, body);

        if (response) {
          dispatch(updateBoard(response));
        }
      }

      if (Helpers.getBoardIsSolved(store.getState())) {
        const movesFromOptimal = Helpers.getMovesOverOptimal(store.getState());
        dispatch(updateStatus(movesFromOptimal === 0 ? Status.SolvedOptimally : Status.Solved));
      }
    }
  };

  const onClickCell = async (e: any) => {
    const status = Helpers.getStatus(store.getState());

    if (![Status.Start, Status.Building].includes(status)) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      return;
    }

    if (boardId) {
      const body: AddBlockRequest = { block_id: 1, min_row: row, min_col: col };
      const response = await Api.addBlock(boardId, body);

      if (response) {
        dispatch(updateBoard(response));
      }
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        backgroundColor: Styles.getCellColor(theme, row, col),
        '&:hover': {
          backgroundColor: Styles.getCellHoverColor(store.getState(), theme, row, col),
        },
        cursor: Styles.getCursor(store.getState()),
        pointerEvents: Styles.getPointerEvents(store.getState()),
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
          size={Styles.availablePositionBoxScaleFactor * 10}
          show={isAvailablePosition}
          onClick={onClickMoveBlockSelector}
        />
      </Box>
    </Box>
  );
};

export default Cell;

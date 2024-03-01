import { FunctionComponent, useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import store from '../../state/store';
import MoveBlockSelector from '../MoveBlockSelector';
import { ApiService } from '../../services/api';
import { Helpers } from './helpers';
import { Status, update as updateBoard, updateStatus } from '../../state/boardSlice';
import { Styles } from './styles';
import { updateMoves } from '../../state/manualSolveSlice';
import { Block } from '../../models/api/game';

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
  const boardStatus = useAppSelector((state) => state.board.status);

  const availableMinPositions = useAppSelector((state) => state.manualSolve.availableMinPositions);
  const currentBlock = useAppSelector((state) => state.manualSolve.currentBlock);
  const moves = useAppSelector((state) => state.manualSolve.moves);

  useEffect(() => {
    setIsAvailablePosition(
      availableMinPositions.filter((pos) => pos.row === row && pos.col === col).length > 0
    );
  }, [availableMinPositions, setIsAvailablePosition, col, row]);

  const onClickMoveBlockSelector = () => {
    if (isAvailablePosition && boardId && currentBlock) {
      const move = Helpers.getAssociatedMove(store.getState(), currentBlock, row, col);

      if (move) {
        Api.moveBlock(boardId, currentBlock.idx, move.row_diff, move.col_diff).then((response) => {
          if (response) {
            dispatch(updateBoard(response));
            dispatch(updateMoves([...moves, { block_idx: currentBlock.idx, ...move }]));

            if (Helpers.getBoardIsSolved(store.getState())) {
              const movesFromOptimal = Helpers.getMovesOverOptimal(store.getState());
              dispatch(
                updateStatus(movesFromOptimal === 0 ? Status.SolvedOptimally : Status.Solved)
              );
            }
          }
        });
      }
    }
  };

  const addBlock = (boardId: number) =>
    Api.addBlock(boardId, Block.OneByOne, row, col).then((response) => {
      if (response) {
        dispatch(updateBoard(response));
      }
    });

  const onClickCell = async (e: any) => {
    if (![Status.Start, Status.Building].includes(boardStatus)) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      return;
    }

    if (boardStatus === Status.Start) {
      Api.emptyBoard().then((response) => {
        if (response && response.id) {
          addBlock(response.id);
        }
      });
    } else if (boardId) {
      addBlock(boardId);
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

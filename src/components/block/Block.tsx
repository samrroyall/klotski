import { FunctionComponent, useContext, useState } from 'react';
import { Paper, colors, Box, useTheme } from '@mui/material';
import { Close, Loop } from '@mui/icons-material';
import store from '../../state/store';
import { BoardBlock } from '../../models/api/game';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { ApiService } from '../../services/api';
import { Status, update as updateBoard } from '../../state/boardSlice';
import { setAvailableMinPositions, setCurrentBlock } from '../../state/manualSolveSlice';
import { Helpers } from './helpers';
import { SizeContext } from '../../App';
import { Styles } from './styles';

interface Props {
  boardBlock: BoardBlock;
}

const UIBlock: FunctionComponent<Props> = ({ boardBlock }) => {
  const {
    idx: blockIdx,
    min_position: { row: blockMinRow, col: blockMinCol },
    rows: blockRows,
    cols: blockCols,
  } = boardBlock;

  const theme = useTheme();
  const [isMovable, setIsMovable] = useState(false);

  const { isMobile, borderSize, cellSize } = useContext(SizeContext);

  const Api = new ApiService();
  const dispatch = useAppDispatch();

  const boardStatus = useAppSelector((state) => state.board.status);
  const boardId = useAppSelector((state) => state.board.id);
  const blockKey = Helpers.getBlockKey(boardBlock);
  const blockMoves = useAppSelector((state) => {
    const moves = state.board.nextMoves;
    return blockIdx < moves.length ? moves[blockIdx] : [];
  });
  const availableMinPositionsForBlock = useAppSelector((state) => {
    const moves = state.board.nextMoves;
    return blockIdx < moves.length
      ? moves[blockIdx].map(({ row_diff, col_diff }) => ({
          row: blockMinRow + row_diff,
          col: blockMinCol + col_diff,
        }))
      : [];
  });

  const xPos = Styles.getXPos(blockMinCol, borderSize, cellSize);
  const yPos = Styles.getYPos(blockMinRow, borderSize, cellSize);

  const height = Styles.getHeight(blockRows, borderSize, cellSize);
  const width = Styles.getWidth(blockCols, borderSize, cellSize);

  const scaledXPos = Styles.getScaledXPos(xPos, width);
  const scaledYPos = Styles.getScaledXPos(yPos, width);

  const scaledHeight = Styles.getScaledHeight(height);
  const scaledWidth = Styles.getScaledHeight(width);

  const closeButtonSize = Styles.getCloseButtonSize(isMobile);
  const cycleButtonSize = Styles.getCycleButtonSize(isMobile);

  const blockButtonStyle = Styles.getBlockButtonStyle(theme);

  const onClickCloseButton = async () => {
    if (boardId) {
      const response = await Api.removeBlock(boardId, blockIdx);

      if (response) {
        dispatch(updateBoard(response));
      }
    }
  };

  const onClickCycleButton = async () => {
    const nextBlock = Helpers.getNextChangeBlock(store.getState(), boardBlock);

    if (boardId && nextBlock) {
      const response = await Api.changeBlock(boardId, blockIdx, nextBlock);

      if (response) {
        dispatch(updateBoard(response));
      }
    }
  };

  return (
    <Paper
      elevation={isMovable ? 12 : 0}
      variant={isMovable ? 'elevation' : 'outlined'}
      square
      sx={{
        position: 'absolute',
        top: `calc(${isMovable ? scaledYPos : yPos})`,
        left: `calc(${isMovable ? scaledXPos : xPos})`,
        height: `calc(${isMovable ? scaledHeight : height})`,
        width: `calc(${isMovable ? scaledWidth : width})`,
        padding: `0.5rem`,
        border: isMovable ? `${borderSize} solid` : 0,
        borderColor: theme.palette.text.primary,
        backgroundColor: Styles.blockColors(boardBlock.block)[
          theme.palette.mode === 'dark' ? 400 : 600
        ],
        cursor: isMovable ? 'pointer' : 'default',
        zIndex: isMovable ? 3 : 2,
      }}
      onMouseEnter={() => {
        if (boardStatus === Status.ManualSolving) {
          setIsMovable(blockMoves.length > 0);
        }
      }}
      onMouseLeave={() => setIsMovable(false)}
      onClick={() => {
        if (boardStatus === Status.ManualSolving) {
          setIsMovable(blockMoves.length > 0);
          dispatch(setCurrentBlock(boardBlock));
          dispatch(setAvailableMinPositions(availableMinPositionsForBlock));
        }
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: [Status.Building, Status.ReadyToSolve].includes(boardStatus) ? 'block' : 'none',
          justifyContent: 'end',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            height: `${closeButtonSize}rem`,
            justifyContent: 'right',
          }}
        >
          <Close
            sx={{
              ...blockButtonStyle,
              fontSize: `${closeButtonSize}rem`,
              '&:hover': {
                color: theme.palette.mode === 'dark' ? colors.grey[900] : 'black',
              },
            }}
            key={`${blockKey}-close-button`}
            onClick={onClickCloseButton}
          />
        </Box>
        <Box
          sx={{
            marginTop: `-${closeButtonSize}rem`,
            height: `calc(${height} - ${closeButtonSize}rem)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Loop
            sx={{
              ...blockButtonStyle,
              fontSize: `${cycleButtonSize}rem`,
              '&:hover': {
                fontSize: `${isMobile ? cycleButtonSize : cycleButtonSize + 1}rem`,
                color: theme.palette.mode === 'dark' ? colors.grey[900] : 'black',
              },
            }}
            key={`${blockKey}-cycle-button`}
            onClick={onClickCycleButton}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default UIBlock;

import { FunctionComponent, useContext, useState } from 'react';
import { Paper, colors, Box, useTheme } from '@mui/material';
import { Close, Loop } from '@mui/icons-material';
import store from '../../state/store';
import { BlockWithDimensions } from '../../models/api/game';
import { useAppDispatch } from '../../state/hooks';
import { ApiService } from '../../services/api';
import { ChangeBlock as ChangeBlockRequest } from '../../models/api/request';
import { Status, updateBoard } from '../../state/boardSlice';
import { setAvailableMinPositions, setCurrentBlock } from '../../state/manualSolveSlice';
import { Helpers } from './Helpers';
import { SizeContext } from '../../App';
import { Styles } from './styles';

interface Props {
  block: BlockWithDimensions;
  idx: number;
}

const UIBlock: FunctionComponent<Props> = ({ block, idx }) => {
  const theme = useTheme();
  const [isMovable, setIsMovable] = useState(false);

  const { isMobile, borderSize, cellSize } = useContext(SizeContext);

  const Api = new ApiService();
  const dispatch = useAppDispatch();

  const blockKey = Helpers.getBlockKey(block);

  const xPos = Styles.getXPos(block.min_position.col, borderSize, cellSize);
  const yPos = Styles.getYPos(block.min_position.row, borderSize, cellSize);

  const height = Styles.getHeight(block.rows, borderSize, cellSize);
  const width = Styles.getWidth(block.cols, borderSize, cellSize);

  const scaledXPos = Styles.getScaledXPos(xPos, width);
  const scaledYPos = Styles.getScaledXPos(yPos, width);

  const scaledHeight = Styles.getScaledHeight(height);
  const scaledWidth = Styles.getScaledHeight(width);

  const closeButtonSize = Styles.getCloseButtonSize(isMobile);
  const cycleButtonSize = Styles.getCycleButtonSize(isMobile);

  const blockButtonStyle = Styles.getBlockButtonStyle(theme.palette.mode);

  const status = Helpers.getStatus(store.getState());
  const availablePositions = Helpers.getAvailablePositions(store.getState(), block, idx);

  const onClickCloseButton = async () => {
    const boardId = Helpers.getBoardId(store.getState());

    if (boardId) {
      const response = await Api.removeBlock(boardId, idx);

      if (response) {
        dispatch(updateBoard(response));
      }
    }
  };

  const onClickCycleButton = async () => {
    const state = store.getState();

    const boardId = Helpers.getBoardId(state);
    const nextBlockId = Helpers.getNextChangeBlockId(state, block);

    if (boardId && nextBlockId) {
      const request: ChangeBlockRequest = { type: 'change_block', new_block_id: nextBlockId };
      const result = await Api.changeBlock(boardId, idx, request);

      if (result) {
        dispatch(updateBoard(result));
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
        backgroundColor:
          Styles.blockColors[block.block_id - 1][theme.palette.mode === 'dark' ? 400 : 600],
        cursor: isMovable ? 'pointer' : 'default',
        zIndex: isMovable ? 3 : 2,
      }}
      onMouseEnter={() => {
        if (status === Status.ManualSolving) {
          setIsMovable(availablePositions.length > 0);
        }
      }}
      onMouseLeave={() => setIsMovable(false)}
      onClick={() => {
        if (status === Status.ManualSolving) {
          setIsMovable(availablePositions.length > 0);
          dispatch(setCurrentBlock(block));
          dispatch(setAvailableMinPositions(availablePositions));
        }
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: [Status.Building, Status.ReadyToSolve].includes(status) ? 'block' : 'none',
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

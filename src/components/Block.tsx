import { FunctionComponent, useState } from 'react';
import { Paper, colors, useMediaQuery, Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { changeStatus, Status } from '../state/appSlice';
import { setBlockToMove, setAvailablePositions } from '../state/manualSolveSlice';
import { availablePositionsForBlock, boardIsValid, blockToInt, Block as _Block, Pos } from '../models/global';
import { DESKTOP_CELL_SIZE, MOBILE_CELL_SIZE, MOBILE_CUTOFF } from '../constants';
import { removeBlock } from '../state/boardSlice';
import store, { RootState } from '../state/store';

interface Props {
  block: _Block,
  pos: Pos,
}

const Block: FunctionComponent<Props> = ({block, pos}) => {
  // State
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.app.status );
  const availablePositions = useAppSelector((state) => availablePositionsForBlock(state.board, {block, pos}));
  const boardValid = useAppSelector((state) => boardIsValid(state.board));
  const getBoardIsValid = (state: RootState) => boardIsValid(state.board);
  const [isMovable, setIsMovable] = useState(false);

  // Styling
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
  const cellSize = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
  const blockColor = [colors.yellow, colors.blue, colors.green, colors.red];
  const [{rows, cols}, {row, col}] = [block, pos];
  const [yPos, xPos] = [row*cellSize, col*cellSize];
  const [height, width] = [rows*cellSize, cols*cellSize]
  const scalingFactor = 0.1;

  return (
    <Paper
      elevation={isMovable ? 12 : 0}
      variant={isMovable ? 'elevation' : 'outlined'}
      square
      sx={{
        position: 'absolute',
        top: `${isMovable ? yPos - (0.5*height*scalingFactor) : yPos}rem`,
        left: `${isMovable ? xPos - (0.5*width*scalingFactor) : xPos}rem`,
        height: `${isMovable ? height*(scalingFactor + 1) : height}rem`,
        width: `${isMovable ? width*(scalingFactor + 1) : width}rem`,
        padding: `0.5rem`,
        backgroundColor: blockColor[blockToInt(block)-1][600],
        cursor: isMovable ? 'pointer' : 'default',
        zIndex: isMovable ? 3 : 2,
      }}
      onMouseEnter={() => {
        if (!(status === Status.ManualSolve && boardValid)) {
          return;
        }
        setIsMovable(availablePositions.length > 0);
      }}
      onMouseLeave={() => { 
        if (isMovable) {
          setIsMovable(false); 
        }
      }}
      onClick={() => {
        if (!(status === Status.ManualSolve && boardValid)) {
          return;
        }
        dispatch(setBlockToMove({block, pos}));
        dispatch(setAvailablePositions(availablePositions));
      }}
    >
      <Box sx={{ 
        width: '100%', 
        display: [Status.ManualBuild, Status.ReadyToSolve].includes(status) ? 'flex' : 'none', 
        justifyContent: 'end',
      }}>
        <Close sx={{ 
            cursor: 'pointer',
            color: colors.grey[700],
            '&:hover': {
              color: colors.grey[900],
            }
          }} 
          onClick={() => { 
            dispatch(removeBlock({block, pos}));
            const boardIsValid = getBoardIsValid(store.getState());
            if (status === Status.ReadyToSolve && !boardIsValid) {
              dispatch(changeStatus(Status.ManualBuild));
            }
          }}
        />
      </Box>
    </Paper>
  );
};

export default Block;

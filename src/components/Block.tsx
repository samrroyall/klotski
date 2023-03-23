import { FunctionComponent, useState } from 'react';
import { Paper, colors, useMediaQuery, Box } from '@mui/material';
import { Close, Loop } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { changeStatus, Status } from '../state/appSlice';
import { setBlockToMove, setAvailablePositions } from '../state/manualSolveSlice';
import { 
  availablePositionsForBlock, 
  boardIsValid, 
  blockToInt, 
  Block as _Block, Pos,
  numCellsFilled as getNumCellsFilled,
  numTwoByTwoBlocks as getNumTwoByTwoBlocks,
  cellIsFree,
} from '../models/global';
import { 
  DESKTOP_CELL_SIZE, 
  MOBILE_CELL_SIZE, 
  MOBILE_CUTOFF,
  NUM_COLS, 
  NUM_ROWS, 
} from '../constants';
import { addBlock, removeBlock } from '../state/boardSlice';
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
  const getBoardIsValid = (state: RootState) => boardIsValid(state.board); 
  const [isMovable, setIsMovable] = useState(false);
  const getRightCellIsFree = (state: RootState) => cellIsFree(state.board.grid, pos.row, pos.col+1);
  const getBelowCellIsFree = (state: RootState) => cellIsFree(state.board.grid, pos.row+1, pos.col);
  const getBelowRightCellIsFree = (state: RootState) => cellIsFree(state.board.grid, pos.row+1, pos.col+1);

  // Helpers
  const inLastRow = pos.row === NUM_ROWS-1;
  const inLastCol = pos.col === NUM_COLS-1;
  const maxCellsFilled = NUM_COLS*NUM_ROWS - 2;
  const ONE_BY_ONE: _Block = { rows: 1, cols: 1 };
  const TWO_BY_ONE: _Block = { rows: 2, cols: 1 };
  const ONE_BY_TWO: _Block = { rows: 1, cols: 2 };
  const TWO_BY_TWO: _Block = { rows: 2, cols: 2 };

  const getValidBlocks = (): _Block[] => {
    const state = store.getState();
    const numCellsFilled = getNumCellsFilled(state.board);
    const numTwoByTwoBlocks = getNumTwoByTwoBlocks(state.board);
    const rightCellIsFree = getRightCellIsFree(state);
    const belowCellIsFree = getBelowCellIsFree(state);
    const belowRightCellIsFree = getBelowRightCellIsFree(state);

    const validBlocks: _Block[] = [];
    if (numCellsFilled < maxCellsFilled) {
      validBlocks.push(ONE_BY_ONE);
    }
    if (numCellsFilled < maxCellsFilled - 1) {
      if (rightCellIsFree) {
        validBlocks.push(ONE_BY_TWO);
      }
      if (belowCellIsFree) {
        validBlocks.push(TWO_BY_ONE);
      }
    }
    if (numCellsFilled < maxCellsFilled - 3 &&
      numTwoByTwoBlocks === 0 && 
      !inLastRow &&
      !inLastCol &&
      rightCellIsFree &&
      belowCellIsFree &&
      belowRightCellIsFree
    ) {
      validBlocks.push(TWO_BY_TWO);
    }
    return validBlocks;
  }

  // Handlers
  const onClickCloseButton = () => { 
    dispatch(removeBlock({block, pos}));
    const state = store.getState()
    const boardIsValid = getBoardIsValid(state);
    if (status === Status.ReadyToSolve && !boardIsValid) {
      dispatch(changeStatus(Status.ManualBuild));
    }
    const numCellsFilled = getNumCellsFilled(state.board);
    if (status === Status.ManualBuild && numCellsFilled === 0) {
      dispatch(changeStatus(Status.Start));
    }
  }; 

  const onClickCycleButton = () => { 
    dispatch(removeBlock({block, pos}));
    const validBlocks = getValidBlocks();
    const currBlockIdx = validBlocks.findIndex((b) => b.rows === block.rows && b.cols === block.cols);
    dispatch(addBlock({block: validBlocks[(currBlockIdx + 1) % validBlocks.length], pos}));
    if (getBoardIsValid(store.getState())) {
      dispatch(changeStatus(Status.ReadyToSolve));
    }
  };

  // Styling
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
  const cellSize = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
  const blockColor = [colors.yellow, colors.blue, colors.green, colors.red];
  const [{rows, cols}, {row, col}] = [block, pos];
  const [yPos, xPos] = [row*cellSize, col*cellSize];
  const [height, width] = [rows*cellSize, cols*cellSize]
  const scalingFactor = 0.1;
  const blockButtonStyle = {
    display: 'block',
    cursor: 'pointer',
    color:  colors.grey[900],
    '&:hover': {
      color: 'black',
    }
  };

  return (
    <Paper
      elevation={isMovable ? 12 : 0}
      variant={isMovable ? 'elevation' : 'outlined'}
      square
      sx={{
        position: 'absolute',
        top: `calc(${isMovable ? yPos - (0.5*height*scalingFactor) : yPos}rem - ${pos.row}px)`,
        left: `calc(${isMovable ? xPos - (0.5*width*scalingFactor) : xPos}rem - ${pos.col}px)`,
        height: `calc(${isMovable ? height*(scalingFactor + 1) : height}rem - ${block.rows - 1}px)`,
        width: `calc(${isMovable ? width*(scalingFactor + 1) : width}rem - ${block.cols - 1}px)`,
        padding: `0.5rem`,
        backgroundColor: blockColor[blockToInt(block)-1][600],
        border: 1,
        borderColor: 'black',
        cursor: isMovable ? 'pointer' : 'default',
        zIndex: isMovable ? 3 : 2,
      }}
      onMouseEnter={() => {
        if (status === Status.ManualSolve && getBoardIsValid(store.getState())) {
          setIsMovable(availablePositions.length > 0);
        }
      }}
      onMouseLeave={() => { 
        if (isMovable) {
          setIsMovable(false); 
        }
      }}
      onClick={() => {
        if (status === Status.ManualSolve && getBoardIsValid(store.getState())) {
          dispatch(setBlockToMove({block, pos}));
          dispatch(setAvailablePositions(availablePositions));
        }
      }}
    >
      <Box sx={{ 
        width: '100%', 
        display: [Status.ManualBuild, Status.ReadyToSolve].includes(status) ? 'block' : 'none', 
        justifyContent: 'end',
      }}>
        <Close sx={{
            ...blockButtonStyle,
            marginLeft: 'auto',
            fontSize: '1rem',
          }}
          onClick={onClickCloseButton}
        />
        <Box sx={{ 
          marginTop: '-1rem',
          height: `${height-1}rem`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          }}>
          <Loop sx={{
              ...blockButtonStyle,
              fontSize: '2rem',
            }}
            onClick={onClickCycleButton}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default Block;

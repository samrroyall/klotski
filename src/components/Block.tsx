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
  Block as _Block,
  Pos,
  numCellsFilled as getNumCellsFilled,
  numTwoByTwoBlocks as getNumTwoByTwoBlocks,
  cellIsFree,
  getSizes,
} from '../models/global';
import { NUM_COLS, NUM_ROWS } from '../constants';
import { addBlock, removeBlock } from '../state/boardSlice';
import store, { RootState } from '../state/store';

interface Props {
  block: _Block;
  pos: Pos;
}

const Block: FunctionComponent<Props> = ({ block, pos }) => {
  // State
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.app.status);
  const availablePositions = useAppSelector((state) =>
    availablePositionsForBlock(state.board, { block, pos })
  );
  const getBoardIsValid = (state: RootState) => boardIsValid(state.board);
  const [isMovable, setIsMovable] = useState(false);
  const getRightCellIsFree = (state: RootState) =>
    cellIsFree(state.board.grid, pos.row, pos.col + 1);
  const getBelowCellIsFree = (state: RootState) =>
    cellIsFree(state.board.grid, pos.row + 1, pos.col);
  const getBelowRightCellIsFree = (state: RootState) =>
    cellIsFree(state.board.grid, pos.row + 1, pos.col + 1);

  // Helpers
  const inLastRow = pos.row === NUM_ROWS - 1;
  const inLastCol = pos.col === NUM_COLS - 1;
  const maxCellsFilled = NUM_COLS * NUM_ROWS - 2;
  const ONE_BY_ONE: _Block = { rows: 1, cols: 1 };
  const TWO_BY_ONE: _Block = { rows: 2, cols: 1 };
  const ONE_BY_TWO: _Block = { rows: 1, cols: 2 };
  const TWO_BY_TWO: _Block = { rows: 2, cols: 2 };

  const getValidBlocks = (): _Block[] => {
    const state = store.getState();
    const numCellsFilled = getNumCellsFilled(state.board);
    const numTwoByTwoBlocks = getNumTwoByTwoBlocks(state.board);

    const validBlocks: _Block[] = [];
    if (numCellsFilled < maxCellsFilled) {
      validBlocks.push(ONE_BY_ONE);
    }
    if (numCellsFilled < maxCellsFilled - 1) {
      if (!inLastCol && getRightCellIsFree(state)) {
        validBlocks.push(ONE_BY_TWO);
      }
      if (!inLastRow && getBelowCellIsFree(state)) {
        validBlocks.push(TWO_BY_ONE);
      }
    }
    if (
      numCellsFilled < maxCellsFilled - 3 &&
      numTwoByTwoBlocks === 0 &&
      !inLastRow &&
      !inLastCol &&
      getRightCellIsFree(state) &&
      getBelowCellIsFree(state) &&
      getBelowRightCellIsFree(state)
    ) {
      validBlocks.push(TWO_BY_TWO);
    }
    return validBlocks;
  };

  // Handlers
  const onClickCloseButton = () => {
    dispatch(removeBlock({ block, pos }));
    const state = store.getState();
    const boardIsValid = getBoardIsValid(state);
    const numCellsFilled = getNumCellsFilled(state.board);
    if (status === Status.ReadyToSolve && !boardIsValid) {
      dispatch(changeStatus(Status.ManualBuild));
    } else if (status === Status.ManualBuild && numCellsFilled === 0) {
      dispatch(changeStatus(Status.Start));
    }
  };

  const onClickCycleButton = () => {
    dispatch(removeBlock({ block, pos }));
    const validBlocks = getValidBlocks();
    const currBlockIdx = validBlocks.findIndex(
      (b) => b.rows === block.rows && b.cols === block.cols
    );
    dispatch(addBlock({ block: validBlocks[(currBlockIdx + 1) % validBlocks.length], pos }));
    const state = store.getState();
    const boardIsValid = getBoardIsValid(state);
    if (status === Status.ReadyToSolve && !boardIsValid) {
      dispatch(changeStatus(Status.ManualBuild));
    }
    if (status === Status.ManualBuild && boardIsValid) {
      dispatch(changeStatus(Status.ReadyToSolve));
    }
  };

  // Styling
  const { isMobile, borderSize, cellSize } = getSizes(useMediaQuery);
  const blockColor = [colors.yellow, colors.blue, colors.green, colors.red];
  const [{ rows, cols }, { row, col }] = [block, pos];
  const [yPos, xPos] = [`${row} * ${cellSize}`, `${col} * ${cellSize}`];
  const [height, width] = [`${rows} * ${cellSize}`, `${cols} * ${cellSize}`];
  const scalingFactor = 0.1;
  const blockButtonStyle = {
    display: 'block',
    cursor: 'pointer',
    color: colors.grey[900],
    '&:hover': {
      color: 'black',
    },
  };
  const closeButtonSize = isMobile ? 1 : 1.5;
  const cycleButtonSize = isMobile ? 2 : 2.5;

  return (
    <Paper
      elevation={isMovable ? 12 : 0}
      variant={isMovable ? 'elevation' : 'outlined'}
      square
      sx={{
        position: 'absolute',
        top: `calc(${
          isMovable ? `${yPos} - 0.5 * ${height} * ${scalingFactor}` : yPos
        } + ${borderSize})`,
        left: `calc(${
          isMovable ? `${xPos} - 0.5 * ${width} * ${scalingFactor}` : xPos
        } + ${borderSize})`,
        height: `calc(${isMovable ? `${height} * (${scalingFactor} + 1)` : height})`,
        width: `calc(${isMovable ? `${width} * (${scalingFactor} + 1)` : width})`,
        padding: `0.5rem`,
        backgroundColor: blockColor[blockToInt(block) - 1][600],
        border: `${borderSize} solid black`,
        cursor: isMovable ? 'pointer' : 'default',
        zIndex: isMovable ? 3 : 2,
      }}
      onMouseEnter={() => {
        if (status === Status.ManualSolve && getBoardIsValid(store.getState())) {
          setIsMovable(availablePositions.length > 0);
        }
      }}
      onMouseLeave={() => setIsMovable(false)}
      onClick={() => {
        if (status === Status.ManualSolve && getBoardIsValid(store.getState())) {
          setIsMovable(availablePositions.length > 0);
          dispatch(setBlockToMove({ block, pos }));
          dispatch(setAvailablePositions(availablePositions));
        }
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: [Status.ManualBuild, Status.ReadyToSolve].includes(status) ? 'block' : 'none',
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
            }}
            key={`${block.rows}x${block.cols}@(${pos.row},${pos.col})-close-button`}
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
              },
            }}
            key={`${block.rows}x${block.cols}@(${pos.row},${pos.col})-cycle-button`}
            onClick={onClickCycleButton}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default Block;

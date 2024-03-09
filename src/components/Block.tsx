import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Paper, colors, Box, useTheme } from '@mui/material';
import { Close, Loop } from '@mui/icons-material';
import { Block as Block_, BoardBlock, Position } from '../models/api/game';
import { SizeContext } from '../App';
import { changeBlock, removeBlock, selectBoardStatus } from '../features/board';
import { selectGrid, selectNextMoves } from '../features/board/selectors';
import { setCurrentBlock, setAvailableMinPositions } from '../features/manualSolve';
import { Status } from '../models/ui';
import { BLOCK_COLOR, NUM_COLS, NUM_ROWS } from '../constants';
import { RootState, useAppDispatch, useAppSelector } from '../store';

interface ChangeBlock {
  newBlock: Block_;
  minPosition: Position;
}

const getNextChangeBlock = (block: BoardBlock, grid: (Block_ | null)[]): ChangeBlock | null => {
  const numTwoByTwoBlocks = grid.filter((cell) => cell === Block_.TwoByTwo).length / 4;

  const numCellsFilled = grid.filter((cell) => cell !== null).length;
  const cellsFree = NUM_COLS * NUM_ROWS - 2 - (numCellsFilled - block.rows * block.cols);

  const inLastRow = block.min_position.row >= NUM_ROWS - 1;
  const inLastCol = block.min_position.col >= NUM_COLS - 1;

  const blocks = [Block_.OneByOne, Block_.OneByTwo, Block_.TwoByOne, Block_.TwoByTwo];
  const blockIdx = blocks.indexOf(block.block);

  const isCellFilled = (i: number, j: number) => grid[i * NUM_COLS + j];

  const leftCellIsFree = () =>
    block.min_position.col > 0 && !isCellFilled(block.min_position.row, block.min_position.col - 1);

  const rightCellIsFree = () =>
    block.cols > 1 ||
    (!inLastCol && !isCellFilled(block.min_position.row, block.min_position.col + 1));

  const upCellIsFree = () =>
    block.min_position.row > 0 && !isCellFilled(block.min_position.row - 1, block.min_position.col);

  const downCellIsFree = () =>
    block.rows > 1 ||
    (!inLastRow && !isCellFilled(block.min_position.row + 1, block.min_position.col));

  for (let i = 0; i < 3; i++) {
    switch (blocks[(blockIdx + i + 1) % 4]) {
      case Block_.OneByOne:
        if (cellsFree >= 1) {
          return { newBlock: Block_.OneByOne, minPosition: block.min_position };
        }
        break;
      case Block_.OneByTwo:
        if (cellsFree >= 2) {
          if (rightCellIsFree()) {
            return { newBlock: Block_.OneByTwo, minPosition: block.min_position };
          }
          if (leftCellIsFree()) {
            return {
              newBlock: Block_.OneByTwo,
              minPosition: { row: block.min_position.row, col: block.min_position.col - 1 },
            };
          }
        }
        break;
      case Block_.TwoByOne:
        if (cellsFree >= 2) {
          if (downCellIsFree()) {
            return { newBlock: Block_.TwoByOne, minPosition: block.min_position };
          }
          if (upCellIsFree()) {
            return {
              newBlock: Block_.TwoByOne,
              minPosition: { row: block.min_position.row - 1, col: block.min_position.col },
            };
          }
        }
        break;
      case Block_.TwoByTwo:
        if (numTwoByTwoBlocks === 0 && cellsFree >= 4) {
          if (
            rightCellIsFree() &&
            downCellIsFree() &&
            !isCellFilled(block.min_position.row + 1, block.min_position.col + 1)
          ) {
            return { newBlock: Block_.TwoByTwo, minPosition: block.min_position };
          }
          if (
            leftCellIsFree() &&
            upCellIsFree() &&
            !isCellFilled(block.min_position.row - 1, block.min_position.col - 1)
          ) {
            return {
              newBlock: Block_.TwoByTwo,
              minPosition: { row: block.min_position.row - 1, col: block.min_position.col - 1 },
            };
          }
        }
        break;
    }
  }

  return null;
};

interface Props {
  block: BoardBlock;
}

const Block: FunctionComponent<Props> = ({ block }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [isMovable, setIsMovable] = useState(false);
  const [nextChangeBlock, setNextChangeBlock] = useState<ChangeBlock | null>(null);

  const boardStatus = useAppSelector(selectBoardStatus);
  const grid = useAppSelector(selectGrid);
  const nextMoves = useAppSelector(selectNextMoves);

  const minPositionsForBlock = useAppSelector(
    (state: RootState): Position[] =>
      state.board.nextMoves[block.idx]?.map(({ row_diff, col_diff }) => ({
        row: block.min_position.row + row_diff,
        col: block.min_position.col + col_diff,
      })) || []
  );

  useEffect(() => {
    setNextChangeBlock(getNextChangeBlock(block, grid));
  }, [block, grid]);

  const onClickBlock = () => {
    if (boardStatus !== Status.ManualSolving) {
      return;
    }

    setIsMovable(nextMoves[block.idx].length > 0);
    dispatch(setCurrentBlock(block));
    dispatch(setAvailableMinPositions(minPositionsForBlock));
  };

  const onClickCloseButton = () => {
    dispatch(removeBlock(block));
  };

  const onClickCycleButton = () => {
    if (nextChangeBlock) {
      dispatch(changeBlock({ idx: block.idx, ...nextChangeBlock }));
    }
  };

  const blockKey = `${block.rows}x${block.cols}-block@(${block.min_position.row},${block.min_position.col})`;

  const { isMobile, borderSize, cellSize } = useContext(SizeContext);

  const blockButtonStyle = {
    display: 'block',
    cursor: 'pointer',
    color: theme.palette.mode === 'dark' ? colors.grey[800] : colors.grey[900],
  };

  const closeButtonSize = isMobile ? 1 : 1.5;
  const cycleButtonSize = isMobile ? 2 : 2.5;

  const xPos = `(${block.min_position.col} * (${cellSize} + ${borderSize}) + ${borderSize})`;
  const yPos = `(${block.min_position.row} * (${cellSize} + ${borderSize}) + ${borderSize})`;

  const height = `(${block.rows} * ${cellSize} + ${block.rows - 1} * ${borderSize})`;
  const width = `(${block.cols} * ${cellSize} + ${block.cols - 1} * ${borderSize})`;

  const scalingFactor = 0.1;

  const scaledXPos = `${xPos} - 0.5 * ${scalingFactor} * ${width}`;
  const scaledYPos = `${yPos} - 0.5 * ${scalingFactor} * ${height}`;

  const scaledHeight = `${1 + scalingFactor} * ${height}`;
  const scaledWidth = `${1 + scalingFactor} * ${width}`;

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
        backgroundColor: BLOCK_COLOR(block.block)[theme.palette.mode === 'dark' ? 400 : 600],
        cursor: isMovable ? 'pointer' : 'default',
        zIndex: isMovable ? 3 : 2,
      }}
      onMouseEnter={() => {
        if (boardStatus === Status.ManualSolving) {
          setIsMovable(nextMoves[block.idx].length > 0);
        }
      }}
      onMouseLeave={() => setIsMovable(false)}
      onClick={onClickBlock}
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

export default Block;

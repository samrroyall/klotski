import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Paper, colors, Box, useTheme } from '@mui/material';
import { Close, Loop } from '@mui/icons-material';
import { Block as Block_, BoardBlock, Position } from '../models/api/game';
import { SizeContext } from '../App';
import { changeBlock, removeBlock, selectBoardStatus } from '../features/board';
import {
  selectGrid,
  selectNextMoves,
  selectNumCellsFilled,
  selectNumTwoByTwoBlocks,
} from '../features/board/selectors';
import { setCurrentBlock, setAvailableMinPositions } from '../features/manualSolve';
import { Status } from '../models/ui';
import { BLOCK_COLOR, NUM_COLS, NUM_ROWS } from '../constants';
import { RootState, useAppDispatch, useAppSelector } from '../store';

interface Props {
  block: BoardBlock;
}

const Block: FunctionComponent<Props> = ({ block }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [isMovable, setIsMovable] = useState(false);
  const [nextBlock, setNextBlock] = useState<Block_ | null>(null);

  const boardStatus = useAppSelector(selectBoardStatus);
  const grid = useAppSelector(selectGrid);
  const nextMoves = useAppSelector(selectNextMoves);
  const numCellsFilled = useAppSelector(selectNumCellsFilled);
  const numTwoByTwoBlocks = useAppSelector(selectNumTwoByTwoBlocks);

  const minPositionsForBlock = useAppSelector(
    (state: RootState): Position[] =>
      state.board.nextMoves[block.idx]?.map(({ row_diff, col_diff }) => ({
        row: block.min_position.row + row_diff,
        col: block.min_position.col + col_diff,
      })) || []
  );

  const cellsFree = NUM_COLS * NUM_ROWS - 2 - (numCellsFilled - block.rows * block.cols);

  const inLastRow = block.min_position.row >= NUM_ROWS - 1;
  const inLastCol = block.min_position.col >= NUM_COLS - 1;

  useEffect(() => {
    const blocks = [Block_.OneByOne, Block_.OneByTwo, Block_.TwoByOne, Block_.TwoByTwo];
    const blockIdx = blocks.indexOf(block.block);

    const isCellFilled = (i: number, j: number) => grid[i * NUM_COLS + j];

    const rightCellIsFree =
      block.cols > 1 ||
      (!inLastCol && !isCellFilled(block.min_position.row, block.min_position.col + 1));

    const bottomCellIsFree =
      block.rows > 1 ||
      (!inLastRow && !isCellFilled(block.min_position.row + 1, block.min_position.col));

    const bottomRightCellIsFree =
      (block.rows > 1 && block.cols > 1) ||
      (!inLastRow &&
        !inLastCol &&
        !isCellFilled(block.min_position.row + 1, block.min_position.col + 1));

    for (let i = 0; i < 3; i++) {
      switch (blocks[(blockIdx + i + 1) % 4]) {
        case Block_.OneByOne:
          if (cellsFree >= 1) {
            setNextBlock(Block_.OneByOne);
            return;
          }
          break;
        case Block_.OneByTwo:
          if (cellsFree >= 2 && rightCellIsFree) {
            setNextBlock(Block_.OneByTwo);
            return;
          }
          break;
        case Block_.TwoByOne:
          if (cellsFree >= 2 && bottomCellIsFree) {
            setNextBlock(Block_.TwoByOne);
            return;
          }
          break;
        case Block_.TwoByTwo:
          if (
            numTwoByTwoBlocks === 0 &&
            cellsFree >= 4 &&
            rightCellIsFree &&
            bottomCellIsFree &&
            bottomRightCellIsFree
          ) {
            setNextBlock(Block_.TwoByTwo);
            return;
          }
          break;
      }
    }

    setNextBlock(null);
  }, [block, cellsFree, grid, inLastRow, inLastCol, numCellsFilled, numTwoByTwoBlocks]);

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
    if (nextBlock) {
      dispatch(changeBlock({ idx: block.idx, nextBlock }));
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

import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Paper, colors, Box, useTheme } from '@mui/material';
import { Close } from '@mui/icons-material';
import { Block as Block_, BoardBlock, Position } from '../models/api/game';
import { SizeContext } from '../App';
import { changeBlock, removeBlock, selectBoardStatus } from '../features/board';
import { selectGrid, selectNextMoves } from '../features/board/selectors';
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
  const [hovering, setHovering] = useState(false);
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
    if (boardStatus === Status.Building && nextChangeBlock) {
      dispatch(changeBlock({ idx: block.idx, ...nextChangeBlock }));
    } else if (boardStatus === Status.ManualSolving) {
      setIsMovable(nextMoves[block.idx].length > 0);
      dispatch(setCurrentBlock(block));
      dispatch(setAvailableMinPositions(minPositionsForBlock));
    }
  };

  const onClickCloseButton = () => {
    dispatch(removeBlock(block));
  };

  const blockKey = `${block.rows}x${block.cols}-block@(${block.min_position.row},${block.min_position.col})`;

  const { isMobile, borderSize, cellSize } = useContext(SizeContext);

  const closeButtonSize = isMobile ? 1 : 1.5;

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
        padding: 0,
        border: isMovable ? `${borderSize} solid` : 0,
        borderColor: theme.palette.text.primary,
        backgroundColor: BLOCK_COLOR(block.block)[
          theme.palette.mode === 'dark' ? (hovering ? 600 : 400) : hovering ? 700 : 600
        ],
        cursor: boardStatus === Status.Building || isMovable ? 'pointer' : 'default',
        zIndex: isMovable ? 3 : 2,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: `${(closeButtonSize * 5) / 3}rem`,
          width: `${(closeButtonSize * 5) / 3}rem`,
          display: [Status.Building, Status.ReadyToSolve].includes(boardStatus) ? 'flex' : 'none',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: `0.1rem 0.1rem ${closeButtonSize / 3}rem ${closeButtonSize / 3}rem`,
          zIndex: 2,
          '& svg': {
            color: theme.palette.mode === 'dark' ? colors.grey[800] : colors.grey[900],
          },
          '&:hover svg': {
            color: theme.palette.mode === 'dark' ? colors.grey[900] : 'black',
          },
          cursor: 'pointer',
        }}
        onClick={onClickCloseButton}
      >
        <Close sx={{ fontSize: `${closeButtonSize}rem` }} key={`${blockKey}-close-button`} />
      </Box>
      <Box
        sx={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
        onMouseEnter={() => {
          if (boardStatus === Status.Building) {
            setHovering(true);
          } else if (boardStatus === Status.ManualSolving) {
            setIsMovable(nextMoves[block.idx].length > 0);
          }
        }}
        onMouseLeave={() => {
          setHovering(false);
          setIsMovable(false);
        }}
        onClick={onClickBlock}
      />
    </Paper>
  );
};

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

export default Block;

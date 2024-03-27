import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Paper, Box, useTheme } from '@mui/material';
import { Close } from '@mui/icons-material';
import { BoardBlock, Position } from '../../models/api/game';
import { SizeContext } from '../../App';
import { changeBlock, removeBlock, selectBoardState } from '../../features/board';
import { selectGrid, selectNextMoves } from '../../features/board/selectors';
import { setCurrentBlock, setAvailableMinPositions } from '../../features/manualSolve';
import { ChangeBlock, getNextChangeBlock } from './changeBlock';
import { AppState } from '../../models/ui';
import { BLOCK_COLOR } from '../../constants';
import { RootState, useAppDispatch, useAppSelector } from '../../store';

interface Props {
  block: BoardBlock;
}

const Block: FunctionComponent<Props> = ({ block }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [isMovable, setIsMovable] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [nextChangeBlock, setNextChangeBlock] = useState<ChangeBlock | null>(null);

  const boardState = useAppSelector(selectBoardState);
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
    if (boardState === AppState.Building && nextChangeBlock) {
      dispatch(changeBlock({ idx: block.idx, ...nextChangeBlock }));
    } else if (boardState === AppState.ManualSolving) {
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
          theme.palette.mode === 'dark' ? (hovering ? 600 : 500) : hovering ? 700 : 600
        ],
        cursor: boardState === AppState.Building || isMovable ? 'pointer' : 'default',
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
          display: [AppState.Building, AppState.ReadyToSolve].includes(boardState)
            ? 'flex'
            : 'none',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: `0.1rem 0.1rem ${closeButtonSize / 3}rem ${closeButtonSize / 3}rem`,
          zIndex: 2,
          cursor: 'pointer',
        }}
        onClick={onClickCloseButton}
      >
        <Close
          sx={{
            fontSize: `${closeButtonSize}rem`,
            color: 'black',
          }}
          key={`${blockKey}-close-button`}
        />
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
          if (boardState === AppState.Building) {
            setHovering(true);
          } else if (boardState === AppState.ManualSolving) {
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

export default Block;

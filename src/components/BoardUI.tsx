import { FunctionComponent, useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { Board } from '../models/Board';
import BlockUI from './BlockUI';
import Cell from './Cell';
import { useAppSelector } from '../state/hooks';
import { DESKTOP_CELL_SIZE, MOBILE_CELL_SIZE, MOBILE_CUTOFF } from '../constants';

const BoardUI: FunctionComponent = () => {
  // State
  const blocks = useAppSelector((state) => state.board.blocks);
  const [uiBlocks, setUiBlocks] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newUiBlocks = blocks.map((pb, idx) => (
      <BlockUI key={`block-${idx}`} pb={pb} />
    ));
    setUiBlocks(newUiBlocks);
  }, [blocks]);

  // Styling
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
  const cellSize = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
  const boardWidth = Board.cols * cellSize;
  const boardSizing = { width: `${boardWidth}rem` };
  const boardPositioning = { position: 'absolute', top: 0, left: 0 };

  // Grid
  const grid = [];
  for (let i = 0; i < Board.rows; i++) {
    for (let j = 0; j < Board.cols; j++)
      grid.push(
        <Cell
          key={`cell-${i}-${j}`}
          row={i}
          col={j}
        />
      );
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        marginLeft: `calc(0.5 * (100% - ${boardWidth}rem))`,
        ...boardSizing,
      }}
    >
      <Box
        sx={{
          ...boardSizing,
          ...boardPositioning,
          display: 'grid',
          gridTemplateColumns: `repeat(${Board.cols}, 1fr)`,
          gap: 0,
        }}
      >
        {grid}
      </Box>
      <Box sx={{ ...boardSizing, ...boardPositioning }}>{uiBlocks}</Box>
    </Box>
  );
};

export default BoardUI;

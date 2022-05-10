import { FunctionComponent, useState, useEffect } from 'react';
import { Box, colors } from '@mui/material';
import { globals } from '../globals';
import { Status } from '../App';
import { PositionedBlock } from '../models/PositionedBlock';
import { Board } from '../models/Board';
import BlockUI from './BlockUI';

interface Props {
  blocks: PositionedBlock[];
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

const BoardUI: FunctionComponent<Props> = ({ blocks, status, setStatus }) => {
  // Styling Objects

  const boardWidth = Board.cols * globals.cellSize;
  const boardSizing = { width: `${boardWidth}rem` };
  const boardPositioning = { position: 'absolute', top: 0, left: 0 };

  // Board Methods

  const isWinningCell = (i: number, j: number) =>
    (i === Board.winningPos.row || i === Board.winningPos.row + 1) &&
    (j === Board.winningPos.col || j === Board.winningPos.col + 1);

  const grid = [];
  for (let i = 0; i < Board.rows; i++) {
    for (let j = 0; j < Board.cols; j++)
      grid.push(
        <Box
          key={`cell-${i}-${j}`}
          sx={{
            height: `${globals.cellSize}rem`,
            width: `${globals.cellSize}rem`,
            borderTop: 1,
            borderBottom: i === Board.rows - 1 ? 1 : 0,
            borderLeft: 1,
            borderRight: j === Board.cols - 1 ? 1 : 0,
            borderColor: colors.grey[500],
            backgroundColor: isWinningCell(i, j) ? colors.red[100] : null,
          }}
        />
      );
  }

  // UI Blocks

  const initialUIBlocks: JSX.Element[] = [];
  const [uiBlocks, setUiBlocks] = useState(initialUIBlocks);

  useEffect(() => {
    const newUiBlocks = blocks.map((block, idx) => (
      <BlockUI key={`block-${idx}`} block={block} status={status} />
    ));
    setUiBlocks(newUiBlocks);
  }, [blocks, status]);

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
          zIndex: 1,
        }}
      >
        {grid}
      </Box>
      <Box sx={{ ...boardSizing, ...boardPositioning, zIndex: 2 }}>{uiBlocks}</Box>
    </Box>
  );
};

export default BoardUI;

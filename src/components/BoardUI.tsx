import { FunctionComponent, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { globals } from '../globals';
import { BoardStatus, Status } from '../App';
import { Block } from '../models/Block';
import { Pos, PositionedBlock } from '../models/PositionedBlock';
import { Board } from '../models/Board';
import BlockUI from './BlockUI';
import Cell from './Cell';

interface Props {
  boardStatus: BoardStatus;
  blocks: PositionedBlock[];
  addBlock: (block: Block, pos: Pos) => void;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

const BoardUI: FunctionComponent<Props> = ({
  boardStatus,
  blocks,
  addBlock,
  status,
  setStatus,
}) => {
  // Styling Objects

  const boardWidth = Board.cols * globals.cellSize;
  const boardSizing = { width: `${boardWidth}rem` };
  const boardPositioning = { position: 'absolute', top: 0, left: 0 };

  // Board Methods

  const grid = [];
  for (let i = 0; i < Board.rows; i++) {
    for (let j = 0; j < Board.cols; j++)
      grid.push(
        <Cell
          key={`cell-${i}-${j}`}
          row={i}
          col={j}
          boardStatus={boardStatus}
          addBlock={addBlock}
          status={status}
          setStatus={setStatus}
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

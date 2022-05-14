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
  functions: {
    addBlock: (block: Block, pos: Pos) => void;
    getPotentialNewPositions: (block: Block, pos: Pos) => Pos[];
    moveBlockToPos: (pos_block: PositionedBlock, pos: Pos) => void;
  };
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

const BoardUI: FunctionComponent<Props> = ({
  boardStatus,
  blocks,
  functions,
  status,
  setStatus,
}) => {
  const { addBlock, getPotentialNewPositions, moveBlockToPos } = functions;

  // Styling Objects

  const boardWidth = Board.cols * globals.cellSize;
  const boardSizing = { width: `${boardWidth}rem` };
  const boardPositioning = { position: 'absolute', top: 0, left: 0 };

  // Board Methods

  const [potentialPositions, setPotentialPositions] = useState<Pos[]>([]);
  const [blockToMove, setBlockToMove] = useState<PositionedBlock | null>(null);

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
          moveBlockToPos={(pos: Pos) => {
            if (blockToMove) {
              moveBlockToPos(blockToMove, pos);
              setBlockToMove(null);
              setPotentialPositions([]);
            }
          }}
          status={status}
          setStatus={setStatus}
          potentialPositions={potentialPositions}
        />
      );
  }

  // UI Blocks

  const [uiBlocks, setUiBlocks] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newUiBlocks = blocks.map((block, idx) => (
      <BlockUI
        key={`block-${idx}`}
        boardStatus={boardStatus}
        block={block}
        status={status}
        setStatus={setStatus}
        getPotentialNewPositions={getPotentialNewPositions}
        setPotentialNewPositions={(block: Block, pos: Pos) => {
          setBlockToMove(new PositionedBlock(block, pos));
          setPotentialPositions(getPotentialNewPositions(block, pos));
        }}
      />
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
        }}
      >
        {grid}
      </Box>
      <Box sx={{ ...boardSizing, ...boardPositioning }}>{uiBlocks}</Box>
    </Box>
  );
};

export default BoardUI;

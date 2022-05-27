import { FunctionComponent, useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { Board } from '../models/Board';
import { Status } from '../App';
import BlockUI from './BlockUI';
import Cell from './Cell';
import { Severity } from './Toast';
import { useAppSelector } from '../state/hooks';
import { DESKTOP_CELL_SIZE, MOBILE_CELL_SIZE, MOBILE_CUTOFF } from '../constants';

interface Props {
  addAlert: (msg: string, severity: Severity) => void;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

const BoardUI: FunctionComponent<Props> = ({ addAlert, status, setStatus }) => {
  // State

  const blocks = useAppSelector((state) => state.board.blocks);

  const [uiBlocks, setUiBlocks] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newUiBlocks = blocks.map((pb, idx) => (
      <BlockUI key={`block-${idx}`} pb={pb} status={status} setStatus={setStatus} />
    ));
    setUiBlocks(newUiBlocks);
  }, [blocks, setStatus, status]);

  // Styling Objects

  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
  const cellSize = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
  const boardWidth = Board.cols * cellSize;

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
          addAlert={addAlert}
          status={status}
          setStatus={setStatus}
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

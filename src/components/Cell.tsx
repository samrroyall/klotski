import { FunctionComponent, useState } from 'react';
import { Box, colors } from '@mui/material';
import { Block } from '../models/Block';
import { Pos } from '../models/PositionedBlock';
import { Board } from '../models/Board';
import { BoardStatus, Status } from '../App';
import { globals } from '../globals';

interface BSProps {
  block: Block;
  addBlock: () => void;
}

const BlockSelector: FunctionComponent<BSProps> = ({ block, addBlock }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: `50%`,
        minWidth: `50%`,
        color: colors.grey[400],
        '&:hover': {
          color: colors.grey[800],
        },
      }}
      onClick={() => addBlock()}
    >
      <h3>
        {block.height()}×{block.width()}
      </h3>
    </Box>
  );
};

interface CellProps {
  row: number;
  col: number;
  boardStatus: BoardStatus;
  addBlock: (block: Block, pos: Pos) => void;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

const Cell: FunctionComponent<CellProps> = ({
  row,
  col,
  boardStatus,
  addBlock,
  status,
  setStatus,
}) => {
  const inLastRow = row === Board.rows - 1;
  const inLastCol = col === Board.cols - 1;

  const isWinningCell = (i: number, j: number) =>
    (i === Board.winningPos.row || i === Board.winningPos.row + 1) &&
    (j === Board.winningPos.col || j === Board.winningPos.col + 1);

  const [hovering, setHovering] = useState(false);

  const maxCellsFilled = Board.cols * Board.rows - 2;
  const numCellsFilled = boardStatus.isValidDebug.numCellsFilled;
  const numTwoByTwos = boardStatus.isValidDebug.numTwoByTwos;

  const validBlocks = [];
  if (numCellsFilled < maxCellsFilled) {
    validBlocks.push(Block.ONE_BY_ONE);
    if (numCellsFilled < maxCellsFilled - 1) {
      if (!inLastCol) validBlocks.push(Block.ONE_BY_TWO);
      if (!inLastRow) validBlocks.push(Block.TWO_BY_ONE);
    }
    if (numCellsFilled < maxCellsFilled - 3 && numTwoByTwos === 0 && !inLastRow && !inLastCol)
      validBlocks.push(Block.TWO_BY_TWO);
  }

  return (
    <Box
      sx={{
        height: `${globals.cellSize}rem`,
        width: `${globals.cellSize}rem`,
        borderTop: 1,
        borderBottom: Number(inLastRow),
        borderLeft: '1px solid',
        borderRight: Number(inLastCol),
        borderColor: colors.grey[500],
        backgroundColor: isWinningCell(row, col) ? colors.red[100] : null,
        cursor: status === Status.Start || status === Status.ManualBuild ? 'pointer' : 'default',
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => setHovering(false)}
    >
      <Box
        sx={{
          display: hovering ? 'flex' : 'none',
          flexWrap: 'wrap',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        {validBlocks.map((block) => (
          <BlockSelector
            key={`cell-${row}-${col}-${block.height()}x${block.width()}-selector`}
            block={block}
            addBlock={() => {
              if (status !== Status.ManualBuild) setStatus(Status.ManualBuild);
              addBlock(block, { row, col });
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Cell;

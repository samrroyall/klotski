import { FunctionComponent, useState, useEffect, useContext } from 'react';
import { Box } from '@mui/material';
import Block from './Block';
import Cell from './Cell';
import { useAppSelector } from '../state/hooks';
import { NUM_COLS, NUM_ROWS } from '../constants';
import { SizeContext } from '../App';

const Board: FunctionComponent = () => {
  // State
  const blocks = useAppSelector((state) => state.board.blocks);
  const [uiBlocks, setUiBlocks] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newUiBlocks = blocks.map(({ block, pos }, idx) => (
      <Block key={`block-${idx}`} block={block} pos={pos} />
    ));
    setUiBlocks(newUiBlocks);
  }, [blocks]);

  // Styling
  const { borderSize, boardHeight, boardWidth, cellSize } = useContext(SizeContext);
  const boardPositioning = { position: 'absolute', top: 0, left: 0 };
  const boardSizing = {
    height: `calc(${boardHeight})`,
    width: `calc(${boardWidth})`,
  };
  const cellStyles = {
    height: `calc(${cellSize} + ${borderSize})`,
    width: `calc(${cellSize} + ${borderSize})`,
    border: `${borderSize} solid black`,
    padding: 0,
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        marginLeft: `calc(0.5 * (100% - ${boardWidth}))`,
        ...boardSizing,
      }}
    >
      <Box sx={{ ...boardSizing, ...boardPositioning }}>{uiBlocks}</Box>
      <table style={{ position: 'absolute', top: 0, left: 0, borderCollapse: 'collapse' }}>
        <tbody>
          {Array.from(Array(NUM_ROWS).keys()).map((i) => (
            <tr key={`table-row-${i}`}>
              {Array.from(Array(NUM_COLS).keys()).map((j) => (
                <td key={`table-cell-${i}-${j}`} style={cellStyles}>
                  <Cell key={`Cell-${i}-${j}`} row={i} col={j} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default Board;

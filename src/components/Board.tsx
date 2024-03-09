import { FunctionComponent, useState, useEffect, useContext } from 'react';
import { Box } from '@mui/material';
import Block from './Block';
import Cell from './Cell';
import { NUM_COLS, NUM_ROWS } from '../constants';
import { SizeContext } from '../App';
import { useSelector } from 'react-redux';
import { selectBlocks } from '../features/board';

const Board: FunctionComponent = () => {
  const [uiBlocks, setUiBlocks] = useState<JSX.Element[]>([]);

  const blocks = useSelector(selectBlocks);

  useEffect(() => {
    setUiBlocks(blocks.map((block) => <Block key={`block-${block.idx}`} block={block} />));
  }, [blocks]);

  const { borderSize, boardHeight, boardWidth, cellSize } = useContext(SizeContext);

  const boardPositioning = { position: 'absolute', top: 0, left: 0 };

  const boardMargin = `calc(0.5 * (100% - ${boardWidth}))`;

  const boardSizing = {
    height: `calc(${boardHeight})`,
    width: `calc(${boardWidth})`,
  };

  const cellStyles = {
    height: `calc(${cellSize} + ${borderSize})`,
    width: `calc(${cellSize} + ${borderSize})`,
    border: `${borderSize} solid`,
    borderColor: 'black',
    padding: 0,
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        marginLeft: boardMargin,
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

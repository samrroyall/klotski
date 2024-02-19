import { FunctionComponent, useState, useEffect, useContext } from 'react';
import { Box, useTheme } from '@mui/material';
import Block from '../block/Block';
import Cell from '../Cell';
import { NUM_COLS, NUM_ROWS } from '../../constants';
import { SizeContext } from '../../App';
import { useAppSelector } from '../../state/hooks';
import { Styles } from './Styles';

const UIBoard: FunctionComponent = () => {
  const theme = useTheme();
  const blocks = useAppSelector((state) => state.board.blocks);
  const [uiBlocks, setUiBlocks] = useState<JSX.Element[]>([]);

  useEffect(() => {
    setUiBlocks(blocks.map((block, idx) => <Block key={`block-${idx}`} block={block} idx={idx} />));
  }, [blocks]);

  const { borderSize, boardHeight, boardWidth, cellSize } = useContext(SizeContext);

  const boardSizing = Styles.getBoardSizing(boardHeight, boardWidth);

  const cellStyles = Styles.getCellStyles(borderSize, cellSize, theme);

  return (
    <Box
      sx={{
        position: 'absolute',
        marginLeft: `calc(0.5 * (100% - ${boardWidth}))`,
        ...boardSizing,
      }}
    >
      <Box sx={{ ...boardSizing, ...Styles.boardPositioning }}>{uiBlocks}</Box>
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

export default UIBoard;

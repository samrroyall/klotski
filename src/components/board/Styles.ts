import { Theme } from '@mui/material';

const boardPositioning = { position: 'absolute', top: 0, left: 0 };

const getBoardSizing = (boardHeight: string, boardWidth: string) => ({
  height: `calc(${boardHeight})`,
  width: `calc(${boardWidth})`,
});

const getBoardMargin = (boardWidth: string) => `calc(0.5 * (100% - ${boardWidth}))`;

const getCellStyles = (borderSize: string, cellSize: string, theme: Theme) => ({
  height: `calc(${cellSize} + ${borderSize})`,
  width: `calc(${cellSize} + ${borderSize})`,
  border: `${borderSize} solid`,
  borderColor: theme.palette.text.primary,
  padding: 0,
});

export const Styles = {
  boardPositioning,
  getBoardMargin,
  getBoardSizing,
  getCellStyles,
};

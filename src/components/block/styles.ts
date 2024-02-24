import { Theme, colors } from '@mui/material';

const blockColors = [colors.yellow, colors.green, colors.blue, colors.red];

const getBlockButtonStyle = (theme: Theme) => ({
  display: 'block',
  cursor: 'pointer',
  color: theme.palette.mode === 'dark' ? colors.grey[800] : colors.grey[900],
});

const getCloseButtonSize = (isMobile: boolean) => (isMobile ? 1 : 1.5);
const getCycleButtonSize = (isMobile: boolean) => (isMobile ? 2 : 2.5);

const getXPos = (col: number, borderSize: string, cellSize: string) =>
  `(${col} * (${cellSize} + ${borderSize}) + ${borderSize})`;
const getYPos = (row: number, borderSize: string, cellSize: string) =>
  `(${row} * (${cellSize} + ${borderSize}) + ${borderSize})`;

const getHeight = (rows: number, borderSize: string, cellSize: string) =>
  `(${rows} * ${cellSize} + ${rows - 1} * ${borderSize})`;
const getWidth = (cols: number, borderSize: string, cellSize: string) =>
  `(${cols} * ${cellSize} + ${cols - 1} * ${borderSize})`;

const scalingFactor = 0.1;

const getScaledHeight = (height: string) => `${1 + scalingFactor} * ${height}`;
const getScaledWidth = (width: string) => `${1 + scalingFactor} * ${width}`;

const getScaledXPos = (xPos: string, width: string) =>
  `${xPos} - 0.5 * ${scalingFactor} * ${width}`;
const getScaledYPos = (yPos: string, height: string) =>
  `${yPos} - 0.5 * ${scalingFactor} * ${height}`;

export const Styles = {
  blockColors,
  getBlockButtonStyle,
  getCloseButtonSize,
  getCycleButtonSize,
  getHeight,
  getWidth,
  getScaledHeight,
  getScaledWidth,
  getScaledXPos,
  getScaledYPos,
  getXPos,
  getYPos,
};

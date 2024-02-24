import {
  BORDER_SIZE,
  DESKTOP_CELL_SIZE,
  MOBILE_CELL_SIZE,
  NUM_COLS,
  NUM_ROWS,
  TABLET_CELL_SIZE,
} from '../constants';

// Responsive helpers

export interface Sizes {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  borderSize: string;
  cellSize: string;
  boardHeight: string;
  boardWidth: string;
}

export const getSizes = (isMobile: boolean, isTablet: boolean): Sizes => {
  const borderSize = `${BORDER_SIZE}px`;
  const cellSize = isMobile ? MOBILE_CELL_SIZE : isTablet ? TABLET_CELL_SIZE : DESKTOP_CELL_SIZE;

  return {
    isMobile,
    isTablet: !isMobile && isTablet,
    isDesktop: !isMobile && !isTablet,
    borderSize,
    cellSize,
    boardHeight: `(${NUM_ROWS} * (${cellSize} + ${borderSize}) + ${borderSize})`,
    boardWidth: `(${NUM_COLS} * (${cellSize} + ${borderSize}) + ${borderSize})`,
  };
};

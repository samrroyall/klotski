import { Theme, colors } from '@mui/material';
import { Helpers } from './helpers';
import { Status } from '../../state/boardSlice';
import { RootState } from '../../state/store';

const winningCellDefault = (theme: Theme) =>
  theme.palette.mode === 'dark' ? colors.red[200] : colors.red[100];
const winningCellHover = (theme: Theme) =>
  theme.palette.mode === 'dark' ? colors.red[100] : colors.red[200];

const getCellColor = (theme: Theme, row: number, col: number) =>
  Helpers.getIsWinningCell(row, col) ? winningCellDefault(theme) : theme.palette.action.hover;

const getCellHoverColor = (state: RootState, theme: Theme, row: number, col: number) => {
  const status = Helpers.getStatus(state);
  const isWinningCell = Helpers.getIsWinningCell(row, col);

  return [Status.Start, Status.Building].includes(status)
    ? isWinningCell
      ? winningCellHover
      : theme.palette.action.selected
    : isWinningCell
    ? winningCellDefault
    : theme.palette.action.hover;
};

const getCursor = (state: RootState) =>
  [Status.Start, Status.Building].includes(Helpers.getStatus(state)) ? 'pointer' : 'default';

const getPointerEvents = (state: RootState) =>
  [Status.Start, Status.Building].includes(Helpers.getStatus(state)) ? 'auto' : 'none';

export const Styles = {
  availablePositionBoxScaleFactor: 0.2,
  getCellColor,
  getCellHoverColor,
  getCursor,
  getPointerEvents,
};

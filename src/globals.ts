interface Globals {
  numRows: number;
  numCols: number;
  winningRow: number;
  winningCol: number;
  mobileCutoff: number; // in px
  desktopCellSize: number; // in rem
  mobileCellSize: number; // in rem
}

export const globals: Globals = {
  numRows: 5,
  numCols: 4,
  winningRow: 3,
  winningCol: 1,
  mobileCutoff: 800,
  desktopCellSize: 8,
  mobileCellSize: 5,
};

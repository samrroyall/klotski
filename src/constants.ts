import { colors } from '@mui/material';
import { Block } from './models/api/game';

export const NUM_ROWS = 5;

export const NUM_COLS = 4;

export const WINNING_ROW = 3;

export const WINNING_COL = 1;

export const MOBILE_CUTOFF = '480px';

export const TABLET_CUTOFF = '800px';

export const BORDER_SIZE = 1;

export const DESKTOP_CELL_SIZE = '8rem';

export const TABLET_CELL_SIZE = '6rem';

export const MOBILE_CELL_SIZE = '23vw';

export const BLOCK_COLOR = (block: Block) => {
  switch (block) {
    case Block.OneByOne:
      return colors.yellow;
    case Block.OneByTwo:
      return colors.green;
    case Block.TwoByOne:
      return colors.blue;
    case Block.TwoByTwo:
      return colors.red;
  }
};

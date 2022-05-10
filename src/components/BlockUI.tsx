import { FunctionComponent } from 'react';
import { Box, colors } from '@mui/material';
import { globals } from '../globals';
import { BlockId } from '../models/Block';
import { PositionedBlock } from '../models/PositionedBlock';
import { Status } from '../App';

interface Props {
  block: PositionedBlock;
  status: Status;
}

const BlockUI: FunctionComponent<Props> = ({ block }) => {
  const getBlockColor = (type: BlockId) => {
    switch (type) {
      case BlockId.OneByOne:
        return colors.yellow;
      case BlockId.TwoByOne:
        return colors.blue;
      case BlockId.OneByTwo:
        return colors.green;
      case BlockId.TwoByTwo:
        return colors.red;
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: `${block.minPos().row * globals.cellSize}rem`,
        left: `${block.minPos().col * globals.cellSize}rem`,
        height: `calc(${block.block.height() * globals.cellSize}rem)`,
        width: `calc(${block.block.width() * globals.cellSize}rem)`,
        backgroundColor: getBlockColor(block.toBlockId())[600],
        border: 1,
        borderColor: getBlockColor(block.toBlockId())[800],
      }}
    />
  );
};

export default BlockUI;

import { FunctionComponent, useState } from 'react';
import { Paper, colors } from '@mui/material';
import { globals } from '../globals';
import { Block } from '../models/Block';
import { Pos, PositionedBlock } from '../models/PositionedBlock';
import { Status, BoardStatus } from '../App';

interface Props {
  block: PositionedBlock;
  boardStatus: BoardStatus;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  getPotentialNewPositions: (block: Block, pos: Pos) => Pos[];
  setPotentialNewPositions: (block: Block, pos: Pos) => void;
}

const BlockUI: FunctionComponent<Props> = ({
  block,
  boardStatus,
  status,
  getPotentialNewPositions,
  setPotentialNewPositions,
}) => {
  const blockColor = [colors.yellow, colors.blue, colors.green, colors.red];

  const [isMovable, setIsMovable] = useState(false);

  const boardReadyToSolve = () => boardStatus.isValid && status === Status.ManualSolve;

  const scalingFactor = 0.1;

  const blockPos = {
    top: block.minPos().row * globals.cellSize,
    left: block.minPos().col * globals.cellSize,
  };

  const blockSize = {
    height: block.block.height() * globals.cellSize,
    width: block.block.width() * globals.cellSize,
  };

  return (
    <Paper
      elevation={isMovable ? 12 : 0}
      variant={isMovable ? 'elevation' : 'outlined'}
      square
      sx={{
        position: 'absolute',
        top: `${
          isMovable ? blockPos.top - (blockSize.height * scalingFactor) / 2 : blockPos.top
        }rem`,
        left: `${
          isMovable ? blockPos.left - (blockSize.width * scalingFactor) / 2 : blockPos.left
        }rem`,
        height: `${isMovable ? blockSize.height * (1 + scalingFactor) : blockSize.height}rem`,
        width: `${isMovable ? blockSize.width * (1 + scalingFactor) : blockSize.width}rem`,
        backgroundColor: blockColor[block.toBlockId() - 1][600],
        cursor: isMovable ? 'pointer' : 'default',
        zIndex: isMovable ? 3 : 2,
      }}
      onMouseEnter={() => {
        if (boardReadyToSolve() && getPotentialNewPositions(block.block, block.minPos()).length > 0)
          setIsMovable(true);
      }}
      onMouseLeave={() => {
        if (isMovable) setIsMovable(false);
      }}
      onClick={() => {
        if (!boardReadyToSolve()) return;

        setPotentialNewPositions(block.block, block.minPos());
      }}
    />
  );
};

export default BlockUI;

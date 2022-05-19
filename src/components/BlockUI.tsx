import { FunctionComponent, useState } from 'react';
import { Paper, colors, useMediaQuery } from '@mui/material';
import { globals } from '../globals';
import { Block } from '../models/Block';
import { Pos, PositionedBlock } from '../models/PositionedBlock';
import { Status, BoardStatus } from '../App';

interface Props {
  block: PositionedBlock;
  boardStatus: BoardStatus;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  getPotentialPositions: (block: Block, pos: Pos) => Pos[];
  setPotentialPositions: (block: Block, pos: Pos) => void;
}

const BlockUI: FunctionComponent<Props> = ({
  block,
  boardStatus,
  status,
  getPotentialPositions,
  setPotentialPositions,
}) => {
  const blockColor = [colors.yellow, colors.blue, colors.green, colors.red];

  const [isMovable, setIsMovable] = useState(false);

  const boardReadyToSolve = () => boardStatus.isValid && status === Status.ManualSolve;

  const isMobile = useMediaQuery(`(max-width:${globals.mobileCutoff}px)`);
  const cellSize = isMobile ? globals.mobileCellSize : globals.desktopCellSize;

  const blockPos = {
    top: block.minPos().row * cellSize,
    left: block.minPos().col * cellSize,
  };

  const blockSize = {
    height: block.block.rows * cellSize,
    width: block.block.cols * cellSize,
  };

  const scalingFactor = 0.1;

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
        backgroundColor: blockColor[block.block.toInt() - 1][600],
        cursor: isMovable ? 'pointer' : 'default',
        zIndex: isMovable ? 3 : 2,
      }}
      onMouseEnter={() => {
        if (boardReadyToSolve() && getPotentialPositions(block.block, block.minPos()).length > 0)
          setIsMovable(true);
      }}
      onMouseLeave={() => {
        if (isMovable) setIsMovable(false);
      }}
      onClick={() => {
        if (!boardReadyToSolve()) return;

        setPotentialPositions(block.block, block.minPos());
      }}
    />
  );
};

export default BlockUI;

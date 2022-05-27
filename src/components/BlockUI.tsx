import { FunctionComponent, useState } from 'react';
import { Paper, colors, useMediaQuery } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectAvailablePositions, selectBoardIsValid } from '../state/board/boardSlice';
import { setBlockToMove, setAvailablePositions } from '../state/solve/manualSolveSlice';
import { blockToInt, UIPosBlock } from '../models/global';
import { DESKTOP_CELL_SIZE, MOBILE_CELL_SIZE, MOBILE_CUTOFF } from '../constants';
import { Status } from '../App';

interface Props {
  pb: UIPosBlock;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

const BlockUI: FunctionComponent<Props> = ({ pb, status, setStatus }) => {
  // State

  const dispatch = useAppDispatch();
  const availablePositions = useAppSelector((state) => selectAvailablePositions(state, pb));
  const boardIsValid = useAppSelector((state) => selectBoardIsValid(state));

  const [isMovable, setIsMovable] = useState(false);

  // Styling variables

  const blockColor = [colors.yellow, colors.blue, colors.green, colors.red];

  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);

  const cellSize = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
  const blockPos = {
    top: pb.pos.row * cellSize,
    left: pb.pos.col * cellSize,
  };
  const blockSize = {
    height: pb.block.rows * cellSize,
    width: pb.block.cols * cellSize,
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
        backgroundColor: blockColor[blockToInt(pb.block) - 1][600],
        cursor: isMovable ? 'pointer' : 'default',
        zIndex: isMovable ? 3 : 2,
      }}
      onMouseEnter={() => {
        if (!(status === Status.ManualSolve && boardIsValid)) return;

        setIsMovable(availablePositions.length > 0);
      }}
      onMouseLeave={() => {
        if (isMovable) setIsMovable(false);
      }}
      onClick={() => {
        if (!(status === Status.ManualSolve && boardIsValid)) return;

        dispatch(setBlockToMove(pb));
        dispatch(setAvailablePositions({ positions: availablePositions }));
      }}
    />
  );
};

export default BlockUI;

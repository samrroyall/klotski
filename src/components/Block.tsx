import { FunctionComponent, useState } from 'react';
import { Paper, colors, useMediaQuery } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { Status } from '../state/appSlice';
import { setBlockToMove, setAvailablePositions } from '../state/manualSolveSlice';
import { availablePositionsForBlock, boardIsValid, blockToInt, PosBlock } from '../models/global';
import { DESKTOP_CELL_SIZE, MOBILE_CELL_SIZE, MOBILE_CUTOFF } from '../constants';

interface Props {
  pb: PosBlock;
}

const Block: FunctionComponent<Props> = ({block, pos}) => {
  // State
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.app.status );
  const availablePositions = useAppSelector((state) => availablePositionsForBlock(state.board, pb));
  const boardValid = useAppSelector((state) => boardIsValid(state.board));
  const [isMovable, setIsMovable] = useState(false);

  // Styling
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
  const cellSize = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
  const blockColor = [colors.yellow, colors.blue, colors.green, colors.red];
  const blockPos = {
    top: pos.row*cellSize,
    left: pos.col*cellSize,
  };
  const blockSize = {
    height: block.rows*cellSize,
    width: block.cols*cellSize,
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
        backgroundColor: blockColor[blockToInt(block) - 1][600],
        cursor: isMovable ? 'pointer' : 'default',
        zIndex: isMovable ? 3 : 2,
      }}
      onMouseEnter={() => {
        if (!(status === Status.ManualSolve && boardValid)) return;

        setIsMovable(availablePositions.length > 0);
      }}
      onMouseLeave={() => {
        if (isMovable) setIsMovable(false);
      }}
      onClick={() => {
        if (!(status === Status.ManualSolve && boardValid)) return;

        dispatch(setBlockToMove({block, pos}));
        dispatch(setAvailablePositions(availablePositions));
      }}
    />
  );
};

export default Block;

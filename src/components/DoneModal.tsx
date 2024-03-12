import { Box, Modal, useTheme } from '@mui/material';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { SizeContext } from '../App';
import { Status } from '../models/ui';
import { selectBoardStatus } from '../features/board';
import { useAppSelector } from '../store';
import { selectNumMoves, selectNumOptimalMoves } from '../features/manualSolve';

const DoneModal: FunctionComponent = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const boardStatus = useAppSelector(selectBoardStatus);
  const numMoves = useAppSelector(selectNumMoves);
  const numOptimalMoves = useAppSelector(selectNumOptimalMoves);

  useEffect(() => {
    if ([Status.Solved, Status.SolvedOptimally].includes(boardStatus)) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [boardStatus]);

  const { isMobile, cellSize, boardWidth } = useContext(SizeContext);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-done-modal"
      aria-describedby="modal showing that the board is solved"
    >
      <Box
        sx={{
          position: 'absolute',
          top: `50%`,
          left: '50%',
          transform: `translate(-50%, -50%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: `${isMobile ? 12 : 20}rem`,
          width: `calc(${isMobile ? boardWidth : `${boardWidth} + ${cellSize}`})`,
          padding: `${isMobile ? 2 : 5}rem`,
          border: `1px solid ${theme.palette.text.primary}`,
          bgcolor: theme.palette.background.default,
          boxShadow: 24,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              fontSize: `${isMobile ? 3 : 5}rem`,
            }}
          >
            <EmojiEventsRoundedIcon fontSize="inherit" />
          </Box>
          <Box
            sx={{
              marginTop: `${isMobile ? 0.5 : 1}rem`,
              fontSize: `${isMobile ? 0.8 : 1}rem`,
              textAlign: 'center',
            }}
          >
            <span>
              {'Congratulations! You solved the board in '}
              <b>{numMoves}</b>
              {numMoves > 1 ? ' moves. ' : ' move. '}
            </span>
            {boardStatus === Status.SolvedOptimally ? (
              <span>{'That is the fewest possible moves!'}</span>
            ) : (
              <span>
                {'This board can be solved in as few as '}
                <b>{numOptimalMoves || 0}</b>
                {numMoves > 1 ? ' moves.' : ' move.'}
              </span>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DoneModal;

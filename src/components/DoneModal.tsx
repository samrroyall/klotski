import { Box, colors, Modal, useTheme } from '@mui/material';
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
          bgcolor: theme.palette.background.default,
          borderRadius: '0.5rem',
          boxShadow: 24,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: `${isMobile ? 1 : 1.3}rem`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: colors.amber[200],
              fontSize: `${isMobile ? 3 : 5}rem`,
            }}
          >
            <EmojiEventsRoundedIcon fontSize="inherit" />
          </Box>
          <Box
            sx={{
              marginTop: `${isMobile ? 0.5 : 1}rem`,
              textAlign: 'center',
              fontWeight: 'medium',
            }}
          >
            <span>{'Congratulations! You solved the board in '}</span>
            <Box
              sx={{
                display: 'inline',
                color: colors.green[600],
              }}
            >
              <b>{numMoves}</b>
            </Box>
            <span>{numMoves === 1 ? ' move. ' : ' moves. '}</span>
            {boardStatus === Status.SolvedOptimally ? (
              <span>{'That is the fewest moves possible moves!'}</span>
            ) : (
              <>
                <span>{'This board can be solved in as few as '}</span>
                <Box
                  sx={{
                    display: 'inline',
                    color: colors.red[300],
                  }}
                >
                  <b>{numOptimalMoves || 0}</b>
                </Box>
                <span>{numMoves === 1 ? ' move.' : ' moves.'}</span>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DoneModal;

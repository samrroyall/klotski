import { Box, colors, Modal } from '@mui/material';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useAppSelector } from '../state/hooks';
import { SizeContext } from '../App';
import { Status } from '../state/boardSlice';

const DoneModal: FunctionComponent = () => {
  const status = useAppSelector((state) => state.board.status);
  const solutionLength = useAppSelector((state) => state.manualSolve.moves.length);
  const optimalMoveLength = useAppSelector((state) => state.manualSolve.optimalMoves?.length);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if ([Status.Solved, Status.SolvedOptimally].includes(status)) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [status]);

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
          bgcolor: 'background.paper',
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
            }}
          >
            Congratulations! You solved the board in
            <Box
              sx={{
                display: 'inline',
                color: colors.green[600],
              }}
            >
              {solutionLength}
            </Box>
            moves.{' '}
            {status === Status.SolvedOptimally ? (
              <span>That is the fewest moves possible.</span>
            ) : (
              <span>
                This board can be solved in as few as
                <Box
                  sx={{
                    display: 'inline',
                    color: colors.red[300],
                  }}
                >
                  {optimalMoveLength || 0}
                </Box>{' '}
                moves.
              </span>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DoneModal;

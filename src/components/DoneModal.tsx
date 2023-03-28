import { Box, colors, Modal, useMediaQuery } from '@mui/material';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import { FunctionComponent, useEffect, useState } from 'react';
import { Status } from '../state/appSlice';
import { useAppSelector } from '../state/hooks';
import { getSizes } from '../models/global';

const DoneModal: FunctionComponent = () => {
  const status = useAppSelector((state) => state.app.status);
  const moveIdx = useAppSelector((state) => state.manualSolve.moveIdx);
  const optimalMoves = useAppSelector((state) => state.manualSolve.optimalMoves);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if ([Status.Done, Status.DoneOptimal].includes(status)) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [status]);

  // Styling
  const { isMobile, cellSize, boardWidth } = getSizes(useMediaQuery);
  const redText = { display: 'inline', color: colors.red[300] };
  const greenText = { display: 'inline', color: colors.green[600] };

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
          top: `${isMobile ? 40 : 30}%`,
          left: '50%',
          transform: `translate(-50%, -${isMobile ? 40 : 30}%)`,
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
            <Box sx={greenText}> {moveIdx} </Box> moves.{' '}
            {status === Status.DoneOptimal ? (
              <span>That is the fewest moves possible.</span>
            ) : (
              <span>
                This board can be solved in as few as
                <Box sx={redText}> {optimalMoves?.length || 0} </Box> moves.
              </span>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DoneModal;

import { FunctionComponent } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Board from './components/Board';
import Buttons from './components/Buttons';
import StatusMsg from './components/StatusMsg';
import TitleContainer from './components/TitleContainer';
import DoneModal from './components/DoneModal';
import { DESKTOP_CELL_SIZE, MOBILE_CELL_SIZE, MOBILE_CUTOFF, NUM_ROWS } from './constants';

const App: FunctionComponent = () => {
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
  const cellSize = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
  const buttonSize = isMobile ? 3 : 4;

  return (
    <Box className="App">
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          userSelect: 'none',
        }}
      >
        <TitleContainer />
        <StatusMsg />
        <Box
          sx={{
            position: 'relative',
            height: `${cellSize * NUM_ROWS + buttonSize}rem`,
            width: '100%',
          }}
        >
          <Board />
          <Buttons />
        </Box>
        <DoneModal />
      </Box>
    </Box>
  );
};

export default App;

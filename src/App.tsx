import { FunctionComponent } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Board from './components/Board';
import Buttons from './components/Buttons';
import StatusMsg from './components/StatusMsg';
import TitleContainer from './components/TitleContainer';
import DoneModal from './components/DoneModal';
import { getSizes } from './models/global';

const App: FunctionComponent = () => {
  const { isMobile, boardHeight } = getSizes(useMediaQuery);
  const buttonSize = isMobile ? 3 : 4;
  const containerStyle = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    touchAction: 'manipulation',
    userSelect: 'none',
  };
  const mobileHeights = [
    { height: 'fill-available' },
    { height: '-webkit-fill-available' },
    { height: '-moz-fill-available' },
  ];

  return (
    <Box className="App">
      <Box sx={isMobile ? [containerStyle, ...mobileHeights] : containerStyle}>
        <TitleContainer />
        <StatusMsg />
        <Box
          sx={{
            position: 'relative',
            height: `calc(${boardHeight} + ${buttonSize}rem)`,
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

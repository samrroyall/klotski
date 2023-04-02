import { createContext, FunctionComponent, useEffect, useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Board from './components/Board';
import Buttons from './components/Buttons';
import StatusMsg from './components/StatusMsg';
import TitleContainer from './components/TitleContainer';
import DoneModal from './components/DoneModal';
import { MOBILE_CUTOFF, TABLET_CUTOFF } from './constants';
import { getSizes, Sizes } from './models/global';

export const SizeContext = createContext<Sizes>(getSizes(false, false));

const App: FunctionComponent = () => {
  // State
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF})`);
  const isTablet = useMediaQuery(`(max-width:${TABLET_CUTOFF})`);
  const [sizes, setSizes] = useState(getSizes(isMobile, isTablet));
  useEffect(() => {
    setSizes(getSizes(isMobile, isTablet));
  }, [isMobile, isTablet]);

  // Styling
  const containerStyle = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 400,
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
      <SizeContext.Provider value={sizes}>
        <Box sx={isMobile ? [containerStyle, ...mobileHeights] : [containerStyle]}>
          <TitleContainer />
          <StatusMsg />
          <Box
            sx={{
              position: 'relative',
              height: `calc(${sizes.boardHeight} + ${isMobile ? 2.5 : 3}rem)`,
              width: '100%',
            }}
          >
            <Board />
            <Buttons />
          </Box>
          <DoneModal />
        </Box>
      </SizeContext.Provider>
    </Box>
  );
};

export default App;

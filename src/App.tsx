import { createContext, FunctionComponent, useEffect, useMemo, useState } from 'react';
import {
  Box,
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import Board from './components/Board';
import Buttons from './components/Buttons';
import StatusMsg from './components/StatusMsg';
import TitleContainer from './components/TitleContainer';
import DoneModal from './components/DoneModal';
import { MOBILE_CUTOFF, TABLET_CUTOFF } from './constants';
import { getSizes, Sizes } from './models/global';
import {
  Brightness4Rounded as DarkModeIcon,
  Brightness7Rounded as LightModeIcon,
} from '@mui/icons-material';
import * as Sentry from '@sentry/react';

Sentry.init({
  environment: process.env.NODE_ENV,
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost'],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

export const SizeContext = createContext<Sizes>(getSizes(false, false));

const App: FunctionComponent = () => {
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF})`);
  const isTablet = useMediaQuery(`(max-width:${TABLET_CUTOFF})`);

  if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', 'light');
  }

  const [mode, setMode] = useState(localStorage.getItem('theme') as PaletteMode);

  const theme = useMemo(() => {
    localStorage.setItem('theme', mode);
    return createTheme({ palette: { mode } });
  }, [mode]);

  const [sizes, setSizes] = useState(getSizes(isMobile, isTablet));

  useEffect(() => {
    setSizes(getSizes(isMobile, isTablet));
  }, [isMobile, isTablet]);

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
    <ThemeProvider theme={theme}>
      <SizeContext.Provider value={sizes}>
        <CssBaseline />
        <Box className="App">
          <Box sx={isMobile ? [containerStyle, ...mobileHeights] : [containerStyle]}>
            <Box sx={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              {theme.palette.mode === 'light' ? (
                <DarkModeIcon sx={{ cursor: 'pointer' }} onClick={() => setMode('dark')} />
              ) : (
                <LightModeIcon sx={{ cursor: 'pointer' }} onClick={() => setMode('light')} />
              )}
            </Box>
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
        </Box>
      </SizeContext.Provider>
    </ThemeProvider>
  );
};

export default App;

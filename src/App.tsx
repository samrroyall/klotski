import { FunctionComponent } from 'react';
import { Box } from '@mui/material';
import BoardUI from './components/BoardUI';
import Buttons from './components/Buttons';
import StatusMsg from './components/StatusMsg';
import TitleContainer from './components/TitleContainer';
import AlertContainer from './components/AlertContainer';

const App: FunctionComponent = () => {
  return (
    <Box className="App" sx={{ userSelect: 'none' }}>
      <AlertContainer />
      <TitleContainer />
      <StatusMsg />
      <Box sx={{ position: 'relative', width: '100%' }}>
        <BoardUI />
        <Buttons />
      </Box>
    </Box>
  );
};

export default App;

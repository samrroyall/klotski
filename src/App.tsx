import { FunctionComponent } from 'react';
import { Box } from '@mui/material';
import Board from './components/Board';
import Buttons from './components/Buttons';
import StatusMsg from './components/StatusMsg';
import TitleContainer from './components/TitleContainer';
import DoneModal from './components/DoneModal';

const App: FunctionComponent = () => {
  return (
    <Box className="App" sx={{ userSelect: 'none' }}>
      <TitleContainer />
      <StatusMsg />
      <Box sx={{ position: 'relative', width: '100%' }}>
        <Board />
        <Buttons />
      </Box>
      <DoneModal />
    </Box>
  );
};

export default App;

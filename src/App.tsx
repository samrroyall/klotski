import { FunctionComponent, useState } from 'react';
import { Box, Tooltip, useMediaQuery } from '@mui/material';
import { HelpOutlineOutlined } from '@mui/icons-material';
import BoardUI from './components/BoardUI';
import Buttons from './components/Buttons';
import StatusMsg from './components/StatusMsg';
import { Toast, Severity } from './components/Toast';
import { MOBILE_CUTOFF } from './constants';

export enum Status {
  Start,
  ManualBuild,
  AlgoBuild,
  ManualSolve,
  Solved,
  StepThroughSolution,
  SimulateSolution,
  Done,
  Failed,
  AlreadySolved,
}

const App: FunctionComponent = () => {
  // Status State

  const [status, setStatus] = useState(Status.Start);

  // Alert State

  const [alert, setAlert] = useState<JSX.Element | null>(null);

  const addAlert = (msg: string, severity: Severity) =>
    setAlert(<Toast severity={severity} msg={msg} closeCallback={() => setAlert(null)} />);

  const AlertContainer: FunctionComponent = () => (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3rem',
        paddingY: '1rem',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {alert}
    </Box>
  );

  // Title Container
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);

  const TitleContainer = () => {
    const helpText = `${isMobile ? 'Click on ' : 'Hover over '} a cell below and click on one of the
    HEIGHT×WIDTH buttons to add a block of that size. A valid board contains exactly one 2x2 block 
    and exactly two free spaces. You can also click 'Create Board For Me' to get a random board.`;

    return (
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}
      >
        <h1 style={{ padding: 0, margin: 0 }}>KLOTSKI SOLVER</h1>
        <Tooltip title={helpText} arrow>
          <HelpOutlineOutlined color="action" fontSize="small" style={{ marginLeft: '1rem' }} />
        </Tooltip>
      </Box>
    );
  };

  return (
    <Box className="App">
      <AlertContainer />
      <TitleContainer />
      <StatusMsg status={status} />
      <Box sx={{ position: 'relative', width: '100%' }}>
        <BoardUI addAlert={addAlert} status={status} setStatus={setStatus} />
        <Buttons status={status} setStatus={setStatus} />
      </Box>
    </Box>
  );
};

export default App;

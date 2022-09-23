import { useMediaQuery } from '@mui/material';
import { FunctionComponent } from 'react';
import { Status } from '../state/appSlice';
import { useAppSelector } from '../state/hooks';
import { MOBILE_CUTOFF } from '../constants';

const StatusMsg: FunctionComponent<{}> = () => {
  // State
  const status = useAppSelector((state) => state.app.status);
  const moveIdx = useAppSelector((state) => state.manualSolve.moveIdx); 
  const numOptimalMoves = useAppSelector((state) => state.manualSolve.optimalMoves 
    ? state.manualSolve.optimalMoves.length 
    : null
  );
  const numSteps = useAppSelector((state) => state.algoSolve.steps 
    ? state.algoSolve.steps.length 
    : null
  );
  const stepIdx = useAppSelector((state) => state.algoSolve.stepIdx);

  // Status Messages
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
  const msgText: {[k in Status]?: JSX.Element } = {
    alreadySolved: <span>Oops! It looks like the board is already solved</span>,
    failed: <span>No Solution Found :(</span>,
    manualBuild: <span>A valid board has exactly one 2×2 block and two empty cells</span>,
    manualSolve: (
      <span>
        Current Moves: <strong>{moveIdx}</strong>
        <span style={{ marginLeft: '1rem' }}>
          Fewest Possible Moves: <strong>{numOptimalMoves}</strong>
        </span>
      </span>
    ),  
    readyToSolve: <span>Move the 2×2 block to the red area at the bottom to win</span>,
    start: <span>{isMobile ? 'Click on ' : 'Hover over '} a cell to add a block</span>,
    stepThrough: (
      <span>
        <strong>{numSteps ? numSteps - stepIdx - 1 : -1}</strong>/
        <strong>{numSteps || -1}</strong>
      </span>
    ),
  }; 

  return (
    <p
      style={{
        display: 'block',
        marginTop: '1rem',
        marginBottom: '1rem',
        minHeight: isMobile ? '1.2rem' : '1.5rem',
        textAlign: 'center',
        fontSize: `${isMobile ? 0.7 : 1}rem`,
      }}
    >
      {status in msgText ? msgText[status] : <></>}
    </p>
  );
};

export default StatusMsg;

import { useMediaQuery } from '@mui/material';
import { FunctionComponent } from 'react';
import { Status } from '../state/appSlice';
import { selectBoardIsValid } from '../state/boardSlice';
import { useAppSelector } from '../state/hooks';
import { MOBILE_CUTOFF } from '../constants';

const StatusMsg: FunctionComponent<{}> = () => {
  // State
  const status = useAppSelector((state) => state.app.status);
  const boardIsValid = useAppSelector((state) => selectBoardIsValid(state));
  const moveIdx = useAppSelector((state) => state.manualSolve.moveIdx);
  const numOptimalMoves = useAppSelector((state) => state.manualSolve.optimalMoves 
    ? state.manualSolve.optimalMoves.length 
    : null
  );
  const manualIsSolved = useAppSelector((state) => state.manualSolve.isSolved);
  const numSteps = useAppSelector((state) => state.algoSolve.steps 
    ? state.algoSolve.steps.length 
    : null
  );
  const stepIdx = useAppSelector((state) => state.algoSolve.stepIdx);
  const algoIsSolved = useAppSelector((state) => state.algoSolve.isSolved);

  // Status Messages
  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
  const startMsg = <span>{isMobile ? 'Click on ' : 'Hover over '} a cell to add a block</span>;
  const failedMsg = <span>No Solution Found :(</span>;
  const alreadySolvedMsg = <span>Oops! It looks like the board is already solved</span>;
  const manualBuildMsg = <span>A valid board has exactly one 2x2 block and two empty cells</span>;
  const readyToSolveMsg = <span>The board is ready to solve</span>;
  const algoSolvedMsg = <span>The optimal solution is <strong>{numSteps}</strong> steps long</span>;
  const manualSolveMsg = (<span>
    Current Moves: <strong>{moveIdx}</strong>
    <span style={{ marginLeft: '1rem' }}>
      Fewest Possible Moves: <strong>{numOptimalMoves}</strong>
    </span>
  </span>);
  const stepThroughSolutionMsg = (<span>
    <strong>{numSteps ? numSteps - stepIdx - 1 : -1}</strong>/<strong>{numSteps || -1}</strong>
  </span>);
  const solvedMsg = <span>You solved the board in <strong>{moveIdx}</strong> moves!</span>;
  const solvedOptimalMsg = (<span>
    You solved the board in <strong>{moveIdx}</strong> moves. That's the fewest moves possible!
  </span>);

  const statusMsg = status === Status.Start ? startMsg
    : status === Status.ManualBuild ? boardIsValid 
      ? readyToSolveMsg 
      : manualBuildMsg
    : status === Status.AlgoBuild ? readyToSolveMsg
    : status === Status.ManualSolve ? manualSolveMsg
    : status === Status.Solved ? algoSolvedMsg
    : status === Status.StepThroughSolution ? stepThroughSolutionMsg
    : status === Status.Failed ? failedMsg
    : status === Status.AlreadySolved ? alreadySolvedMsg
    : status === Status.Done ? manualIsSolved 
      ? moveIdx === numOptimalMoves 
        ? solvedOptimalMsg 
        : solvedMsg 
      : <></>
    : <></>
  ;

  return (
    <p
      style={{
        display: 'block',
        marginTop: '1rem',
        marginBottom: '1rem',
        textAlign: 'center',
        fontSize: isMobile ? '0.8rem' : '1rem',
      }}
    >
      {statusMsg}
    </p>
  );
};

export default StatusMsg;

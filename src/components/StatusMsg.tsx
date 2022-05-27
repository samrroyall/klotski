import { useMediaQuery } from '@mui/material';
import { FunctionComponent } from 'react';
import { selectBoardIsValid } from '../state/board/boardSlice';
import { Status } from '../App';
import { useAppSelector } from '../state/hooks';
import { MOBILE_CUTOFF } from '../constants';

interface Props {
  status: Status;
}

const StatusMsg: FunctionComponent<Props> = ({ status }) => {
  // State

  const boardIsValid = useAppSelector((state) => selectBoardIsValid(state));

  const moveIdx = useAppSelector((state) => state.manualSolve.moveIdx);
  const numOptimalMoves = useAppSelector((state) =>
    state.manualSolve.optimalMoves ? state.manualSolve.optimalMoves.length : null
  );
  const manualIsSolved = useAppSelector((state) => state.manualSolve.isSolved);

  const numSteps = useAppSelector((state) =>
    state.algoSolve.steps ? state.algoSolve.steps.length : null
  );
  const stepIdx = useAppSelector((state) => state.algoSolve.stepIdx);
  const algoIsSolved = useAppSelector((state) => state.algoSolve.isSolved);

  const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);

  // Styling variables

  const startMsg = <span>{isMobile ? 'Click on ' : 'Hover over '} a cell to add a block</span>;
  const doneMsg = <span>Done!</span>;
  const failedMsg = <span>No Solution Found :(</span>;
  const alreadySolvedMsg = <span>Oops! It looks like the board is already solved</span>;
  const manualBuildMsg = <span>A valid board has exactly one 2x2 block and two empty cells</span>;
  const readyToSolveMsg = <span>The board is ready to solve</span>;

  const manualSolveMsg = (
    <span>
      Current Moves: <strong>{moveIdx}</strong>
      <span style={{ marginLeft: '1rem' }}>
        Fewest Possible Moves: <strong>{numOptimalMoves}</strong>
      </span>
    </span>
  );

  const algoSolvedMsg = (
    <span>
      The optimal solution is <strong>{numSteps}</strong> steps long
    </span>
  );

  const stepThroughSolutionMsg = (
    <span>
      <strong>{numSteps ? numSteps - stepIdx - 1 : -1}</strong>/<strong>{numSteps || -1}</strong>
    </span>
  );

  const solvedMsg = (
    <span>
      You solved the board in <strong>{moveIdx}</strong> moves!
    </span>
  );

  const solvedOptimalMsg = (
    <span>
      You solved the board in <strong>{moveIdx}</strong> moves. That's the fewest moves possible!
    </span>
  );

  const getMsg = () => {
    switch (status) {
      case Status.Start:
        return startMsg;
      case Status.ManualBuild:
        return boardIsValid ? readyToSolveMsg : manualBuildMsg;
      case Status.AlgoBuild:
        return readyToSolveMsg;
      case Status.ManualSolve:
        return manualSolveMsg;
      case Status.Solved:
        return algoSolvedMsg;
      case Status.StepThroughSolution:
        return stepThroughSolutionMsg;
      case Status.Failed:
        return failedMsg;
      case Status.AlreadySolved:
        return alreadySolvedMsg;
      case Status.Done: {
        if (!manualIsSolved) return <></>;

        if (moveIdx === numOptimalMoves) return solvedOptimalMsg;
        else return solvedMsg;
      }
      default:
        return <span></span>;
    }
  };

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
      {getMsg()}
    </p>
  );
};

export default StatusMsg;

import { useMediaQuery } from '@mui/material';
import { FunctionComponent } from 'react';
import { Status } from '../App';
import { globals } from '../globals';

interface Props {
  status: Status;
  boardIsValid: boolean;
  numMoves: number;
  algoMoveIdx: number;
  manualMoveIdx: number;
}

const StatusMsg: FunctionComponent<Props> = ({
  status,
  boardIsValid,
  numMoves,
  algoMoveIdx,
  manualMoveIdx,
}) => {
  const isMobile = useMediaQuery(`(max-width:${globals.mobileCutoff}px)`);

  const startMsg = <span>{isMobile ? 'Click on ' : 'Hover over '} a cell to add a block</span>;
  const doneMsg = <span>Done!</span>;
  const failedMsg = <span>No Solution Found :(</span>;
  const alreadySolvedMsg = <span>Oops! It looks like the board is already solved</span>;
  const manualBuildMsg = <span>A valid board has exactly one 2x2 block and two empty cells</span>;
  const readyToSolveMsg = <span>The board is ready to solve</span>;

  const manualSolveMsg = (
    <span>
      Current Moves: <strong>{manualMoveIdx}</strong>
      <span style={{ marginLeft: '1rem' }}>
        Fewest Possible Moves: <strong>{numMoves}</strong>
      </span>
    </span>
  );

  const algoSolvedMsg = (
    <span>
      The optimal solution is <strong>{numMoves}</strong> steps long
    </span>
  );

  const stepThroughSolutionMsg = (
    <span>
      <strong>{numMoves - algoMoveIdx - 1}</strong>/<strong>{numMoves}</strong>
    </span>
  );

  const solvedMsg = (
    <span>
      You solved the board in <strong>{manualMoveIdx}</strong> moves!
    </span>
  );

  const solvedOptimalMsg = (
    <span>
      You solved the board in <strong>{manualMoveIdx}</strong> moves. That's the fewest moves
      possible!
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
      case Status.Done:
        return manualMoveIdx > 0
          ? manualMoveIdx === numMoves
            ? solvedOptimalMsg
            : solvedMsg
          : doneMsg;
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

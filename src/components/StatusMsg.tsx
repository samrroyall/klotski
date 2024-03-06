import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { SizeContext } from '../App';
import { selectBoardStatus } from '../features/board';
import { selectNumMoves, selectNumOptimalMoves } from '../features/manualSolve';
import { selectNumSteps, selectStepIdx } from '../features/algoSolve/selectors';
import { Status } from '../models/ui';
import { useAppSelector } from '../store';

const StatusMsg: FunctionComponent<{}> = () => {
  const { isMobile } = useContext(SizeContext);
  const [msg, setMsg] = useState<JSX.Element>(<span> </span>);

  const boardStatus = useAppSelector(selectBoardStatus);
  const numMoves = useAppSelector(selectNumMoves);
  const numOptimalMoves = useAppSelector(selectNumOptimalMoves);
  const numSteps = useAppSelector(selectNumSteps);
  const stepIdx = useAppSelector(selectStepIdx);

  const fontSize = `${isMobile ? 0.8 : 1}rem`;

  useEffect(() => {
    switch (boardStatus) {
      case Status.Start:
        setMsg(<span>{'Click on a cell to add a block'}</span>);
        break;
      case Status.Building:
        setMsg(<span>{'A valid board has exactly one 2×2 block and two empty cells'}</span>);
        break;
      case Status.ReadyToSolve:
        setMsg(<span>{'Move the 2×2 block to the red area at the bottom to win'}</span>);
        break;
      case Status.AlreadySolved:
        setMsg(<span>{'Oops! It looks like the board is already solved'}</span>);
        break;
      case Status.ManualSolving:
        setMsg(
          <>
            <span>
              {'Current Moves: '}
              <strong>{numMoves}</strong>
            </span>
            <span style={{ marginLeft: '1rem' }}>
              {'Fewest Possible Moves: '}
              <strong>{numOptimalMoves || '-'}</strong>
            </span>
          </>
        );
        break;
      case Status.AlgoSolving:
        setMsg(
          <>
            <strong>{stepIdx + 1}</strong>
            <span>{'/'}</span>
            <strong>{numSteps || '-'}</strong>
          </>
        );
        break;
      case Status.UnableToSolve:
        setMsg(<span>{'No Solution Found :('}</span>);
        break;
      default:
        setMsg(<span> </span>);
        break;
    }
  }, [boardStatus, numMoves, numOptimalMoves, numSteps, stepIdx]);

  return (
    <p
      style={{
        display: 'block',
        marginTop: 0,
        marginBottom: '0.5rem',
        minHeight: fontSize,
        textAlign: 'center',
        fontSize,
        lineHeight: 1,
      }}
    >
      {msg}
    </p>
  );
};

export default StatusMsg;

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
      case Status.AlreadySolved:
        setMsg(<span>{'The board is already solved'}</span>);
        break;
      case Status.ManualSolving:
        setMsg(
          <>
            <span>{'Current Moves: '}</span>
            <strong>{numMoves}</strong>
            <span style={{ marginLeft: '1rem' }}>{'Fewest Possible Moves: '}</span>
            <strong>{numOptimalMoves || '-'}</strong>
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
        setMsg(<span>{'The board has no solution'}</span>);
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

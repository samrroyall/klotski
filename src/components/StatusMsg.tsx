import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { SizeContext } from '../App';
import { selectBoardState } from '../features/board';
import { selectNumMoves, selectNumOptimalMoves } from '../features/manualSolve';
import { selectNumSteps, selectStepIdx } from '../features/algoSolve/selectors';
import { AppState } from '../models/ui';
import { useAppSelector } from '../store';

const StatusMsg: FunctionComponent<{}> = () => {
  const { isMobile } = useContext(SizeContext);
  const [msg, setMsg] = useState<JSX.Element>(<span> </span>);

  const boardState = useAppSelector(selectBoardState);
  const numMoves = useAppSelector(selectNumMoves);
  const numOptimalMoves = useAppSelector(selectNumOptimalMoves);
  const numSteps = useAppSelector(selectNumSteps);
  const stepIdx = useAppSelector(selectStepIdx);

  const fontSize = `${isMobile ? 0.8 : 1}rem`;

  useEffect(() => {
    switch (boardState) {
      case AppState.AlreadySolved:
        setMsg(<span>{'The board is already solved'}</span>);
        break;
      case AppState.ManualSolving:
        setMsg(
          <>
            <span>{'Current Moves: '}</span>
            <strong>{numMoves}</strong>
            <span style={{ marginLeft: '1rem' }}>{'Fewest Possible Moves: '}</span>
            <strong>{numOptimalMoves || '-'}</strong>
          </>
        );
        break;
      case AppState.AlgoSolving:
        setMsg(
          <>
            <strong>{stepIdx + 1}</strong>
            <span>{'/'}</span>
            <strong>{numSteps || '-'}</strong>
          </>
        );
        break;
      case AppState.UnableToSolve:
        setMsg(<span>{'The board has no solution'}</span>);
        break;
      default:
        setMsg(<span> </span>);
        break;
    }
  }, [boardState, numMoves, numOptimalMoves, numSteps, stepIdx]);

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

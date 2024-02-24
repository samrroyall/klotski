import { FunctionComponent, useContext } from 'react';
import { SizeContext } from '../App';
import { useAppSelector } from '../state/hooks';
import { Status } from '../state/boardSlice';

const StatusMsg: FunctionComponent<{}> = () => {
  const status = useAppSelector((state) => state.board.status);
  const moves = useAppSelector((state) => state.manualSolve.moves);
  const numOptimalMoves = useAppSelector((state) => state.manualSolve.numOptimalMoves);
  const numSteps = useAppSelector((state) => state.algoSolve.steps?.length);
  const stepIdx = useAppSelector((state) => state.algoSolve.stepIdx);

  const { isMobile } = useContext(SizeContext);
  const fontSize = `${isMobile ? 0.8 : 1}rem`;

  const msgText: { [k in Status]?: JSX.Element } = {
    start: <span>{'Click on a cell to add a block'}</span>,
    building: <span>{'A valid board has exactly one 2×2 block and two empty cells'}</span>,
    ready_to_solve: <span>{'Move the 2×2 block to the red area at the bottom to win'}</span>,
    already_solved: <span>{'Oops! It looks like the board is already solved'}</span>,
    manual_solving: (
      <>
        <span>
          {'Current Moves: '}
          <strong>{moves.length}</strong>
        </span>
        <span style={{ marginLeft: '1rem' }}>
          {'Fewest Possible Moves: '}
          <strong>{numOptimalMoves || '-'}</strong>
        </span>
      </>
    ),
    algo_solving: (
      <>
        <strong>{stepIdx + 1}</strong>
        <span>{'/'}</span>
        <strong>{numSteps || '-'}</strong>
      </>
    ),
    unable_to_solve: <span>{'No Solution Found :('}</span>,
  };

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
      {status in msgText ? msgText[status] : <span> </span>}
    </p>
  );
};

export default StatusMsg;

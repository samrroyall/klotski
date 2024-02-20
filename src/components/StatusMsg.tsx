import { FunctionComponent, useContext } from 'react';
import { SizeContext } from '../App';
import { useAppSelector } from '../state/hooks';
import { Status } from '../state/boardSlice';

const StatusMsg: FunctionComponent<{}> = () => {
  const status = useAppSelector((state) => state.board.status);
  const numMoves = useAppSelector((state) => state.manualSolve.moves.length);
  const numOptimalMoves = useAppSelector((state) => state.manualSolve.optimalMoves?.length);
  const numSteps = useAppSelector((state) => state.algoSolve.steps?.length);
  const stepIdx = useAppSelector((state) => state.algoSolve.stepIdx);

  const { isMobile } = useContext(SizeContext);

  const msgText: { [k in Status]?: JSX.Element } = {
    start: <span>Click on a cell to add a block</span>,
    building: <span>A valid board has exactly one 2×2 block and two empty cells</span>,
    ready_to_solve: <span>Move the 2×2 block to the red area at the bottom to win</span>,
    manual_solving:
      numOptimalMoves === 0 ? (
        <span>Oops! It looks like the board is already solved</span>
      ) : (
        <span>
          Current Moves: <strong>{numMoves}</strong>
          <span style={{ marginLeft: '1rem' }}>
            Fewest Possible Moves: <strong>{numOptimalMoves}</strong>
          </span>
        </span>
      ),
    algo_solving: (
      <span>
        <strong>{numSteps ? numSteps - stepIdx - 1 : -1}</strong>/<strong>{numSteps || -1}</strong>
      </span>
    ),
    solved: <span>Great job!</span>,
    solved_optimally: <span>Wow!</span>,
    unable_to_solve: <span>No Solution Found :(</span>,
  };

  return (
    <p
      style={{
        display: 'block',
        marginTop: 0,
        marginBottom: '0.5rem',
        textAlign: 'center',
        fontSize: `${isMobile ? 0.8 : 1}rem`,
        lineHeight: 1,
      }}
    >
      {status in msgText ? msgText[status] : <></>}
    </p>
  );
};

export default StatusMsg;

import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ButtonWrapper from './ButtonWrapper';
import { SizeContext } from '../App';
import { useSelector } from 'react-redux';
import { createRandomBoard, deleteBoard, selectBoardStatus, undoMoves } from '../features/board';
import { manualSolveBoard, selectNumMoves, undoMove } from '../features/manualSolve';
import {
  algoSolveBoard,
  nextStep,
  prevStep,
  selectStepIdx,
  selectSteps,
} from '../features/algoSolve';
import { Status } from '../models/ui';
import { useAppDispatch } from '../store';

const Buttons: FunctionComponent = () => {
  const dispatch = useAppDispatch();

  const [buttons, setButtons] = useState<JSX.Element>(<></>);

  const boardStatus = useSelector(selectBoardStatus);
  const numMoves = useSelector(selectNumMoves);
  const steps = useSelector(selectSteps);
  const stepIdx = useSelector(selectStepIdx);

  useEffect(() => {
    switch (boardStatus) {
      case Status.Solved:
      case Status.SolvedOptimally:
        setButtons(<ButtonWrapper title="Start Over" onClick={() => dispatch(undoMoves())} />);
        break;
      case Status.Building:
      case Status.UnableToSolve:
      case Status.AlreadySolved:
        setButtons(<ButtonWrapper title="Clear" onClick={() => dispatch(deleteBoard())} />);
        break;
      case Status.AlgoSolving:
        setButtons(
          <>
            <ButtonWrapper title="Start Over" onClick={() => dispatch(undoMoves())} />
            <ButtonWrapper
              title="Previous Step"
              onClick={() => dispatch(prevStep())}
              disabled={stepIdx < 0}
            />
            <ButtonWrapper
              title="Next Step"
              onClick={() => dispatch(nextStep())}
              disabled={!steps || stepIdx >= steps.length - 1}
            />
          </>
        );
        break;
      case Status.Start:
        setButtons(
          <ButtonWrapper
            title="Create board for me"
            onClick={() => dispatch(createRandomBoard())}
          />
        );
        break;
      case Status.ManualSolving:
        setButtons(
          <>
            <ButtonWrapper title="Start Over" onClick={() => dispatch(undoMoves())} />
            <ButtonWrapper
              title="Undo Move"
              onClick={() => dispatch(undoMove())}
              disabled={numMoves === 0}
            />
          </>
        );
        break;
      case Status.ReadyToSolve:
        setButtons(
          <>
            <ButtonWrapper title="Solve myself" onClick={() => dispatch(manualSolveBoard())} />
            <ButtonWrapper title="Clear" onClick={() => dispatch(deleteBoard())} />
            <ButtonWrapper title="Solve for me" onClick={() => dispatch(algoSolveBoard())} />
          </>
        );
        break;
      default:
        setButtons(<></>);
        break;
    }
  }, [boardStatus, numMoves, stepIdx, steps]);

  const { boardHeight } = useContext(SizeContext);
  const buttonStyling = { position: 'absolute', width: '100%', left: 0 };

  return (
    <Box
      sx={{
        ...buttonStyling,
        top: `calc(${boardHeight})`,
        marginTop: '0.5rem',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {buttons}
    </Box>
  );
};

export default Buttons;

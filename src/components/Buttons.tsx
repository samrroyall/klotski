import { FunctionComponent, useContext } from 'react';
import { Box } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import {
  decrementStep,
  incrementStep,
  init as initAlgoSolve,
  reset as resetAlgoSolve,
} from '../state/algoSolveSlice';
import {
  Status,
  reset as resetBoard,
  update as updateBoard,
  updateStatus,
} from '../state/boardSlice';
import {
  init as initManualSolve,
  reset as resetManualSolve,
  updateMoves,
} from '../state/manualSolveSlice';
import ButtonWrapper from './ButtonWrapper';
import { SizeContext } from '../App';
import { ApiService } from '../services/api';
import { Board as BoardResponse, Solve as SolveResponse } from '../models/api/response';
import { BlockMove, BoardState } from '../models/api/game';

const Buttons: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const Api = new ApiService();

  const boardId = useAppSelector((state) => state.board.id);
  const boardStatus = useAppSelector((state) => state.board.status);

  const moves = useAppSelector((state) => state.manualSolve.moves);

  const steps = useAppSelector((state) => state.algoSolve.steps);
  const stepIdx = useAppSelector((state) => state.algoSolve.stepIdx);

  const nullPromise: Promise<null> = new Promise((resolve) => resolve(null));

  const deleteBoard = (): Promise<boolean> => {
    if (boardId) {
      return Api.deleteBoard(boardId).then((response) => response !== null);
    }
    return new Promise((resolve) => resolve(false));
  };

  const solveBoard = (): Promise<SolveResponse | null> => {
    if (boardId) {
      return Api.solveBoard(boardId);
    }
    return nullPromise;
  };

  const undoMove = (): Promise<BoardResponse | null> => {
    if (boardId) {
      return Api.undoMove(boardId);
    }
    return nullPromise;
  };

  const moveBlock = (move: BlockMove): Promise<BoardResponse | null> => {
    if (boardId) {
      return Api.moveBlock(boardId, move.block_idx, move.row_diff, move.col_diff);
    }
    return nullPromise;
  };

  const onClickCreateForMe = () => {
    // const response = await Api.randomBoard();
    // if (response) {
    //   dispatch(updateBoard(response));
    // }
  };

  const onClickClear = () => {
    deleteBoard().then((response) => {
      if (response) {
        dispatch(resetBoard());
        dispatch(resetAlgoSolve());
        dispatch(resetManualSolve());
      }
    });
  };

  const onClickStartOver = () => {
    if (boardId) {
      Api.reset(boardId).then((response) => {
        if (response) {
          dispatch(updateBoard(response));
          dispatch(resetAlgoSolve());
          dispatch(resetManualSolve());
        }
      });
    }
  };

  const onClickSolveMyself = () => {
    if (boardId) {
      dispatch(updateStatus(Status.ManualSolving));

      solveBoard().then((response) => {
        if (response && response.type === 'solved') {
          if (response.moves.length === 0) {
            dispatch(updateStatus(Status.AlreadySolved));
          } else {
            dispatch(initManualSolve(response));
          }
        } else {
          dispatch(updateStatus(Status.UnableToSolve));
        }
      });
    }
  };

  const onClickUndoMove = () => {
    undoMove().then((response) => {
      if (response) {
        dispatch(updateBoard(response));
        dispatch(updateMoves(moves.slice(0, -1)));
      }
    });
  };

  const onClickSolveForMe = () => {
    if (boardId) {
      dispatch(updateStatus(Status.AlgoSolving));

      solveBoard().then((response) => {
        if (response && response.type === 'solved') {
          if (response.moves.length === 0) {
            dispatch(updateStatus(Status.AlreadySolved));
          } else {
            dispatch(initAlgoSolve(response));
          }
        } else {
          dispatch(updateStatus(Status.UnableToSolve));
        }
      });
    }
  };

  const onClickPrevStep = () => {
    undoMove().then((response) => {
      if (response) {
        dispatch(updateBoard({ ...response, state: BoardState.Solving }));
        dispatch(decrementStep());
      }
    });
  };

  const onClickNextStep = () => {
    if (steps && stepIdx < steps.length - 1) {
      moveBlock(steps[stepIdx + 1]).then((response) => {
        if (response) {
          dispatch(updateBoard({ ...response, state: BoardState.Solving }));
          dispatch(incrementStep());
        }
      });
    }
  };

  const randomizeButton = (
    <ButtonWrapper title="Create board for me" onClick={onClickCreateForMe} />
  );

  const clearButton = <ButtonWrapper title="Clear" onClick={onClickClear} />;

  const startOverButton = <ButtonWrapper title="Start Over" onClick={onClickStartOver} />;

  const readyToSolveButtons = (
    <>
      <ButtonWrapper title="Solve myself" onClick={onClickSolveMyself} />
      {clearButton}
      <ButtonWrapper title="Solve for me" onClick={onClickSolveForMe} />
    </>
  );

  const algoSolvingButtons = (
    <>
      {startOverButton}
      <ButtonWrapper title="Previous Step" onClick={onClickPrevStep} disabled={stepIdx < 0} />
      <ButtonWrapper
        title="Next Step"
        onClick={onClickNextStep}
        disabled={!steps || stepIdx >= steps.length - 1}
      />
    </>
  );

  const manualSolvingButtons = (
    <>
      {startOverButton}
      <ButtonWrapper title="Undo Move" onClick={onClickUndoMove} disabled={moves.length === 0} />
    </>
  );

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
      {[Status.Solved, Status.SolvedOptimally].includes(boardStatus) ? (
        startOverButton
      ) : [Status.Building, Status.UnableToSolve, Status.AlreadySolved].includes(boardStatus) ? (
        clearButton
      ) : boardStatus === Status.AlgoSolving ? (
        algoSolvingButtons
      ) : boardStatus === Status.Start ? (
        randomizeButton
      ) : boardStatus === Status.ManualSolving ? (
        manualSolvingButtons
      ) : boardStatus === Status.ReadyToSolve ? (
        readyToSolveButtons
      ) : (
        <></>
      )}
    </Box>
  );
};

export default Buttons;

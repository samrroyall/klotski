import { ApiService } from '../../services/api';
import { Block, BoardBlock, Position } from '../../models/api/game';
import { resetBoard, updateBoard } from '.';
import { resetAlgoSolve } from '../algoSolve';
import { resetManualSolve } from '../manualSolve';
import { createThunk } from '../../store';

const _ = require('lodash/fp');

const api = new ApiService();

export const createEmptyBoard = createThunk<void, void>(
  'board/createEmptyBoard',
  async (_, thunkAPI) =>
    api.emptyBoard().then((response) => {
      if (response) {
        thunkAPI.dispatch(updateBoard(response));
      }
    })
);

export const createRandomBoard = createThunk<void, void>(
  'board/createRandomBoard',
  async (_, thunkAPI) =>
    api.randomBoard().then((response) => {
      if (response) {
        thunkAPI.dispatch(updateBoard(response));
      }
    })
);

export const deleteBoard = createThunk<void, void>('board/deleteBoard', async (_, thunkAPI) => {
  const boardId = thunkAPI.getState().board.id;
  if (boardId) {
    thunkAPI.dispatch(resetBoard());
    thunkAPI.dispatch(resetAlgoSolve());
    thunkAPI.dispatch(resetManualSolve());

    api.deleteBoard(boardId);
  }
});

export const undoMoves = createThunk<void, void>('board/undoMoves', async (_, thunkAPI) => {
  const boardId = thunkAPI.getState().board.id;
  if (boardId) {
    api.reset(boardId).then((response) => {
      if (response) {
        thunkAPI.dispatch(updateBoard(response));
        thunkAPI.dispatch(resetAlgoSolve());
        thunkAPI.dispatch(resetManualSolve());
      }
    });
  }
});

export const addBlock = createThunk<{ block: Block; cell: Position }, void>(
  'board/addBlock',
  async (args, thunkAPI) => {
    const boardId = thunkAPI.getState().board.id;
    if (boardId) {
      api.addBlock(boardId, args.block, args.cell.row, args.cell.col).then((response) => {
        if (response) {
          thunkAPI.dispatch(updateBoard(response));
        }
      });
    }
  }
);

export const removeBlock = createThunk<BoardBlock, void>(
  'board/removeBlock',
  async (block, thunkAPI) => {
    const boardId = thunkAPI.getState().board.id;
    if (boardId) {
      api.removeBlock(boardId, block.idx).then((response) => {
        if (response) {
          thunkAPI.dispatch(updateBoard(response));
        }
      });
    }
  }
);

export const changeBlock = createThunk<
  { idx: number; newBlock: Block; minPosition: Position },
  void
>('board/changeBlock', async (args, thunkAPI): Promise<void> => {
  const boardId = thunkAPI.getState().board.id;
  if (boardId) {
    const oldBlock = thunkAPI.getState().board.blocks[args.idx];

    if (!_.isEqual(oldBlock.min_position, args.minPosition)) {
      await api.removeBlock(boardId, args.idx).then((response) => {
        if (response) {
          thunkAPI.dispatch(updateBoard(response));
        }
      });

      api
        .addBlock(boardId, args.newBlock, args.minPosition.row, args.minPosition.col)
        .then((response) => {
          if (response) {
            thunkAPI.dispatch(updateBoard(response));
          }
        });
    } else {
      api.changeBlock(boardId, args.idx, args.newBlock).then((response) => {
        if (response) {
          thunkAPI.dispatch(updateBoard(response));
        }
      });
    }
  }
});

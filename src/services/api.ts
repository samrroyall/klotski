import axios, { AxiosRequestConfig, Method } from 'axios';
import {
  AddBlock as AddBlockRequest,
  AlterBlock as AlterBlockRequest,
  AlterBoard as AlterBoardRequest,
  NewBoard as NewBoardRequest,
} from '../models/api/request';
import { Board as BoardResponse, Solve as SolveResponse } from '../models/api/response';
import { Block, BoardState } from '../models/api/game';

import * as Sentry from '@sentry/react';

export class ApiService {
  baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL! + '/api';
  }

  private makeRequest<T, U>(method: Method, path: string, data?: T): Promise<U | null> {
    const request: AxiosRequestConfig<T> = {
      method,
      url: `${this.baseUrl}${path}`,
      data,
    };

    return axios
      .request(request)
      .then((response) => response.data as U)
      .catch((err) => {
        Sentry.captureException(err);
        return null;
      });
  }

  newBoard(body: NewBoardRequest): Promise<BoardResponse | null> {
    return this.makeRequest<NewBoardRequest, BoardResponse>('POST', '/board', body);
  }

  emptyBoard(): Promise<BoardResponse | null> {
    return this.newBoard({ type: 'empty' });
  }

  randomBoard(): Promise<BoardResponse | null> {
    return this.newBoard({ type: 'random' });
  }

  private alterBoard(boardId: number, body: AlterBoardRequest): Promise<BoardResponse | null> {
    return this.makeRequest<AlterBoardRequest, BoardResponse>('PUT', `/board/${boardId}`, body);
  }

  changeBoardState(boardId: number, new_state: BoardState): Promise<BoardResponse | null> {
    return this.alterBoard(boardId, { type: 'change_state', new_state });
  }

  undoMove(boardId: number): Promise<BoardResponse | null> {
    return this.alterBoard(boardId, { type: 'undo_move' });
  }

  reset(boardId: number): Promise<BoardResponse | null> {
    return this.alterBoard(boardId, { type: 'reset' });
  }

  deleteBoard(boardId: number): Promise<{} | null> {
    return this.makeRequest<undefined, {}>('DELETE', `/board/${boardId}`);
  }

  solveBoard(boardId: number): Promise<SolveResponse | null> {
    return this.makeRequest<undefined, SolveResponse>('POST', `/board/${boardId}/solve`);
  }

  addBlock(
    boardId: number,
    block: Block,
    minRow: number,
    minCol: number
  ): Promise<BoardResponse | null> {
    return this.makeRequest<AddBlockRequest, BoardResponse>('POST', `/board/${boardId}/block`, {
      block,
      min_row: minRow,
      min_col: minCol,
    });
  }

  private alterBlock(
    boardId: number,
    blockIdx: number,
    body: AlterBlockRequest
  ): Promise<BoardResponse | null> {
    return this.makeRequest<AlterBlockRequest, BoardResponse>(
      'PUT',
      `/board/${boardId}/block/${blockIdx}`,
      body
    );
  }

  changeBlock(boardId: number, blockIdx: number, newBlock: Block): Promise<BoardResponse | null> {
    return this.alterBlock(boardId, blockIdx, {
      type: 'change_block',
      new_block: newBlock,
    });
  }

  moveBlock(
    boardId: number,
    blockIdx: number,
    rowDiff: number,
    colDiff: number
  ): Promise<BoardResponse | null> {
    return this.alterBlock(boardId, blockIdx, {
      type: 'move_block',
      row_diff: rowDiff,
      col_diff: colDiff,
    });
  }

  removeBlock(boardId: number, blockIdx: number): Promise<BoardResponse | null> {
    return this.makeRequest<undefined, BoardResponse>(
      'DELETE',
      `/board/${boardId}/block/${blockIdx}`
    );
  }
}

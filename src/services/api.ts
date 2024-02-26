import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import {
  AddBlock as AddBlockRequest,
  AlterBlock as AlterBlockRequest,
  AlterBoard as AlterBoardRequest,
} from '../models/api/request';
import { Board as BoardResponse, Solve as SolveResponse } from '../models/api/response';
import { Block, BoardState } from '../models/api/game';

export class ApiService {
  baseUrl: string;

  constructor(baseUrl: string = 'http://127.0.0.1:8081/api') {
    this.baseUrl = baseUrl;
  }

  private handleError(err: Error | AxiosError): void {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError;

      if (axiosError.response) {
        const response: AxiosResponse = axiosError.response;

        switch (response.status) {
          case 400:
            //console.error(`Received HTTP 400 BadRequest response from API: ${response.data}`);
            return;
          case 404:
            //console.error(`Received HTTP 404 NotFound response from API: ${response.data}`);
            return;
          case 405:
            //console.warn(`Received HTTP 405 NotAllowed response from API: ${response.data}`);
            return;
          default:
            //console.error(
            //  `Received HTTP ${response.status} Unhandled response from API: ${response.data}`
            //);
            return;
        }
      } else if (axiosError.request) {
        //console.log(axiosError);
        //const request: ClientRequest = axiosError.request;

        //console.error(
        //  `Request ${request.method} '${request.path}' did not recieve response from API`
        //);
        return;
      } else {
        //console.error(`Unknown Error occurred: ${axiosError.message}`);
        return;
      }
    } else {
      //console.error(`Unknown Error occurred: ${err.message}`);
      return;
    }
  }

  private makeRequest<T, U>(method: Method, path: string, data?: T): Promise<U | null> {
    const request: AxiosRequestConfig<T> = {
      method,
      url: `${this.baseUrl}${path}`,
      data,
    };

    return axios
      .request(request)
      .then((response) => {
        return response.data as U;
      })
      .catch((err) => {
        this.handleError(err as AxiosError | Error);
        return null;
      });
  }

  newBoard(): Promise<BoardResponse | null> {
    return this.makeRequest<undefined, BoardResponse>('POST', '/board');
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

import { AxiosError, AxiosResponse, Method } from 'axios';
import {
  AddBlock as AddBlockRequest,
  AlterBlock as AlterBlockRequest,
  AlterBoard as AlterBoardRequest,
  ChangeBlock as ChangeBlockRequest,
  ChangeState as ChangeBoardStateRequest,
  MoveBlock as MoveBlockRequest,
  UndoMove as UndoMoveRequest,
} from '../models/api/request';
import { Board as BoardResponse, Solve as SolveResponse } from '../models/api/response';
const axios = require('axios');

export class ApiService {
  baseUrl: string;

  constructor(baseUrl: string = 'https://localhost:3000/api') {
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
            // console.error(
            //   `Received HTTP ${response.status} Unhandled response from API: ${response.data}`
            // );
            return;
        }
      } else if (axiosError.request) {
        // const request: ClientRequest = axiosError.request;

        // console.error(
        //   `Request ${request.method} '${request.path}' did not recieve response from API`
        // );
        return;
      } else {
        // console.error(`Unknown Error occurred: ${axiosError.message}`);
        return;
      }
    } else {
      // console.error(`Unknown Error occurred: ${err.message}`);
      return;
    }
  }

  private handleResponse<T>(axiosResponse: AxiosResponse): T {
    // console.debug(`Recieved the following data from API: ${axiosResponse.data}`);

    return JSON.parse(axiosResponse.data) as T;
  }

  private async makeRequest<T, U>(method: Method, url: string, body?: T): Promise<U | null> {
    try {
      const response: AxiosResponse = await axios.request({
        method,
        url,
        body,
      });

      return this.handleResponse<U>(response);
    } catch (err) {
      this.handleError(err as AxiosError | Error);
      return null;
    }
  }

  async newBoard(): Promise<BoardResponse | null> {
    const url = `${this.baseUrl}/board`;
    return this.makeRequest<undefined, BoardResponse>('POST', url);
  }

  private async alterBoard(
    boardId: number,
    body: AlterBoardRequest
  ): Promise<BoardResponse | null> {
    const url = `${this.baseUrl}/board/${boardId}`;
    return this.makeRequest<AlterBoardRequest, BoardResponse>('PUT', url, body);
  }

  changeBoardState(boardId: number, body: ChangeBoardStateRequest): Promise<BoardResponse | null> {
    return this.alterBoard(boardId, body);
  }

  undoMove(boardId: number, body: UndoMoveRequest): Promise<BoardResponse | null> {
    return this.alterBoard(boardId, body);
  }

  deleteBoard(boardId: number): Promise<{} | null> {
    const url = `${this.baseUrl}/board/${boardId}`;
    return this.makeRequest<undefined, {}>('DELETE', url);
  }

  solveBoard(boardId: number): Promise<SolveResponse | null> {
    const url = `${this.baseUrl}/board/${boardId}/solve`;
    return this.makeRequest<undefined, SolveResponse>('POST', url);
  }

  addBlock(boardId: number, body: AddBlockRequest): Promise<BoardResponse | null> {
    const url = `${this.baseUrl}/board/${boardId}/block`;
    return this.makeRequest<AddBlockRequest, BoardResponse>('POST', url, body);
  }

  private alterBlock(
    boardId: number,
    blockIdx: number,
    body: AlterBlockRequest
  ): Promise<BoardResponse | null> {
    const url = `${this.baseUrl}/board/${boardId}/block/${blockIdx}`;
    return this.makeRequest<AlterBlockRequest, BoardResponse>('PUT', url, body);
  }

  changeBlock(
    boardId: number,
    blockIdx: number,
    body: ChangeBlockRequest
  ): Promise<BoardResponse | null> {
    return this.alterBlock(boardId, blockIdx, body);
  }

  moveBlock(
    boardId: number,
    blockIdx: number,
    body: MoveBlockRequest
  ): Promise<BoardResponse | null> {
    return this.alterBlock(boardId, blockIdx, body);
  }

  removeBlock(boardId: number, blockIdx: number): Promise<BoardResponse | null> {
    const url = `${this.baseUrl}/board/${boardId}/block/${blockIdx}`;
    return this.makeRequest<undefined, BoardResponse>('DELETE', url);
  }
}

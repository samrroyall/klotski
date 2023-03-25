import { addBlock } from './global';
import { Board, solveBoard } from './Solver';

// Board 1 - famous klotski board
it('board 1 - solution has length 1', () => {
  const board = new Board();
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 0, col: 0 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 0, col: 1 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 0, col: 2 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 0, col: 3 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 2, col: 0 } });
  addBlock(board, { block: { rows: 2, cols: 2 }, pos: { row: 2, col: 1 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 2, col: 3 } });
  addBlock(board, { block: { rows: 1, cols: 1 }, pos: { row: 4, col: 0 } });
  addBlock(board, { block: { rows: 1, cols: 1 }, pos: { row: 4, col: 3 } });

  const moves = solveBoard(board);
  expect(moves).not.toBeNull();
  expect(moves).toHaveLength(1);
});

// Board 2 - famous klotski board
it('board 2 - solution has length 81', () => {
  const board = new Board();
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 0, col: 0 } });
  addBlock(board, { block: { rows: 2, cols: 2 }, pos: { row: 0, col: 1 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 0, col: 3 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 2, col: 0 } });
  addBlock(board, { block: { rows: 1, cols: 2 }, pos: { row: 2, col: 1 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 2, col: 3 } });
  addBlock(board, { block: { rows: 1, cols: 1 }, pos: { row: 3, col: 1 } });
  addBlock(board, { block: { rows: 1, cols: 1 }, pos: { row: 3, col: 2 } });
  addBlock(board, { block: { rows: 1, cols: 1 }, pos: { row: 4, col: 0 } });
  addBlock(board, { block: { rows: 1, cols: 1 }, pos: { row: 4, col: 3 } });

  const moves = solveBoard(board);
  expect(moves).not.toBeNull();
  expect(moves).toHaveLength(81);
});

// Board 3 - already solved
it('board 3 - already solved', () => {
  const board = new Board();
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 0, col: 0 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 0, col: 1 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 0, col: 2 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 0, col: 3 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 2, col: 0 } });
  addBlock(board, { block: { rows: 1, cols: 2 }, pos: { row: 2, col: 1 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 2, col: 3 } });
  addBlock(board, { block: { rows: 2, cols: 2 }, pos: { row: 3, col: 1 } });

  const moves = solveBoard(board);
  expect(moves).not.toBeNull();
  expect(moves).toHaveLength(0);
});

// Board 4 - no possible solution
it('board 4 - no possible solution', () => {
  const board = new Board();
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 0, col: 0 } });
  addBlock(board, { block: { rows: 2, cols: 2 }, pos: { row: 0, col: 1 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 0, col: 3 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 2, col: 0 } });
  addBlock(board, { block: { rows: 1, cols: 2 }, pos: { row: 2, col: 1 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 2, col: 3 } });
  addBlock(board, { block: { rows: 1, cols: 2 }, pos: { row: 3, col: 1 } });
  addBlock(board, { block: { rows: 1, cols: 1 }, pos: { row: 4, col: 0 } });
  addBlock(board, { block: { rows: 1, cols: 1 }, pos: { row: 4, col: 3 } });

  const moves = solveBoard(board);
  expect(moves).toBeNull();
});

// Board 5 - difficult solution
it('board 5 - solution has length 120', () => {
  const board = new Board();
  addBlock(board, { block: { rows: 1, cols: 1 }, pos: { row: 0, col: 0 } });
  addBlock(board, { block: { rows: 2, cols: 2 }, pos: { row: 0, col: 1 } });
  addBlock(board, { block: { rows: 1, cols: 1 }, pos: { row: 0, col: 3 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 1, col: 0 } });
  addBlock(board, { block: { rows: 2, cols: 1 }, pos: { row: 1, col: 3 } });
  addBlock(board, { block: { rows: 1, cols: 2 }, pos: { row: 2, col: 1 } });
  addBlock(board, { block: { rows: 1, cols: 1 }, pos: { row: 3, col: 0 } });
  addBlock(board, { block: { rows: 1, cols: 2 }, pos: { row: 3, col: 1 } });
  addBlock(board, { block: { rows: 1, cols: 1 }, pos: { row: 3, col: 3 } });
  addBlock(board, { block: { rows: 1, cols: 2 }, pos: { row: 4, col: 1 } });

  const moves = solveBoard(board);
  expect(moves).not.toBeNull();
  expect(moves).toHaveLength(120);
});

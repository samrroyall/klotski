import { Block } from "./Block"
import { Board } from "./Board"
import { PositionedBlock } from "./PositionedBlock"
import { solveBoard } from "./Solver";

// Board 1 - famous klotski board
const boardOne = new Board()
boardOne.setBlocks([
	new PositionedBlock(Block.TWO_BY_ONE, { row: 0, col: 0 }),
	new PositionedBlock(Block.TWO_BY_TWO, { row: 0, col: 1 }),
	new PositionedBlock(Block.TWO_BY_ONE, { row: 0, col: 3 }),
	new PositionedBlock(Block.TWO_BY_ONE, { row: 2, col: 0 }),
	new PositionedBlock(Block.ONE_BY_TWO, { row: 2, col: 1 }),
	new PositionedBlock(Block.TWO_BY_ONE, { row: 2, col: 3 }),
	new PositionedBlock(Block.ONE_BY_ONE, { row: 3, col: 1 }),
	new PositionedBlock(Block.ONE_BY_ONE, { row: 3, col: 2 }),
	new PositionedBlock(Block.ONE_BY_ONE, { row: 4, col: 0 }),
	new PositionedBlock(Block.ONE_BY_ONE, { row: 4, col: 3 }),
]);
boardOne.setGrid([
	[2,4,4,2],
	[2,4,4,2],
	[2,3,3,2],
	[2,1,1,2],
	[1,0,0,1],
]);

it("board 1 - solution has length 81", () => {
	const moves = solveBoard(boardOne);
	expect(moves).not.toBeNull();
	expect(moves).toHaveLength(81);
});

// Board 2 - already solved
const boardTwo = new Board()
boardTwo.setBlocks([
	new PositionedBlock(Block.TWO_BY_ONE, { row: 0, col: 0 }),
	new PositionedBlock(Block.TWO_BY_ONE, { row: 0, col: 1 }),
	new PositionedBlock(Block.TWO_BY_ONE, { row: 0, col: 2 }),
	new PositionedBlock(Block.TWO_BY_ONE, { row: 0, col: 3 }),
	new PositionedBlock(Block.TWO_BY_ONE, { row: 2, col: 0 }),
	new PositionedBlock(Block.ONE_BY_ONE, { row: 2, col: 1 }),
	new PositionedBlock(Block.ONE_BY_ONE, { row: 2, col: 2 }),
	new PositionedBlock(Block.TWO_BY_ONE, { row: 2, col: 3 }),
	new PositionedBlock(Block.TWO_BY_TWO, { row: 3, col: 1 }),
]);
boardTwo.setGrid([
	[2,2,2,2],
	[2,2,2,2],
	[2,1,1,2],
	[2,4,4,2],
	[0,4,4,0],
]);

it("board 2 - already solved", () => {
	const moves = solveBoard(boardTwo);
	expect(moves).not.toBeNull();
	expect(moves).toHaveLength(0);
});

// Board 3 - no possible solution
const boardThree = new Board()
boardThree.setBlocks([
	new PositionedBlock(Block.TWO_BY_ONE, { row: 0, col: 0 }),
	new PositionedBlock(Block.TWO_BY_TWO, { row: 0, col: 1 }),
	new PositionedBlock(Block.TWO_BY_ONE, { row: 0, col: 3 }),
	new PositionedBlock(Block.TWO_BY_ONE, { row: 2, col: 0 }),
	new PositionedBlock(Block.ONE_BY_TWO, { row: 2, col: 1 }),
	new PositionedBlock(Block.TWO_BY_ONE, { row: 2, col: 3 }),
	new PositionedBlock(Block.ONE_BY_TWO, { row: 3, col: 1 }),
	new PositionedBlock(Block.ONE_BY_ONE, { row: 4, col: 0 }),
	new PositionedBlock(Block.ONE_BY_ONE, { row: 4, col: 3 }),
]);
boardThree.setGrid([
	[2,4,4,2],
	[2,4,4,2],
	[2,3,3,2],
	[2,3,3,2],
	[1,0,0,1],
]);

it("board 3 - no possible solution", () => {
	const moves = solveBoard(boardThree);
	expect(moves).toBeNull();
});

// Board 4 - difficult solution
const boardFour = new Board()
boardFour.setBlocks([
	new PositionedBlock(Block.ONE_BY_ONE, { row: 0, col: 0 }),
	new PositionedBlock(Block.TWO_BY_TWO, { row: 0, col: 1 }),
	new PositionedBlock(Block.ONE_BY_ONE, { row: 0, col: 3 }),
	new PositionedBlock(Block.TWO_BY_ONE, { row: 1, col: 0 }),
	new PositionedBlock(Block.TWO_BY_ONE, { row: 1, col: 3 }),
	new PositionedBlock(Block.ONE_BY_TWO, { row: 2, col: 1 }),
	new PositionedBlock(Block.ONE_BY_ONE, { row: 3, col: 0 }),
	new PositionedBlock(Block.ONE_BY_TWO, { row: 3, col: 1 }),
	new PositionedBlock(Block.ONE_BY_ONE, { row: 3, col: 3 }),
	new PositionedBlock(Block.ONE_BY_TWO, { row: 4, col: 1 }),
]);
boardFour.setGrid([
	[1,4,4,1],
	[2,4,4,2],
	[2,3,3,2],
	[1,3,3,1],
	[0,3,3,0],
]);

it("board 4 - solution has length 120", () => {
	const moves = solveBoard(boardFour);
	expect(moves).not.toBeNull();
	expect(moves).toHaveLength(120);
});
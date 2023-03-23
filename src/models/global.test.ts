import * as global from "./global";
import { Block, Dir, Grid, Move, PosBlock } from "./global";
import { Board } from "./Solver";
const md5 = require('md5');

// Dir tests

it("getOppositeDir works as expected", () => {
	expect(global.getOppositeDir(Dir.Left)).toEqual(Dir.Right);
	expect(global.getOppositeDir(Dir.Right)).toEqual(Dir.Left);
	expect(global.getOppositeDir(Dir.Up)).toEqual(Dir.Down);
	expect(global.getOppositeDir(Dir.Down)).toEqual(Dir.Up);
});

// Pos tests

it("getNewPosFromDir works as expected", () => {
	const pos = {row: 1, col: 1};
	const leftPos = global.getNewPosFromDir(pos, Dir.Left);
	expect(leftPos.row).toEqual(1);
	expect(leftPos.col).toEqual(0);
	const rightPos = global.getNewPosFromDir(pos, Dir.Right);
	expect(rightPos.row).toEqual(1);
	expect(rightPos.col).toEqual(2);
	const upPos = global.getNewPosFromDir(pos, Dir.Up);
	expect(upPos.row).toEqual(0);
	expect(upPos.col).toEqual(1);
	const downPos = global.getNewPosFromDir(pos, Dir.Down);
	expect(downPos.row).toEqual(2);
	expect(downPos.col).toEqual(1);
});

// Block tests

it("blockToInt works as expected", () => {
	expect(global.blockToInt({rows: 1, cols: 1})).toEqual(1);
	expect(global.blockToInt({rows: 2, cols: 1})).toEqual(2);
	expect(global.blockToInt({rows: 1, cols: 2})).toEqual(3);
	expect(global.blockToInt({rows: 2, cols: 2})).toEqual(4);
});

// PosBlock tests

it("getMinPos and getMaxPos work as expected", () => {
	const pb: PosBlock = {block: {rows: 2, cols: 2}, pos: {row: 0, col: 0}};
	const [{row: minRow, col: minCol}, {row: maxRow, col: maxCol}] = [global.getMinPos(pb), global.getMaxPos(pb)];
	expect(minRow).toEqual(0);
	expect(minCol).toEqual(0);
	expect(maxRow).toEqual(1);
	expect(maxCol).toEqual(1);
});

it("posBlocksEqual works as expected", () => {
	const pb1: PosBlock = {block: {rows: 1, cols: 2}, pos: {row: 0, col: 1}};
	const pb2: PosBlock = {block: {rows: 2, cols: 2}, pos: {row: 0, col: 1}};
	const pb3: PosBlock = {block: {rows: 1, cols: 2}, pos: {row: 1, col: 1}};
	expect(global.posBlocksEqual(pb1, {...pb1})).toEqual(true);
	expect(global.posBlocksEqual(pb1, pb2)).toEqual(false);
	expect(global.posBlocksEqual(pb1, pb3)).toEqual(false);
});

it("blockIsOutOfBounds works as expected", () => {
	const pb1: PosBlock = {block: {rows: 1, cols: 2}, pos: {row: -1, col: 1}};
	const pb2: PosBlock = {block: {rows: 1, cols: 2}, pos: {row: 0, col: -1}};
	const pb3: PosBlock = {block: {rows: 2, cols: 1}, pos: {row: 4, col: 1}};
	const pb4: PosBlock = {block: {rows: 1, cols: 2}, pos: {row: 0, col: 3}};
	const pb5: PosBlock = {block: {rows: 2, cols: 1}, pos: {row: 0, col: 2}};
	expect(global.blockIsOutOfBounds(pb1)).toEqual(true);
	expect(global.blockIsOutOfBounds(pb2)).toEqual(true);
	expect(global.blockIsOutOfBounds(pb3)).toEqual(true);
	expect(global.blockIsOutOfBounds(pb4)).toEqual(true);
	expect(global.blockIsOutOfBounds(pb5)).toEqual(false);
});

// Move tests

it("getOppositeMove works as expected", () => {
	const move: Move = {
		block: {rows: 1, cols: 1},
		pos: {row: 1, col: 1},
		dirs: [Dir.Down, Dir.Right],
	}
	const {block: oppositeBlock, pos: oppositePos, dirs: oppositeDirs} = global.getOppositeMove(move);
	expect(oppositeBlock.rows).toEqual(1);
	expect(oppositeBlock.cols).toEqual(1);
	expect(oppositePos.row).toEqual(2);
	expect(oppositePos.col).toEqual(2);
	expect(oppositeDirs[0]).toEqual(Dir.Left);
	expect(oppositeDirs[1]).toEqual(Dir.Up);
})

// Grid tests

const testGrid: Grid = [
	[2,4,4,2],
	[2,4,4,2],
	[2,3,3,2],
	[2,1,1,2],
	[1,0,0,1],
];

const nonMd5GridHash = (grid: Grid): string => (
	grid.map((row) => row.reduce((acc, cell) => `${acc}${cell}`, '')).join('')
);

it("getGridHash works as expected", () => {
	expect(nonMd5GridHash(testGrid)).toEqual("24422442233221121001");
	expect(global.getGridHash(testGrid)).toEqual(md5("24422442233221121001"));
})

it("removeBlockFromGrid and addBlockToGrid work as expected", () => {
	const pb: PosBlock = {block: {rows: 2, cols: 2}, pos: {row: 0, col: 1}}
	global.removeBlockFromGrid(testGrid, pb);
	expect(nonMd5GridHash(testGrid)).toEqual("20022002233221121001");
	global.addBlockToGrid(testGrid, pb);
	expect(nonMd5GridHash(testGrid)).toEqual("24422442233221121001");
});

it("blockOverlapsOtherBlock works as expected", () => {
	const pb1: PosBlock = {block: {rows: 1, cols: 2}, pos: {row: 4, col: 1}};
	const pb2: PosBlock = {block: {rows: 2, cols: 1}, pos: {row: 3, col: 1}};
	expect(global.blockOverlapsOtherBlock(testGrid, pb1)).toEqual(false);
	expect(global.blockOverlapsOtherBlock(testGrid, pb2)).toEqual(true);
});

// Board tests

it("addBlock, moveBlock, and removeBlock work as expected", () => {
	const blankBoard = new Board();
	const pb: PosBlock = {block: {rows: 2, cols: 2}, pos: {row: 0, col: 0}};
	global.addBlock(blankBoard, pb);
	expect(blankBoard.blocks).toHaveLength(1);
	expect(nonMd5GridHash(blankBoard.grid)).toEqual("44004400000000000000")
	global.moveBlock(blankBoard, pb, {row: 1, col: 1});
	expect(blankBoard.blocks[0].pos.col).toEqual(1);
	expect(blankBoard.blocks[0].pos.row).toEqual(1);
	expect(nonMd5GridHash(blankBoard.grid)).toEqual("00000440044000000000")
	global.removeBlock(blankBoard, {...pb, pos: {row: 1, col: 1}});
	expect(nonMd5GridHash(blankBoard.grid)).toEqual("00000000000000000000")
	expect(blankBoard.blocks).toHaveLength(0);
});

it("allValidMoves works as expected", () => {
	const board = new Board()
	global.addBlock(board, {block: {rows: 2, cols: 1}, pos: { row: 0, col: 0 }});
	global.addBlock(board, {block: {rows: 2, cols: 2}, pos: { row: 0, col: 1 }});
	global.addBlock(board, {block: {rows: 2, cols: 1}, pos: { row: 0, col: 3 }});
	global.addBlock(board, {block: {rows: 2, cols: 1}, pos: { row: 2, col: 0 }});
	global.addBlock(board, {block: {rows: 1, cols: 2}, pos: { row: 2, col: 1 }});
	global.addBlock(board, {block: {rows: 2, cols: 1}, pos: { row: 2, col: 3 }});
	global.addBlock(board, {block: {rows: 1, cols: 2}, pos: { row: 3, col: 1 }});
	global.addBlock(board, {block: {rows: 1, cols: 1}, pos: { row: 4, col: 0 }});
	global.addBlock(board, {block: {rows: 1, cols: 1}, pos: { row: 4, col: 3 }});

	const validMoves = global.allValidMoves(board);
	const one_by_one: Block = {rows: 1, cols: 1};
	const one_by_two: Block = {rows: 1, cols: 2};
	const m1 = {block: one_by_one, pos: {row: 4, col: 0}, dirs: [Dir.Right]};
	const m2 = {...m1, dirs: [Dir.Right, Dir.Right]};
	const m3 = {block: one_by_one, pos: {row: 4, col: 3}, dirs: [Dir.Left]};
	const m4 = {...m3, dirs: [Dir.Left, Dir.Left]};
	const m5 = {block: one_by_two, pos: {row: 3, col: 1}, dirs: [Dir.Down]};
	expect(validMoves).toHaveLength(5);
	expect(global.hasMove(validMoves, m1)).toEqual(true);
	expect(global.hasMove(validMoves, m2)).toEqual(true);
	expect(global.hasMove(validMoves, m3)).toEqual(true);
	expect(global.hasMove(validMoves, m4)).toEqual(true);
	expect(global.hasMove(validMoves, m5)).toEqual(true);
	global.addBlock(board, {block: {rows: 1, cols: 2}, pos: { row: 4, col: 1 }});
	const validMoves2 = global.allValidMoves(board);
	expect(validMoves2).toHaveLength(0);
});

it("availablePositionsForBlock works as expected", () => {
	const board = new Board()
	global.addBlock(board, {block: {rows: 2, cols: 1}, pos: { row: 0, col: 0 }});
	global.addBlock(board, {block: {rows: 2, cols: 2}, pos: { row: 0, col: 1 }});
	global.addBlock(board, {block: {rows: 2, cols: 1}, pos: { row: 0, col: 3 }});
	global.addBlock(board, {block: {rows: 2, cols: 1}, pos: { row: 2, col: 0 }});
	global.addBlock(board, {block: {rows: 1, cols: 2}, pos: { row: 2, col: 1 }});
	global.addBlock(board, {block: {rows: 2, cols: 1}, pos: { row: 2, col: 3 }});
	global.addBlock(board, {block: {rows: 1, cols: 1}, pos: { row: 3, col: 1 }});
	global.addBlock(board, {block: {rows: 1, cols: 1}, pos: { row: 4, col: 0 }});
	global.addBlock(board, {block: {rows: 1, cols: 1}, pos: { row: 4, col: 3 }});

	const pb: PosBlock = {block: {rows: 1, cols: 1}, pos: {row: 3, col: 1}};
	const availablePositions = global.availablePositionsForBlock(board, pb);
	expect(availablePositions).toHaveLength(3);
	expect(global.hasPos(availablePositions, {row: 3, col: 2})).toEqual(true);
	expect(global.hasPos(availablePositions, {row: 4, col: 1})).toEqual(true);
	expect(global.hasPos(availablePositions, {row: 4, col: 2})).toEqual(true);
	expect(global.hasPos(availablePositions, {row: 3, col: 1})).toEqual(false);
});

it("boardIsValid works as expected", () => {
	const board = new Board();
	global.addBlock(board, {block: {rows: 2, cols: 1}, pos: { row: 0, col: 0 }});
	global.addBlock(board, {block: {rows: 2, cols: 2}, pos: { row: 0, col: 1 }});
	global.addBlock(board, {block: {rows: 2, cols: 1}, pos: { row: 0, col: 3 }});
	global.addBlock(board, {block: {rows: 2, cols: 1}, pos: { row: 2, col: 0 }});
	const firstOneByTwo: PosBlock = {block: {rows: 1, cols: 2}, pos: { row: 2, col: 1 }};
	global.addBlock(board, firstOneByTwo);
	global.addBlock(board, {block: {rows: 2, cols: 1}, pos: { row: 2, col: 3 }});
	const secondOneByTwo: PosBlock = {block: {rows: 1, cols: 2}, pos: { row: 3, col: 1 }};
	global.addBlock(board, secondOneByTwo);
	global.addBlock(board, {block: {rows: 1, cols: 1}, pos: { row: 4, col: 0 }});
	global.addBlock(board, {block: {rows: 1, cols: 1}, pos: { row: 4, col: 3 }});
	expect(global.boardIsValid(board)).toEqual(true);
	const extraOneByOne: PosBlock = {block: {rows: 1, cols: 1}, pos: { row: 4, col: 1 }};
	global.addBlock(board, extraOneByOne);
	expect(global.boardIsValid(board)).toEqual(false);
	const extraTwoByTwo: PosBlock = {block: {rows: 2, cols: 2}, pos: { row: 2, col: 1 }};
	global.removeBlock(board, extraOneByOne);
	global.removeBlock(board, firstOneByTwo);
	global.removeBlock(board, secondOneByTwo);
	global.addBlock(board, extraTwoByTwo);
	expect(global.boardIsValid(board)).toEqual(false);
});

it("boardIsSolved works as expected", () => {
	const board = new Board();
	global.addBlock(board, {block: {rows: 2, cols: 1}, pos: { row: 0, col: 0 }});
	const twoByTwo: PosBlock = {block: {rows: 2, cols: 2}, pos: { row: 0, col: 1 }}
	global.addBlock(board, twoByTwo);
	global.addBlock(board, {block: {rows: 2, cols: 1}, pos: { row: 0, col: 3 }});
	global.addBlock(board, {block: {rows: 2, cols: 1}, pos: { row: 2, col: 0 }});
	global.addBlock(board, {block: {rows: 1, cols: 2}, pos: { row: 2, col: 1 }});
	global.addBlock(board, {block: {rows: 2, cols: 1}, pos: { row: 2, col: 3 }});
	const secondOneByTwo: PosBlock = {block: {rows: 1, cols: 2}, pos: { row: 3, col: 1 }};
	global.addBlock(board, secondOneByTwo);
	global.addBlock(board, {block: {rows: 1, cols: 1}, pos: { row: 4, col: 0 }});
	global.addBlock(board, {block: {rows: 1, cols: 1}, pos: { row: 4, col: 3 }});
	expect(global.boardIsSolved(board)).toEqual(false);
	global.removeBlock(board, secondOneByTwo);
	global.moveBlock(board, twoByTwo, {row: 3, col: 1});
	global.addBlock(board, {...secondOneByTwo, pos: {row: 0, col: 1}});
	expect(global.boardIsSolved(board)).toEqual(true);
});

// Random Board tests

it("getRandomBoard creates valid boards", () => {
	for (let i = 0; i < 5; i++) {
		const board = global.getRandomBoard();
		expect(global.boardIsValid(board)).toEqual(true);
	}
});

it("getRandomBoard creates solvable boards", () => {
	for (let _ = 0; _ < 3; _++) {
		const board = global.getRandomBoard();
		const moves = global.solveBoard(board);
		expect(moves).not.toBeNull();
		expect(moves!.length).toBeGreaterThan(0);
	}
});
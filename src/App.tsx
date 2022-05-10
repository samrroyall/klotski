import { FunctionComponent, useState } from 'react';
import { Box } from '@mui/material';
import { Block } from './models/Block';
import { isSamePositionedBlock, PositionedBlock, Pos } from './models/PositionedBlock';
import { Board, Move } from './models/Board';
import BoardUI from './components/BoardUI';
import Buttons from './components/Buttons';

export enum Status {
  Start,
  ManualBuild,
  AlgoBuild,
  ReadyToSolve,
  ManualSolve,
  AlgoSolve,
  Solved,
  StepThroughSolution,
  SimulateSolution,
  Done,
}

interface Props {}

const App: FunctionComponent<Props> = () => {
  const [status, setStatus] = useState(Status.Start);

  const initialBlocks: PositionedBlock[] = [];
  const [blocks, setBlocks] = useState(initialBlocks);

  const [board, _] = useState(new Board());

  const moveBlock = (move: Move) => {
    const movePosBlock = new PositionedBlock(move.block, move.pos);
    for (let i = 0; i < blocks.length; i++) {
      if (!isSamePositionedBlock(blocks[i], movePosBlock)) continue;

      setBlocks(blocks.slice(0, i).concat(blocks.slice(i + 1, blocks.length)));
      const blockToMove = blocks[i];
      blockToMove.move(move.dirs);
      setBlocks([...blocks, blockToMove]);
    }
  };

  return (
    <Box className="App">
      <h1 style={{ textAlign: 'center' }}>KLOTSKI SOLVER</h1>
      <Box sx={{ position: 'relative', marginTop: '3rem', width: '100%' }}>
        <BoardUI blocks={blocks} status={status} setStatus={setStatus} />
        <Buttons
          board={board}
          addBlock={(block: Block, pos: Pos) => {
            board.addBlock(block, pos);
            setBlocks(board.blocks);
          }}
          moveBlock={moveBlock}
          status={status}
          setStatus={setStatus}
        />
      </Box>
    </Box>
  );
};

export default App;

import { Board, Move } from './Board';

interface Node<T> {
  value: T;
  next: Node<T> | null;
}

class LinkedList<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;

  public pushBack(val: T) {
    const newNode: Node<T> = { value: val, next: null };

    // handle empty list
    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = this.head;
    } else {
      this.tail!.next = newNode;
      this.tail = this.tail!.next;
    }
  }

  public popFront(): T {
    // handle empty list
    if (this.isEmpty()) throw Error('Attempt to pop from empty list.');

    const headVal = this.head!.value;
    this.head = this.head!.next;
    return headVal;
  }

  public length(): number {
    let runner = this.head;

    let size = 0;
    while (runner) {
      runner = runner.next;
      size++;
    }
    return size;
  }

  public isEmpty(): boolean {
    return !this.head;
  }
}

class Queue<T> {
  private queue = new LinkedList<T>();

  public constructor(arr: T[] = []) {
    arr.forEach((val: T) => this.enqueue(val));
  }

  public enqueue = (val: T): void => this.queue.pushBack(val);

  public dequeue = (): T => this.queue.popFront();

  public isEmpty = (): boolean => this.queue.isEmpty();

  public length = (): number => this.queue.length();
}

export function solveBoard(board: Board): Move[] | null {
  let final_board: Board | null = null;

  const queue = new Queue<Board>([board]);
  const hashes = new Set<string>([board.getHash()]);
  while (!queue.isEmpty()) {
    const curr_board = queue.dequeue();

    // if the current board is solved, we are done
    if (curr_board.isSolved()) {
      final_board = curr_board;
      break;
    }

    // if not, push child boards to the stack
    for (let move of curr_board.allValidMoves()) {
      const child_board = new Board(curr_board, move);
      const child_board_hash = child_board.getHash();

      if (hashes.has(child_board_hash)) continue;

      hashes.add(child_board_hash);
      queue.enqueue(child_board);
    }
  }

  // if no solution was found, return null
  if (!final_board) return null;

  // if a solution was found, return the list of moves in the solution
  const moves: Move[] = [];
  while (final_board.parent && final_board.initialMove) {
    moves.push(final_board.initialMove);
    final_board = final_board.parent;
  }

  // return moves in reverse order
  return moves;
}

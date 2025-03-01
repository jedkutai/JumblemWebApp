import { Timestamp } from "firebase/firestore";
import { MoveModel } from "../Models/MoveModel";

export class ClockFunctions {
  static getTimeRemainingForBothPlayers(userId: string, moves: MoveModel[]): [number, number] {
    let yourTimeRemaining = 180.0;
    let opponentTimeRemaining = 180.0;
    let previousMove: MoveModel | null = null;

    for (const currentMove of moves) {
      if (previousMove) {
        const lastMoveTime = (previousMove.timestamp as Timestamp).toDate();
        const currentMoveTime = (currentMove.timestamp as Timestamp).toDate();
        const timeSinceLastMove = (currentMoveTime.getTime() - lastMoveTime.getTime()) / 1000; // Convert to seconds
        console.log(`Time since last move: ${timeSinceLastMove}`);
        if (currentMove.userId === userId) {
          // Deduct from your time
          yourTimeRemaining -= timeSinceLastMove;
        } else {
          // Deduct from opponent's time
          opponentTimeRemaining -= timeSinceLastMove;
        }
        console.log()
      }

      previousMove = currentMove;
    }

    return [yourTimeRemaining, opponentTimeRemaining];
  }
}

import { Timestamp } from "firebase/firestore";
import { MoveModel } from "../Models/MoveModel";

export class ClockFunctions {
  static getTimeRemainingForBothPlayers(userId: string, moves: MoveModel[]): [number, number] {
    let yourTimeRemaining = 180.0;
    let opponentTimeRemaining = 180.0;
    let previousMove: MoveModel | null = null;

    for (const currentMove of moves) {
      if (previousMove) {
        // const lastMoveTime = (previousMove.timestamp as Timestamp).toDate();
        // const currentMoveTime = (currentMove.timestamp as Timestamp).toDate();

        const lastMoveTime = previousMove.timestamp instanceof Timestamp
        ? new Date(previousMove.timestamp.toDate())
        : new Date();

        const currentMoveTime = currentMove.timestamp instanceof Timestamp
        ? new Date(currentMove.timestamp.toDate())
        : new Date();


        const timeSinceLastMove = (currentMoveTime.getTime() - lastMoveTime.getTime()) / 1000; // Convert to seconds
        if (currentMove.userId === userId) {
          // Deduct from your time
          yourTimeRemaining -= timeSinceLastMove;
        } else {
          // Deduct from opponent's time
          opponentTimeRemaining -= timeSinceLastMove;
        }
      }

      previousMove = currentMove;
    }

    return [yourTimeRemaining, opponentTimeRemaining];
  }
}

// const lastMoveTime = lastMove.timestamp instanceof Timestamp
// ? new Date(lastMove.timestamp.toDate()) // Convert only if it's a Timestamp
// : new Date(); // Default to current date if it's still a FieldValue

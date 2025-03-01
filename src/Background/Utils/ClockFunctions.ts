import { Timestamp } from "firebase/firestore";
import { MoveModel } from "../Models/MoveModel";

export class ClockFunctions {
  static async getInternetTime(): Promise<Date> {
    // try {
    //   const response = await fetch("http://worldtimeapi.org/api/timezone/Etc/UTC");
    //   const data = await response.json();
  
    //   const accurateTime = new Date(data.utc_datetime);
    //   console.log("Accurate Internet Time:", accurateTime);
    //   return accurateTime;
    // } catch (error) {
    //   console.error("Failed to fetch internet time:", error);
    //   return new Date(); // Fallback to device time
    // }

    const response = await fetch("http://worldtimeapi.org/api/timezone/Etc/UTC");
    const data = await response.json();

    const accurateTime = new Date(data.utc_datetime);
    console.log("Accurate Internet Time:", accurateTime);
    return accurateTime;
  };

  static getTimeRemainingForBothPlayers(userId: string, moves: MoveModel[]): [number, number] {
    let yourTimeRemaining = 180.0;
    let opponentTimeRemaining = 180.0;
    let previousMove: MoveModel | null = null;

    for (const currentMove of moves) {
      if (previousMove) {
        const lastMoveTime = (previousMove.timestamp as Timestamp).toDate();
        const currentMoveTime = (currentMove.timestamp as Timestamp).toDate();
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

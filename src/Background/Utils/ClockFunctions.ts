import { Timestamp } from "firebase/firestore";
import { MoveModel } from "../Models/MoveModel";

export class ClockFunctions {
  static async getInternetTime(): Promise<Date> {

    const response = await fetch("http://worldtimeapi.org/api/timezone/Etc/UTC");
    const data = await response.json();

    const accurateTime = new Date(data.utc_datetime);
    console.log("Accurate Internet Time:", accurateTime);
    return accurateTime;
  };

  static async getTimeOffset(): Promise<number> {
    const userTime = Date.now(); // User's local device time (in milliseconds)
    const internetTime = await this.getInternetTime(); // Await the correct time
    const internetTimeMillis = internetTime.getTime(); // Convert to milliseconds

    const offset = internetTimeMillis - userTime; // Difference in milliseconds
    console.log(`Time Offset: ${offset} ms`);

    return offset; // Can be positive or negative
  }

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

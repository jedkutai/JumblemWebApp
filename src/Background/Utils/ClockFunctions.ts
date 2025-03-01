import { Timestamp } from "firebase/firestore";
import { MoveModel } from "../Models/MoveModel";

export class ClockFunctions {
  static async getInternetTime(): Promise<Date> {

    const response = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC");
    const data = await response.json();

    const accurateTime = new Date(data.utc_datetime);
    console.log("Accurate Internet Time:", accurateTime);
    return accurateTime;
  };

  static async getTimeOffset(): Promise<number> {
    const userTime = Date.now(); // Local device time in milliseconds
    const internetTime = await this.getInternetTime(); // Get accurate UTC time
    return internetTime.getTime() - userTime; // Calculate the offset
  }

  static async getCorrectedTimestamp(): Promise<Timestamp> {
    const offset = await this.getTimeOffset();
    const correctedTime = new Date(Date.now() + offset + 500); // Apply offset

    console.log("Corrected Time:", correctedTime);

    return Timestamp.fromDate(correctedTime); // Convert to Firestore Timestamp
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

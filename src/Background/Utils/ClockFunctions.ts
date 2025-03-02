import { Timestamp } from "firebase/firestore";
import { MoveModel } from "../Models/MoveModel";
import { DateTime } from "luxon";

export class ClockFunctions {
  static async getInternetTime(): Promise<DateTime> {

    const response = await fetch("https://timeapi.io/api/time/current/zone?timeZone=utc");
    const data = await response.json();

    return DateTime.fromISO(data.dateTime, { zone: "utc" });
  };

  static async getTimeOffset(): Promise<number> {
    const userTime = DateTime.utc(); // Local device time in milliseconds
    const internetTime = await this.getInternetTime(); // Get accurate UTC time
    // console.log("\n\n\nUser time:", userTime);
    // console.log("Internet time", internetTime);
    // console.log("Offset:", (internetTime.toMillis() - userTime.toMillis()));
    return internetTime.toMillis() - userTime.toMillis(); // Calculate the offset
  }

  static async getCorrectedTimestamp(): Promise<Timestamp> {
    const offset = await this.getTimeOffset();
    const correctedTime = new Date(Date.now() + offset + 500); // Apply offset


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

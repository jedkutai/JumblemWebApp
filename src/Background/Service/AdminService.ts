import { getFirestore, doc, getDoc } from "firebase/firestore";
import { GameModel } from "../Models";


export class AdminService {
  static async fetchGameById(gameId: string): Promise<GameModel> {
    const db = getFirestore();
    const userDoc = doc(db, "finishedGames", gameId);
    const snapshot = await getDoc(userDoc);
    if (!snapshot.exists()) {
      throw new Error(`Game not found.`);
    }
    return snapshot.data() as GameModel;
  }
}
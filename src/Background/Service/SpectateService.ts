import { getFirestore, doc, getDoc } from "firebase/firestore";
import { GameModel } from "../Models";


export class SpectateService {
  static async fetchActiveGameById(gameId: string): Promise<GameModel> {
    const db = getFirestore();
    const userDoc = doc(db, "newGames", gameId);
    const snapshot = await getDoc(userDoc);
    if (!snapshot.exists()) {
      throw new Error(`Game not found.`);
    }
    return snapshot.data() as GameModel;
  }
}
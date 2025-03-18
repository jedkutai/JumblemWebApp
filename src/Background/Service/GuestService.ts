import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { UserModel } from "../Models/UserModel";
import { GameModel } from "../Models/GameModel";
import { GameService } from "./GameService";

export class GuestService {
  static async botJoinMatch(user: UserModel, game: GameModel): Promise<void> {
    const db = getFirestore();
    try {
      await GameService.cleanOldGames();
    } catch {

    }

    const gameSnapshot = await getDoc(doc(db, "newGames", game.id));
    let gameUpdate = gameSnapshot.data() as GameModel;

    if (!gameUpdate.matchFound) {
      gameUpdate.playerTwoId = `BOT-${user.id}`;
      gameUpdate.playerTwoRating = user.standardRating;
      gameUpdate.matchFound = true;

      const gameRef = doc(db, "newGames", game.id);
      await setDoc(gameRef, gameUpdate);
    }

  }

  static async anonymousAccountCreation(): Promise<UserModel | null> {
    const auth = getAuth();

    try {
      const result = await signInAnonymously(auth);
      const uid = result.user.uid;

      const user: UserModel = {
        id: `GUEST${uid}`,
        email: "",
        username: "guest",
        usernameDisplayed: "Guest",
        standardRating: 1500,
        timestamp: Timestamp.now()
      };

      return user;
    } catch (error: any) {
      return null;
    }
  }
}

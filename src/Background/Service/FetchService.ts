import { getFirestore, collection, doc, query, where, orderBy, limit, getDocs, getDoc } from "firebase/firestore";
import { UserModel } from "../Models/UserModel";
import { DailyPuzzleModel } from "../Models/DailyPuzzleModel";
import { DailyPuzzleEntryModel } from "../Models/DailyPuzzleEntryModel";
import { GameModel } from "../Models/GameModel";
import { PartialWordModel } from "../Models/PartialWordModel";
import { WordModel } from "../Models/WordModel";
import { FollowModel } from "../Models/FollowModel";
import { DayFunctions } from "../Utils/DayFunctions"; // Assuming DayFunctions provides date utilities.

export class FetchService {
  static async fetchUserByUid(uid: string): Promise<UserModel> {
    const db = getFirestore();
    const userDoc = doc(db, "users", uid);
    const snapshot = await getDoc(userDoc);
    if (!snapshot.exists()) {
      throw new Error(`User not found.`);
    }
    return snapshot.data() as UserModel;
  }

  static async fetchLeaderboard(dailyPuzzle: DailyPuzzleModel, limitCount: number): Promise<DailyPuzzleEntryModel[]> {
    const db = getFirestore();
    const leaderboardQuery = query(
      collection(db, `dailyPuzzles/${dailyPuzzle.id}/entries`),
      orderBy("score", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(leaderboardQuery);
    return snapshot.docs.map(doc => doc.data() as DailyPuzzleEntryModel);
  }

  static async fetchUserPuzzleEntry(user: UserModel, dailyPuzzle: DailyPuzzleModel): Promise<DailyPuzzleEntryModel> {
    const db = getFirestore();
    const entryDoc = doc(db, `dailyPuzzles/${dailyPuzzle.id}/entries`, user.id);
    const snapshot = await getDoc(entryDoc);
    if (!snapshot.exists()) {
      throw new Error(`Puzzle entry for user ${user.id} not found.`);
    }
    return snapshot.data() as DailyPuzzleEntryModel;
  }

  static async fetchGames(userId: string, limitCount: number): Promise<GameModel[]> {
    const db = getFirestore();

    const queryPartOne = query(
      collection(db, "finishedGames"),
      where("playerOneId", "==", userId),
      where("winner", "!=", "aborted"),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const queryPartTwo = query(
      collection(db, "finishedGames"),
      where("playerTwoId", "==", userId),
      where("winner", "!=", "aborted"),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const [snapshotPartOne, snapshotPartTwo] = await Promise.all([getDocs(queryPartOne), getDocs(queryPartTwo)]);

    const gamesPartOne = snapshotPartOne.docs.map(doc => doc.data() as GameModel);
    const gamesPartTwo = snapshotPartTwo.docs.map(doc => doc.data() as GameModel);

    const allGames = [...gamesPartOne, ...gamesPartTwo];
    allGames.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

    return allGames.slice(0, limitCount);
  }

  static async fetchPartialWord(id: string): Promise<PartialWordModel | null> {
    const db = getFirestore();
    const partialWordDoc = doc(db, "partialWords", id);
    const snapshot = await getDoc(partialWordDoc);
    return snapshot.exists() ? (snapshot.data() as PartialWordModel) : null;
  }

  static async fetchWordModelByWord(word: string): Promise<WordModel> {
    const db = getFirestore();
    const wordDoc = doc(db, "words", word);
    const snapshot = await getDoc(wordDoc);
    if (!snapshot.exists()) {
      throw new Error(`Word "${word}" not found.`);
    }
    return snapshot.data() as WordModel;
  }

  static async fetchTodaysDailyPuzzle(): Promise<DailyPuzzleModel | null> {
    const db = getFirestore();
    const [startOfDay, endOfDay] = DayFunctions.getTodayDateRangeInPacificTime();

    const dailyPuzzleQuery = query(
      collection(db, "dailyPuzzles"),
      where("timestamp", ">=", startOfDay),
      where("timestamp", "<", endOfDay),
      limit(1)
    );

    const snapshot = await getDocs(dailyPuzzleQuery);

    if (snapshot.empty) {
      return null;
    }
    return snapshot.docs[0].data() as DailyPuzzleModel;
  }

  static async fetchFollowedUsers(user: UserModel): Promise<FollowModel[]> {
    const db = getFirestore();
    const followedUsersQuery = query(
      collection(db, "follows"),
      where("userId", "==", user.id)
    );

    const snapshot = await getDocs(followedUsersQuery);
    return snapshot.docs.map(doc => doc.data() as FollowModel);
  }

  static async fetchUserByUsername(username: string): Promise<UserModel | null> {
    const usernameLowercased = username.trim().toLowerCase();
    
    if (usernameLowercased.length > 0) {
      const db = getFirestore();
      const usersRef = collection(db, "users");
      const usernameQuery = query(usersRef, where("username", "==", usernameLowercased));
      const snapshot = await getDocs(usernameQuery);
      
      if (!snapshot.empty) {
        const first = snapshot.docs[0];
        return first.data() as UserModel;
      }
    }

    return null;
    
  }

  static async checkIfUserAFollowsUserB(userA: UserModel, userB: UserModel): Promise<boolean> {
    const db = getFirestore();
    const followRef = collection(db, "follows");
    const followedUsersQuery = query(
      followRef,
      where("userId", "==", userA.id),
      where("userToFollowId", "==", userB.id),
      limit(1)
    );
    const snapshot = await getDocs(followedUsersQuery);
    return !snapshot.empty;
    
  }

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

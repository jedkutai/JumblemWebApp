import { getFirestore, collection, doc, query, where, orderBy, limit, getDocs, getDoc } from "firebase/firestore";
import { UserModel } from "../Models/UserModel";
import { DailyPuzzleModel } from "../Models/DailyPuzzleModel";
import { DailyPuzzleEntryModel } from "../Models/DailyPuzzleEntryModel";
import { GameModel } from "../Models/GameModel";
import { PartialWordModel } from "../Models/PartialWordModel";
import { WordModel } from "../Models/WordModel";
import { FollowModel } from "../Models/FollowModel";
import { DayFunctions } from "../Utils/DayFunctions"; // Assuming DayFunctions provides date utilities.
import { DictionaryWordModel, PublicUsernameModel } from "../Models";
import axios from "axios";
import { WordBankFunctions } from "../Utils/WordBankFunctions";

export class FetchService {

  static async fetchDailyPuzzleById(id: string): Promise<DailyPuzzleModel> {
    const db = getFirestore();
    const puzzleDoc = doc(db, "dailyPuzzles", id);
    const snapshot = await getDoc(puzzleDoc);
    if (!snapshot.exists()) {
      throw new Error(`User not found.`);
    }
    return snapshot.data() as DailyPuzzleModel;
  }

  static async fetchUserByUid(uid: string): Promise<UserModel> {
    const db = getFirestore();
    const userDoc = doc(db, "users", uid);
    const snapshot = await getDoc(userDoc);
    if (!snapshot.exists()) {
      throw new Error(`User not found.`);
    }
    return snapshot.data() as UserModel;
  }

  static async fetchPublicUserName(uid: string): Promise<PublicUsernameModel> {
    const db = getFirestore();
    const userDoc = doc(db, "publicUsernames", uid);
    const snapshot = await getDoc(userDoc);
    if (!snapshot.exists()) {
      throw new Error(`User not found.`);
    }
    return snapshot.data() as PublicUsernameModel;
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

  static async fetchFollowsLeaderboard(user: UserModel, dailyPuzzle: DailyPuzzleModel): Promise<DailyPuzzleEntryModel[]> {
    const followedUsers = await this.fetchFollowedUsers(user);
    let results: DailyPuzzleEntryModel[] = [];
    for (const follow of followedUsers) {
      try {
        if (follow.userToFollowId.length > 0) {
          const entry = await this.fetchFollowsPuzzleEntry(follow.userToFollowId, dailyPuzzle);
          results.push(entry);
        }
      } catch {
      }
    }

    try {
      const entry = await this.fetchFollowsPuzzleEntry(user.id, dailyPuzzle);
      results.push(entry);
    } catch {

    }
    results.sort((a, b) => b.score - a.score);

    return results;
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

  static async fetchFollowsPuzzleEntry(userId: string, dailyPuzzle: DailyPuzzleModel): Promise<DailyPuzzleEntryModel> {
    const db = getFirestore();
    const entryDoc = doc(db, `dailyPuzzles/${dailyPuzzle.id}/entries`, userId);
    const snapshot = await getDoc(entryDoc);
    if (!snapshot.exists()) {
      throw new Error(`Puzzle entry for user ${userId} not found.`);
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

  static async fetchWordModelByWord(word: string, wordBank: Record<string, string[]>): Promise<WordModel> {
    const prefix = word.slice(0, 3); // Extract the first 3 characters as the prefix
    const sortedArray = wordBank[prefix];

    if (sortedArray) {
        const wordAndFrequency = WordBankFunctions.binarySearchWord(sortedArray, word);

        if (wordAndFrequency) {
            const splits = wordAndFrequency.split("#");
            const wordString = splits[0];
            const frequency = parseInt(splits[1], 10);

            if (frequency > -1) {
                const newWordModel: WordModel = {
                    id: wordString,
                    word: wordString,
                    score: frequency,
                };
                
                return newWordModel;
            } else {
              throw new Error(`Word "${word}" not found.`);
            }
        } else {
          throw new Error(`Word "${word}" not found.`);
        }
    } else {
      throw new Error(`Word "${word}" not found.`);
    }
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

  static async fetchWordDefinition(word: string): Promise<DictionaryWordModel[] | null> {
    try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = response.data;

        // Transform the response into your models
        const words: DictionaryWordModel[] = data.map((entry: any) => ({
            word: entry.word,
            phonetics: entry.phonetics.map((phonetic: any) => ({
                text: phonetic.text,
                audio: phonetic.audio,
            })),
            meanings: entry.meanings.map((meaning: any) => ({
                partOfSpeech: meaning.partOfSpeech,
                definitions: meaning.definitions.map((definition: any) => ({
                    definition: definition.definition,
                    example: definition.example,
                })),
            })),
        }));

        return words;
    } catch (error) {
        throw new Error("Failed to fetch word definition.");
    }
}
}

import {
    getFirestore,
    collection,
    doc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
  } from "firebase/firestore";
  import { UserModel } from "../Models/UserModel";
  import { MoveModel } from "../Models/MoveModel";
  import { WordModel } from "../Models/WordModel";
  import { DailyPuzzleModel } from "../Models/DailyPuzzleModel";
  import { DailyPuzzleEntryModel } from "../Models/DailyPuzzleEntryModel";
  import { DailyPuzzleFunctions } from "../Utils/DailyPuzzleFunctions";
  
  export class GameService {
    static async updateLastPuzzlePlayed(user: UserModel, puzzle: DailyPuzzleModel): Promise<void> {
      const db = getFirestore();
      const userRef = doc(db, "users", user.id);
  
      await updateDoc(userRef, { lastPuzzlePlayedId: puzzle.id });
    }
  
    static async cleanOldGames(): Promise<void> {
      const db = getFirestore();
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
      const gameQuery = query(
        collection(db, "newGames"),
        where("timestamp", "<", oneHourAgo),
        orderBy("timestamp", "asc"),
        limit(2)
      );
  
      const snapshot = await getDocs(gameQuery);
      const deletePromises = snapshot.docs.map((doc) =>
        GameService.destroyGame(doc.id)
      );
  
      await Promise.all(deletePromises);
    }
  
    static async destroyGame(gameId: string): Promise<void> {
      const db = getFirestore();
      const movesRef = collection(db, `newGames/${gameId}/moves`);
  
      const movesSnapshot = await getDocs(movesRef);
      const deleteMovesPromises = movesSnapshot.docs.map((move) =>
        deleteDoc(doc(movesRef, move.id))
      );
      await Promise.all(deleteMovesPromises);
  
      await deleteDoc(doc(db, "newGames", gameId));
    }
  
    static async fetchMoves(gameId: string): Promise<MoveModel[]> {
      const db = getFirestore();
      const movesQuery = query(
        collection(db, `finishedGames/${gameId}/moves`),
        orderBy("timestamp", "asc")
      );
  
      const snapshot = await getDocs(movesQuery);
      return snapshot.docs.map((doc) => doc.data() as MoveModel);
    }
  
    static async fetchWinningWords(winningWords: string[]): Promise<WordModel[]> {
      if (winningWords.length === 0) return [];
  
      const db = getFirestore();
      const wordsQuery = query(
        collection(db, "words"),
        where("word", "in", winningWords),
        orderBy("word", "asc")
      );
  
      const snapshot = await getDocs(wordsQuery);
      return snapshot.docs.map((doc) => doc.data() as WordModel);
    }
  
    static async submitDailyPuzzleEntry(
      user: UserModel,
      puzzle: DailyPuzzleModel,
      correctWords: Record<string, [WordModel, number]>,
      timeDuration: number
    ): Promise<void> {
      const db = getFirestore();
      const score = DailyPuzzleFunctions.getScore(correctWords);
  
      const dayInSeconds = 86400;
      const percentage = Math.abs(timeDuration) / dayInSeconds;
      const bonus = percentage > 0 && percentage < 1 ? percentage : 0;
  
      const finalScore = score + bonus;
  
      const winningWords: string[] = [];
      for (const [wordString, value] of Object.entries(correctWords)) {
        const count = value[1];
        winningWords.push(...Array(count).fill(wordString));
      }
  
      winningWords.sort();
  
      const puzzleEntryRef = doc(
        collection(db, `dailyPuzzles/${puzzle.id}/entries`),
        user.id
      );
      const usersPuzzlesPlayedRef = doc(
        collection(db, `users/${user.id}/dailyPuzzles`),
        puzzle.id
      );
  
      const puzzleEntry: DailyPuzzleEntryModel = {
        id: puzzleEntryRef.id,
        puzzleId: puzzle.id,
        userId: user.id,
        signature: puzzle.signature,
        score: finalScore,
        words: winningWords,
        timestamp: Timestamp.now(),
      };
  
      await setDoc(puzzleEntryRef, puzzleEntry);
      await setDoc(usersPuzzlesPlayedRef, puzzle);
    }
  }
  
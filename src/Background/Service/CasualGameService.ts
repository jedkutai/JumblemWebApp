import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, query, where, orderBy, limit, updateDoc, Timestamp, getDoc } from "firebase/firestore";
import { UserModel } from "../Models/UserModel";
import { GameModel } from "../Models/GameModel";
import { MoveModel } from "../Models/MoveModel";
import { GameService } from "./GameService";
import { ClockFunctions } from "../Utils/ClockFunctions";

export class CasualGameService {
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


  static async findGame(user: UserModel): Promise<GameModel | null> {
    const db = getFirestore();
    try {
      await GameService.cleanOldGames();
    } catch {
      
    }

    const queryRef = query(
      collection(db, "newGames"),
      where("gameMode", "==", "casual"),
      where("matchFound", "==", false),
      where("playerOneId", "!=", user.id),
      orderBy("timestamp", "asc"),
      limit(1)
    );

    const snapshot = await getDocs(queryRef);
    const snapshotGames = snapshot.docs.map((doc) => doc.data() as GameModel);

    if (snapshotGames.length > 0) {
      const selectedGame = snapshotGames[0];
      const gameRef = doc(db, "newGames", selectedGame.id);
      await updateDoc(gameRef, { matchFound: true });

      let newGame = selectedGame;
      newGame.playerTwoId = user.id;
      newGame.playerTwoRating = user.standardRating;
      newGame.matchFound = true;

      const updatedGame = await this.getGameUpdate(selectedGame);

      if (updatedGame.matchFound && !updatedGame.playerTwoId) {
        const encodedGame = { ...newGame };
        await setDoc(gameRef, encodedGame);
      }

      return selectedGame;
    }

    return null;
  }

  static async createGame(user: UserModel): Promise<GameModel | null> {
    const db = getFirestore();
    const gameRef = doc(collection(db, "newGames"));
    const newGame: GameModel = {
      id: gameRef.id,
      gameMode: "casual",
      playerOneId: user.id,
      playerOneRating: user.standardRating,
      timestamp: Timestamp.now(),
      matchFound: false
    };

    await setDoc(gameRef, newGame);
    return newGame;
  }

  static async getGameUpdate(game: GameModel): Promise<GameModel> {
    const db = getFirestore();
    const gameSnapshot = await getDoc(doc(db, "newGames", game.id));
    const gameUpdate = gameSnapshot.data() as GameModel;
    return gameUpdate;
  }

  static async destroyGame(game: GameModel): Promise<void> {
    const db = getFirestore();
    const movesRef = collection(db, `newGames/${game.id}/moves`);
    const movesSnapshot = await getDocs(movesRef);

    for (const move of movesSnapshot.docs) {
      await deleteDoc(move.ref);
    }

    await deleteDoc(doc(db, "newGames", game.id));
  }

  static async makeMove(user: UserModel, game: GameModel, coordinates: string, letter: string, number: number, letterBank: string[]): Promise<void> {
    const correctTimeStamp = await ClockFunctions.getCorrectedTimestamp();
    if (correctTimeStamp) {
      if (coordinates.length > 0 && letter.length > 0) {
        const db = getFirestore();
        const movesRef = doc(collection(db, `newGames/${game.id}/moves`));
        const newMove: MoveModel = {
          id: movesRef.id,
          gameId: game.id,
          userId: user.id,
          coordinates,
          letter,
          timestamp: correctTimeStamp,
          number: number,
          letterBank: letterBank.sort()
        };
    
        await setDoc(movesRef, newMove);
    }
    // if (coordinates.length > 0 && letter.length > 0) {
    //   const db = getFirestore();
    //   const movesRef = doc(collection(db, `newGames/${game.id}/moves`));
    //   const newMove: MoveModel = {
    //     id: movesRef.id,
    //     gameId: game.id,
    //     userId: user.id,
    //     coordinates,
    //     letter,
    //     timestamp: Timestamp.now(),
    //     number: number,
    //     letterBank: letterBank.sort()
    //   };
  
    //   await setDoc(movesRef, newMove);
    }

  }

  static async makeBotMove(user: UserModel, game: GameModel, coordinates: string, letter: string, number: number, letterBank: string[]): Promise<void> {
    const db = getFirestore();
    const movesRef = doc(collection(db, `newGames/${game.id}/moves`));
    const newMove: MoveModel = {
      id: movesRef.id,
      gameId: game.id,
      userId: `BOT-${user.id}`,
      coordinates,
      letter,
      timestamp: Timestamp.now(),
      number: number,
      letterBank: letterBank.sort()
    };

    await setDoc(movesRef, newMove);
  }

  static async getFinalMove(game: GameModel): Promise<MoveModel | null> {
    const db = getFirestore();
    const movesRef = query(
      collection(db, `newGames/${game.id}/moves`),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(movesRef);
    if (!snapshot.empty) {
      return snapshot.docs[0].data() as MoveModel;
    }
    return null;
  }

  static async setGameWinner(game: GameModel, result: string, winningWords: string[], winningCoordinates: string[]): Promise<void> {
    const db = getFirestore();
    const gameRef = doc(db, "newGames", game.id);

    const updates: Partial<GameModel> = { winner: result };
    if (winningCoordinates.length > 0) {
      updates.winningCoordinates = winningCoordinates;
    }
    if (winningWords.length > 0) {
      updates.winningWords = winningWords;
    }

    await updateDoc(gameRef, updates);
  }

  static async moveFinishedGame(game: GameModel): Promise<void> {
    const db = getFirestore();
    const gameRef = doc(db, "newGames", game.id);
    const finishedGameRef = doc(db, "finishedGames", game.id);

    // const gameSnapshot = await gameRef.get();
    const gameSnapshot = await getDoc(gameRef);
    const finishedGame = gameSnapshot.data() as GameModel;

    await setDoc(finishedGameRef, finishedGame);

    const movesRef = collection(db, `newGames/${game.id}/moves`);
    const movesSnapshot = await getDocs(movesRef);

    for (const move of movesSnapshot.docs) {
      await setDoc(doc(finishedGameRef, `moves/${move.id}`), move.data());
    }

    await this.destroyGame(game);
  }

  static async fetchFinalGame(game: GameModel): Promise<GameModel> {
    const db = getFirestore();
    // const snapshot = await doc(db, "finishedGames", game.id).get();
    const snapshot = await getDoc(doc(db, "finishedGames", game.id));
    return snapshot.data() as GameModel;
  }


}

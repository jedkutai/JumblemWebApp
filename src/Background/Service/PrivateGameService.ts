import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { UserModel } from "../Models/UserModel";
import { GameModel } from "../Models/GameModel";
import { MoveModel } from "../Models/MoveModel";
import { OfferedRematchModel } from "../Models/OfferedRematchModel";

export class PrivateGameService {
  static readonly offeredRematches = "offeredRematches";
  static readonly gameId = "gameId";

  static async offerRematch(user: UserModel, game: GameModel): Promise<void> {
    const db = getFirestore();

    const receiverId = user.id === game.playerOneId ? game.playerTwoId : game.playerOneId;

    if (receiverId) {
      const rematch: OfferedRematchModel = {
        id: game.id,
        gameId: game.id,
        senderId: user.id,
        receiverId,
        timestamp: Timestamp.now()
      };

      const rematchRef = doc(collection(db, PrivateGameService.offeredRematches), game.id);
      await setDoc(rematchRef, rematch);
    }
  }

  static async checkIfRematchOffered(_user: UserModel, game: GameModel): Promise<boolean> {
    const db = getFirestore();
    const rematchQuery = query(
      collection(db, PrivateGameService.offeredRematches),
      where(PrivateGameService.gameId, "==", game.id)
    );

    const snapshot = await getDocs(rematchQuery);
    return !snapshot.empty;
  }

  static async destroySpecificRematchOffer(game: GameModel): Promise<void> {
    const db = getFirestore();
    await deleteDoc(doc(collection(db, PrivateGameService.offeredRematches), game.id));
  }

  static async findGame(user: UserModel, gameId: string): Promise<GameModel | null> {
    const db = getFirestore();
    const queryRef = query(
      collection(db, "newGames"),
      where("gameMode", "==", "private"),
      where("matchFound", "==", false),
      where("playerOneId", "!=", user.id),
      where("id", "==", gameId),
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

  static async joinRematch(user: UserModel, opponentId?: string): Promise<GameModel | null> {
    if (!opponentId) return null;

    const db = getFirestore();
    const queryRef = query(
      collection(db, "newGames"),
      where("gameMode", "==", "private"),
      where("matchFound", "==", false),
      where("playerOneId", "==", opponentId),
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

  static async createGame(user: UserModel, timeOffset: number): Promise<GameModel | null> {
    const adjustedTimestamp = Timestamp.fromMillis(Timestamp.now().toMillis() + timeOffset);

    const db = getFirestore();
    const gameRef = doc(collection(db, "newGames"));
    const newGame: GameModel = {
      id: gameRef.id,
      gameMode: "private",
      playerOneId: user.id,
      playerOneRating: user.standardRating,
      timestamp: adjustedTimestamp,
      matchFound: false
    };

    await setDoc(gameRef, newGame);
    return newGame;
  }


  static async getGameUpdate(game: GameModel): Promise<GameModel> {
    const db = getFirestore();
    const snapshot = await getDoc(doc(db, "newGames", game.id));

    if (!snapshot.exists()) {
      throw new Error(`Game with ID ${game.id} not found.`);
    }

    return snapshot.data() as GameModel;
  }

  static async destroyGame(game: GameModel): Promise<void> {
    const db = getFirestore();

    const movesRef = collection(db, `newGames/${game.id}/moves`);
    const movesSnapshot = await getDocs(movesRef);

    const deleteMovesPromises = movesSnapshot.docs.map((move) => deleteDoc(doc(movesRef, move.id)));
    await Promise.all(deleteMovesPromises);

    await deleteDoc(doc(db, "newGames", game.id));
  }

  static async makeMove(user: UserModel, game: GameModel, coordinates: string, letter: string, number: number, letterBank: string[], timeOffset: number): Promise<void> {
    const adjustedTimestamp = Timestamp.fromMillis(Timestamp.now().toMillis() + timeOffset);
    if (adjustedTimestamp) {
      if (coordinates.length > 0 && letter.length > 0) {
        const db = getFirestore();
        const moveRef = doc(collection(db, `newGames/${game.id}/moves`));
    
        const newMove: MoveModel = {
          id: moveRef.id,
          gameId: game.id,
          userId: user.id,
          coordinates,
          letter,
          timestamp: adjustedTimestamp,
          number: number,
          letterBank: letterBank.sort()
        };
    
        await setDoc(moveRef, newMove);
      }
    }

  }

  static async getFinalMove(game: GameModel): Promise<MoveModel | null> {
    const db = getFirestore();
    const movesQuery = query(
      collection(db, `newGames/${game.id}/moves`),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(movesQuery);
    if (snapshot.empty) return null;

    return snapshot.docs[0].data() as MoveModel;
  }

  static async setGameWinner(game: GameModel, result: string, winningWords: string[], winningCoordinates: string[]): Promise<void> {
    const db = getFirestore();
    const gameRef = doc(db, "newGames", game.id);

    const updates: any = { winner: result };
    if (winningCoordinates.length > 0) updates.winningCoordinates = winningCoordinates;
    if (winningWords.length > 0) updates.winningWords = winningWords;

    await updateDoc(gameRef, updates);
  }

  static async moveFinishedGame(game: GameModel): Promise<void> {
    const db = getFirestore();

    const gameSnapshot = await getDoc(doc(db, "newGames", game.id));
    if (!gameSnapshot.exists()) {
      throw new Error(`Game with ID ${game.id} not found.`);
    }
    const finishedGame = gameSnapshot.data() as GameModel;

    const finishedGameRef = doc(collection(db, "finishedGames"), game.id);
    await setDoc(finishedGameRef, finishedGame);

    const movesRef = collection(db, `newGames/${game.id}/moves`);
    const movesSnapshot = await getDocs(movesRef);

    const movePromises = movesSnapshot.docs.map((move) =>
      setDoc(doc(collection(db, `finishedGames/${game.id}/moves`), move.id), move.data())
    );
    await Promise.all(movePromises);

    await PrivateGameService.destroyGame(game);
  }

  static async fetchFinalGame(game: GameModel): Promise<GameModel> {
    const db = getFirestore();
    const snapshot = await getDoc(doc(db, "finishedGames", game.id));

    if (!snapshot.exists()) {
      throw new Error(`Game with ID ${game.id} not found.`);
    }

    return snapshot.data() as GameModel;
  }
}

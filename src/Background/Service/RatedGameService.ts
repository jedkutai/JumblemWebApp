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
  import { Rating } from "../Utils/Rating"; // Assuming you have a Rating service
  import { FetchService } from "./FetchService"; // For fetching users or related data
  
  export class RatedGameService {
    static async findGame(user: UserModel): Promise<GameModel | null> {
      const db = getFirestore();
  
      // Define rating boundaries
      const windowBonus = user.standardRating * 0.2;
      const minimumRating = user.standardRating - 200 - Math.floor(windowBonus);
      const maximumRating = user.standardRating + 200 + Math.floor(windowBonus);
  
      // Query for a suitable game
      const queryRef = query(
        collection(db, "newGames"),
        where("gameMode", "==", "standard"),
        where("matchFound", "==", false),
        where("playerOneId", "!=", user.id),
        where("playerOneRating", ">=", minimumRating),
        where("playerOneRating", "<=", maximumRating),
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
        gameMode: "standard",
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
  
      const deleteMovesPromises = movesSnapshot.docs.map((move) =>
        deleteDoc(doc(movesRef, move.id))
      );
      await Promise.all(deleteMovesPromises);
  
      await deleteDoc(doc(db, "newGames", game.id));
    }
  
    static async makeMove(user: UserModel, game: GameModel, coordinates: string, letter: string, number: number): Promise<void> {
      if (coordinates.length > 0 && letter.length > 0) {
        const db = getFirestore();
        const moveRef = doc(collection(db, `newGames/${game.id}/moves`));
    
        const newMove: MoveModel = {
          id: moveRef.id,
          gameId: game.id,
          userId: user.id,
          coordinates,
          letter,
          timestamp: Timestamp.now(),
          number: number
        };
    
        await setDoc(moveRef, newMove);
      }

    }
  
    static async getFinalMove(game: GameModel): Promise<MoveModel | null> {
      const db = getFirestore();
      const movesRef = query(
        collection(db, `newGames/${game.id}/moves`),
        orderBy("createdAt", "desc"),
        limit(1)
      );
  
      const snapshot = await getDocs(movesRef);
      if (snapshot.empty) return null;
  
      return snapshot.docs[0].data() as MoveModel;
    }
  
    static async setGameWinner(
      game: GameModel,
      result: string,
      winningWords: string[],
      winningCoordinates: string[]
    ): Promise<void> {
      const db = getFirestore();
      const gameRef = doc(db, "newGames", game.id);
  
      const updates: any = { winner: result };
      if (winningCoordinates.length > 0) updates.winningCoordinates = winningCoordinates;
      if (winningWords.length > 0) updates.winningWords = winningWords;
  
      
  
      // Update player ratings
      if (result != "aborted") {
        if (game.playerTwoId && game.playerTwoRating !== undefined && game) {
          const playerOneChange =
            result === "draw"
              ? Rating.draw(game.playerOneRating, game.playerTwoRating)
              : result === game.playerOneId
              ? Rating.win(game.playerOneRating, game.playerTwoRating)
              : Rating.lose(game.playerOneRating, game.playerTwoRating);
    
          const playerTwoChange =
            result === "draw"
              ? Rating.draw(game.playerTwoRating, game.playerOneRating)
              : result === game.playerTwoId
              ? Rating.win(game.playerTwoRating, game.playerOneRating)
              : Rating.lose(game.playerTwoRating, game.playerOneRating);
    
          updates.playerOneRatingChange = playerOneChange;
          updates.playerTwoRatingChange = playerTwoChange;
  
          const playerOne = await FetchService.fetchUserByUid(game.playerOneId);
          const playerTwo = await FetchService.fetchUserByUid(game.playerTwoId);
    
          playerOne.standardRating = Math.max(game.playerOneRating + playerOneChange, 400);
          playerTwo.standardRating = Math.max(game.playerTwoRating + playerTwoChange, 400);
    
          await updateDoc(doc(db, "users", playerOne.id), { standardRating: playerOne.standardRating });
          await updateDoc(doc(db, "users", playerTwo.id), { standardRating: playerTwo.standardRating });
        }
      }

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
  
      await RatedGameService.destroyGame(game);
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
  
  
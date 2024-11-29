import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { MoveModel } from "../Models/MoveModel";
import { GameModel } from "../Models/GameModel";
import { UserModel } from "../Models/UserModel";
import { ClockFunctions } from "../Utils/ClockFunctions";

export function useStandardGameManager(user: UserModel, game: GameModel) {
  const [moves, setMoves] = useState<MoveModel[]>([]);
  const [movesCopy, setMovesCopy] = useState<MoveModel[]>([]);
  const [movesDict, setMovesDict] = useState<Record<string, MoveModel>>({});
  const [yourTurn, setYourTurn] = useState(false);
  const [yourTimeRemaining, setYourTimeRemaining] = useState(180);
  const [opponentTimeRemaining, setOpponentTimeRemaining] = useState(180);
  const [checkGameOver, setCheckGameOver] = useState(false);
  const [movesMade, setMovesMade] = useState(0);

  const db = getFirestore();

  useEffect(() => {
    const movesRef = collection(db, "newGames", game.id, "moves");
    const movesQuery = query(movesRef, orderBy("timestamp", "asc"));


    const unsubscribe = onSnapshot(movesQuery, async (snapshot) => {
      const fetchedMoves = snapshot.docs.map((doc) => doc.data() as MoveModel);
      if (fetchedMoves) {

        await actions(fetchedMoves);
      }

    });

    return () => unsubscribe();

  }, []);




  const actions = async (fetchedMoves: MoveModel[]) => {
    if (fetchedMoves.length > movesMade) {
      const fetchedMovesLength = fetchedMoves.length;
      const movesDictUpdate = Object.fromEntries(fetchedMoves.map((move) => [move.coordinates, move]));

      setMoves(fetchedMoves);
      setMovesMade(fetchedMovesLength);
      setMovesCopy(fetchedMoves);
      setMovesDict(movesDictUpdate);

      if (fetchedMoves.length > 0) {
        if (fetchedMoves[fetchedMoves.length - 1].userId === user.id) {
          setYourTurn(false);
        } else {
          setYourTurn(true);
        }
      } else {
        setYourTurn(game.playerOneId == user.id);
      }

      const [yourTime, opponentTime] = ClockFunctions.getTimeRemainingForBothPlayers(user.id, fetchedMoves);
      setYourTimeRemaining(yourTime);
      setOpponentTimeRemaining(opponentTime);
    } else if ((fetchedMoves.length < movesMade) && !checkGameOver) {
      setCheckGameOver(true);
    } else if (fetchedMoves.length == 0) {
      setYourTurn(game.playerOneId == user.id);
    }

  }

  return {
    moves,
    movesCopy,
    movesDict,
    yourTurn,
    yourTimeRemaining,
    opponentTimeRemaining,
    checkGameOver,
    movesMade,
  };
}

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

export function useStandardGameManager2(user: UserModel, game: GameModel) {
  const [moves, setMoves] = useState<MoveModel[]>([]);
  const [movesCopy, setMovesCopy] = useState<MoveModel[]>([]);
  const [movesDict, setMovesDict] = useState<Record<string, MoveModel>>({});
  const [yourTurn, setYourTurn] = useState(game.playerOneId == user.id);
  const [yourTimeRemaining, setYourTimeRemaining] = useState(180);
  const [opponentTimeRemaining, setOpponentTimeRemaining] = useState(180);
  const [checkGameOver, setCheckGameOver] = useState(false);
  const [movesMade, setMovesMade] = useState(0);
  const [anchorTime, setAnchorTime] = useState(Date.now());

  const db = getFirestore();

  useEffect(() => {
    const movesRef = collection(db, "newGames", game.id, "moves");
    const movesQuery = query(movesRef, orderBy("timestamp", "asc"));


    const unsubscribe = onSnapshot(movesQuery, async (snapshot) => {
      const fetchedMoves = snapshot.docs.map((doc) => doc.data() as MoveModel);
      if (fetchedMoves) {
        setMoves(fetchedMoves);
      }

    });

    return () => unsubscribe();

  }, []);

  useEffect(() => {
    if (moves.length > movesMade) {
        setYourTurn(false);
        setMovesMade(moves.length);
        setMovesCopy(moves);
    } else if (moves.length < movesMade) {
        setCheckGameOver(true);
    }
  }, [moves]);

  useEffect(() => {
    const movesDictUpdate = Object.fromEntries(movesCopy.map((move) => [move.coordinates, move]));
    setMovesDict(movesDictUpdate);
  }, [movesCopy]);

  useEffect(() => {
    const lastMove = movesCopy.at(movesCopy.length - 1);
    if (lastMove) {
        if (lastMove.userId === user.id) {
            setYourTurn(false);
        } else {
            setYourTurn(true);
        }
        const lastMoveTime = new Date(lastMove.timestamp.toDate())
        setAnchorTime(lastMoveTime.getTime())
    }
  }, [movesDict]);

  useEffect(() => {
    const [yourTime, opponentTime] = ClockFunctions.getTimeRemainingForBothPlayers(user.id, movesCopy);
    setYourTimeRemaining(yourTime);
    setOpponentTimeRemaining(opponentTime);

  }, [anchorTime]);


  return {
    moves,
    movesCopy,
    movesDict,
    yourTurn,
    yourTimeRemaining,
    opponentTimeRemaining,
    checkGameOver,
    movesMade,
    anchorTime
  };
}

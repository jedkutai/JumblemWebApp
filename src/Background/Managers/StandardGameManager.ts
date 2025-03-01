// import { useState, useEffect } from "react";
// import {
//   getFirestore,
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
// } from "firebase/firestore";
// import { MoveModel } from "../Models/MoveModel";
// import { GameModel } from "../Models/GameModel";
// import { UserModel } from "../Models/UserModel";
// // import { ClockFunctions } from "../Utils/ClockFunctions";

// export function useStandardGameManager(_user: UserModel, game: GameModel) {
//   const [moves, setMoves] = useState<MoveModel[]>([]);
//   const [movesCopy, _setMovesCopy] = useState<MoveModel[]>([]);
//   const [movesDict, _setMovesDict] = useState<Record<string, MoveModel>>({});
//   const [yourTurn, _setYourTurn] = useState(false);
//   const [yourTimeRemaining, _setYourTimeRemaining] = useState(180);
//   const [opponentTimeRemaining, _setOpponentTimeRemaining] = useState(180);
//   const [checkGameOver, _setCheckGameOver] = useState(false);
//   const [movesMade, _setMovesMade] = useState(0);

//   const db = getFirestore();

//   useEffect(() => {
//     const movesRef = collection(db, "newGames", game.id, "moves");
//     // const movesQuery = query(movesRef, orderBy("timestamp", "asc"));
//     const movesQuery = query(movesRef, orderBy("number", "asc"));


//     const unsubscribe = onSnapshot(movesQuery, async (snapshot) => {
//       const fetchedMoves = snapshot.docs.map((doc) => doc.data() as MoveModel);
//       if (fetchedMoves) {
//         setMoves(fetchedMoves);
//         // await actions(fetchedMoves);
//       }

//     });

//     return () => unsubscribe();

//   }, []);

  // const actions = (fetchedMoves: MoveModel[]) => {
  //   const fetchedMovesCopy = fetchedMoves;
  //   const movesDictUpdate = Object.fromEntries(fetchedMovesCopy.map((move) => [move.coordinates, move]));
  //   const fetchedMovesCopyLength = fetchedMovesCopy.length;
  //   if (fetchedMovesCopyLength > movesMade) {
  //     setMoves(fetchedMovesCopy);
  //     // setMovesMade(fetchedMovesCopyLength);
  //     setMovesMade((_prevMovesMade) => {
  //       return fetchedMovesCopyLength;
  //   });
  //     setMovesCopy(fetchedMovesCopy);
  //     setMovesDict(movesDictUpdate);

  //     if (fetchedMovesCopy.length > 0) {
  //       if (fetchedMovesCopy[fetchedMovesCopy.length - 1].userId === user.id) {
  //         setYourTurn(false);
  //       } else {
  //         setYourTurn(true);
  //       }
  //     } else {
  //       setYourTurn(game.playerOneId == user.id);
  //     }

  //     const [yourTime, opponentTime] = ClockFunctions.getTimeRemainingForBothPlayers(user.id, fetchedMovesCopy);
  //     setYourTimeRemaining(yourTime);
  //     setOpponentTimeRemaining(opponentTime);
  //   } else if ((fetchedMovesCopy.length < movesMade) && !checkGameOver) {
  //     setCheckGameOver(true);
  //   } else if (fetchedMovesCopy.length == 0) {
  //     setYourTurn(game.playerOneId == user.id);
  //   }

  // }


//   return {
//     moves,
//     movesCopy,
//     movesDict,
//     yourTurn,
//     yourTimeRemaining,
//     opponentTimeRemaining,
//     checkGameOver,
//     movesMade,
//   };
// }

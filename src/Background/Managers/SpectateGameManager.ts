import { collection, getFirestore, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { GameModel, MoveModel } from "../Models";
import { ClockFunctions } from "../Utils/ClockFunctions";
import { SpectateService } from "../Service";

export function useSpectateGameManager(game: GameModel) {
    const [updatedGame, setUpdatedGame] = useState(game);
    const [moves, setMoves] = useState<MoveModel[]>([]);
    const [movesCopy, setMovesCopy] = useState<MoveModel[]>([]);
    const [movesDict, setMovesDict] = useState<Record<string, MoveModel>>({});
    const [playerTurnId, setPlayerTurnId] = useState<string>(game.playerOneId);
    const [playerOneTimeRemaining, setPlayerOneTimeRemaining] = useState(180);
    const [playerTwoTimeRemaining, setPlayerTwoTimeRemaining] = useState(180);
    const [gameOver, setGameOver] = useState(false);
    const [movesMade, setMovesMade] = useState(0);
    const [anchorTime, setAnchorTime] = useState(Date.now());

    const db = getFirestore();

    useEffect(() => {
        const movesRef = collection(db, "newGames", game.id, "moves");
        const movesQuery = query(movesRef, orderBy("number", "asc"));

        const unsubscribe = onSnapshot(movesQuery, async (snapshot) => {

            const fetchedMoves = snapshot.docs.map((doc) => doc.data() as MoveModel);
            if (fetchedMoves) {
                setMoves(fetchedMoves);
            }
        });

        return () => unsubscribe();

    }, []);

    useEffect(() => {
        if (!gameOver) {
            if (moves.length > movesMade) {
                const lastMove = moves.at(moves.length - 1);
                if (lastMove) {
                    const lastMoveTimestamp = lastMove.timestamp as Timestamp;
                    if (lastMoveTimestamp) {
                        setPlayerTurnId(lastMove.userId == game.playerOneId ? game.playerTwoId ?? "" : game.playerOneId);
                        setMovesMade(moves.length);
                        setMovesCopy(moves);
                    }
                } else {
                    const timeout = setTimeout(async () => {
                        const movesRef = collection(db, "newGames", game.id, "moves");
                        const movesQuery = query(movesRef, orderBy("number", "asc"));

                        const unsubscribe = onSnapshot(movesQuery, async (snapshot) => {

                            const fetchedMoves = snapshot.docs.map((doc) => doc.data() as MoveModel);
                            if (fetchedMoves && fetchedMoves.length > movesMade) {
                                setMoves(fetchedMoves);
                            }
                        });

                        return () => unsubscribe();
                    }, 1000 * 0.5);

                    return () => clearTimeout(timeout);
                }
            } else if (moves.length < movesMade) {
                setGameOver(true);
            }
        }
    }, [moves]);

    useEffect(() => {
        const movesDictUpdate = Object.fromEntries(movesCopy.map((move) => [move.coordinates, move]));
        setMovesDict(movesDictUpdate);
    }, [movesCopy]);

    useEffect(() => {
        const lastMove = movesCopy.at(movesCopy.length - 1);
        if (lastMove) {
            const lastMoveTimestamp = lastMove.timestamp as Timestamp;
            if (lastMoveTimestamp) {
                setPlayerTurnId(lastMove.userId == game.playerOneId ? game.playerTwoId ?? "" : game.playerOneId);

                const lastMoveTime = new Date(lastMoveTimestamp.toDate())
                setAnchorTime(lastMoveTime.getTime())
            }
        }
    }, [movesDict]);

    useEffect(() => {
        const [playerOneTime, playerTwoTime] = ClockFunctions.getTimeRemainingForBothPlayers(game.playerOneId, movesCopy);
        setPlayerOneTimeRemaining(playerOneTime);
        setPlayerTwoTimeRemaining(playerTwoTime);
    }, [anchorTime]);

    useEffect(() => {
        getGameUpdate();
    }, [playerOneTimeRemaining, playerTwoTimeRemaining]);

    async function getGameUpdate() {
        try {
            const fetchedUpdate = await SpectateService.fetchActiveGameById(game.id);
            setUpdatedGame(fetchedUpdate);
        } catch {
            setGameOver(true);
        }
    }


    return {
        updatedGame,
        moves,
        movesCopy,
        movesDict,
        playerTurnId,
        playerOneTimeRemaining,
        playerTwoTimeRemaining,
        gameOver,
        movesMade,
        anchorTime
      };
}
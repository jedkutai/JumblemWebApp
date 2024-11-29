import { useEffect, useState } from "react";
import { useStandardGameManager } from "../../../../Background/Managers/StandardGameManager";
import { GameModel, UserModel, WordModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { CasualGameService } from "../../../../Background/Service";
import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
import { View, VSpacer, VStack } from "../../../../ReactSwiftly";
import CasualGameGrid from "./CasualGameGrid";
import CasualGameHeader from "./CasualGameHeader";
import { Button } from "@mui/material";
import HomeView from "../../Body/HomeView";

interface PlayCasualGameViewProps {
    passedUser: UserModel;
    passedGame: GameModel;

}

export default function PlayCasualGameView({ passedUser, passedGame }: PlayCasualGameViewProps) {
    const {
        moves,
        movesCopy,
        movesDict,
        yourTurn,
        yourTimeRemaining,
        opponentTimeRemaining,
        checkGameOver,
    } = useStandardGameManager(passedUser, passedGame);

    const [user, setUser] = useState<UserModel>(passedUser);
    const [game, setGame] = useState<GameModel>(passedGame);
    const [gameOver, setGameOver] = useState(false);
    const [winningWords, setWinningWords] = useState<WordModel[]>([]);
    const [winningCoordinates, setWinningCoordinates] = useState<string[]>([]);
    const [userTimeExpired, setUserTimeExpired] = useState(false);
    const [checkOpponentTimeExpired, setCheckOpponentTimeExpired] = useState(false);
    const [tickCount, setTickCount] = useState(0);
    const [matchAbortedTicker, setMatchAbortedTicker] = useState(false);
    const [matchAbortedTime, setMatchAbortedTime] = useState(10);
    const [wordCheckComplete, setWordCheckComplete] = useState(true);
    const [winningGridSpots, setWinningGridSpots] = useState<string[]>([]);
    const [view, setView] = useState<"HomeView" | "PlayCasualGameView">("PlayCasualGameView");
    const { width, height } = useWindowSize();

    useEffect(() => {
        setMatchAbortedTicker(!matchAbortedTicker);
        setTickCount(tickCount + 1);
    }, []);

    useEffect(() => {
        if (tickCount < 20 && !gameOver) {
            const timeout = setTimeout(async () => {
                setTickCount(tickCount + 1);
                try {
                    const _ = await CasualGameService.getGameUpdate(game);
                } catch {
                    setGameOver(true);
                }

            }, 1000 * 0.5);

            return () => clearTimeout(timeout);
        }

    }, [tickCount]);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (movesCopy.length === 0 && !gameOver) {
                setMatchAbortedTime(matchAbortedTime - 1);
                setMatchAbortedTicker(!matchAbortedTicker);

                if (matchAbortedTime === 0) {
                    try {
                        await CasualGameService.setGameWinner(game, "aborted", [], []);
                        await CasualGameService.moveFinishedGame(game);
                    } catch {
                        // continue
                    }
                    setGameOver(true);
                }
            }
        }, 1000 * 1);

        return () => clearTimeout(timeout);
    }, [matchAbortedTicker]);

    useEffect(() => {
        if (checkGameOver) {
            setGameOver(true);
        }
    }, [checkGameOver]);

    useEffect(() => {
        wordCheckFunction();
    }, [movesCopy]);

    useEffect(() => {
        const fetchLastMove = async (): Promise<void> => {
            if (checkOpponentTimeExpired && !gameOver) {
                try {
                    let lastMove = await CasualGameService.getFinalMove(game);
                    if (lastMove !== null) {
                        if (lastMove.userId === user.id) {
                            await CasualGameService.setGameWinner(game, user.id, [], []);
                            await CasualGameService.moveFinishedGame(game);
                            setGameOver(true);
                        }
                    }
                } catch (error) {
                    console.error("Checking opp time expired:", error);
                }
            }

            setCheckOpponentTimeExpired(false);
        }

        fetchLastMove();

    }, [checkOpponentTimeExpired]);

    useEffect(() => {
        const doTheThing = async (): Promise<void> => {
            let winnerId: string | undefined;
            if (userTimeExpired && !gameOver) {
                if (user.id !== game.playerOneId) {
                    winnerId = game.playerOneId;
                } else {
                    winnerId = game.playerTwoId;
                }

                if (winnerId) {
                    try {
                        await CasualGameService.setGameWinner(game, winnerId, [], []);
                        await CasualGameService.moveFinishedGame(game);
                        setGameOver(true);
                    } catch {

                    }
                }
            }

            setUserTimeExpired(false);
        }

        doTheThing();


    }, [userTimeExpired]);

    async function wordCheckFunction(): Promise<void> {
        setWordCheckComplete(false);
        try {
            const lastMove = movesCopy.at(movesCopy.length -1);
            if (lastMove) {
                const wordResults = await GameFunctions.checkWords(lastMove, movesDict);
                let winningSpots: Set<string> = new Set();

                for (const [word, coordinates] of wordResults) {
                    winningSpots = new Set(...winningSpots, ...coordinates);
                    winningWords.push(word);
                }
                setWinningGridSpots([...winningSpots]);

                if (winningWords.length !== 0) {
                    let wordArray = winningWords.map(item => item.word);
                    await CasualGameService.setGameWinner(game, lastMove.userId, wordArray, winningGridSpots);
                    await CasualGameService.moveFinishedGame(game);
                    setGameOver(true);
                }
                setWordCheckComplete(true);
            }
        } catch (e) {
            console.error("Error during word check function.", e);
        }

        if (!gameOver) {
            if (movesCopy.length >= 49) {
                if (winningWords.length === 0) {
                    try {
                        await CasualGameService.setGameWinner(game, "draw", [], []);
                        await CasualGameService.moveFinishedGame(game);
                        setGameOver(true);
                    } catch {

                    }
                }
            }
        }

    }

    if (view === "HomeView") {
        return (
            <HomeView user={user}/>
        )
    }

    if (gameOver || checkGameOver) {
        return (
            <View>
                <VStack>
                    <p>Game Over</p>

                    <Button onClick={() => setView("HomeView")}>
                        Home
                    </Button>
                </VStack>
            </View>
        );
    } else {
        return (
            <View>
                <VStack width={`${width}px`} height={`${height}px`}>
                    <VSpacer />

                    <CasualGameHeader
                        userTimeExpired={userTimeExpired}
                        setUserTimeExpired={() => setUserTimeExpired(userTimeExpired)}
                        checkOpponentTimeExpired={checkOpponentTimeExpired}
                        setCheckOpponentTimeExpired={() => setCheckOpponentTimeExpired(checkOpponentTimeExpired)}
                        userId={user.id}
                        opponentId={user.id === game.playerOneId ? game.playerTwoId : game.playerOneId}
                        userTimeRemaining={yourTimeRemaining}
                        opponentTimeRemaining={opponentTimeRemaining}
                        yourTurn={yourTurn}
                        firstMoveMade={movesCopy.length !== 0}
                        gameOver={gameOver}

                    />

                    <VSpacer />

                    <CasualGameGrid
                        user={user}
                        game={game}
                        gameOver={gameOver}
                        wordCheckComplete={wordCheckComplete}
                        matchAbortedTime={matchAbortedTime}
                        movesDict={movesDict}
                        yourTurn={yourTurn}
                        lastMove={moves.length > 0 ? movesCopy[movesCopy.length - 1] : undefined}
                        movesCopy={movesCopy}
                    />

                    <VSpacer />
                </VStack>
            </View>
        );
    }
}
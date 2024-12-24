import { useEffect, useState } from "react";
import { useStandardGameManager } from "../../../../Background/Managers/StandardGameManager";
import { GameModel, MoveModel, UserModel, WordModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { CasualGameService } from "../../../../Background/Service";
import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
import { View, VSpacer, VStack } from "../../../../ReactSwiftly";
import CasualGameGrid from "./CasualGameGrid";
import CasualGameHeader from "./CasualGameHeader";
import { Button } from "@mui/material";
import { ClockFunctions } from "../../../../Background/Utils/ClockFunctions";
import CasualGameOverGrid from "./CasualGameOverGrid";
import JumblemLogoSimple from "../../../Components/JumblemLogoSimple";
import { useNavigate } from "react-router-dom";
import { WordBankFunctions } from "../../../../Background/Utils/WordBankFunctions";

interface PlayCasualGameViewProps {
    passedUser: UserModel;
    passedGame: GameModel;
}

export default function PlayCasualGameView({ passedUser, passedGame }: PlayCasualGameViewProps) {
    const {
        moves,
    } = useStandardGameManager(passedUser, passedGame);

    const [wordBankDict, setWordBankDict] = useState<Record<string, string[]>>({});
    const [user] = useState<UserModel>(passedUser);
    const [game] = useState<GameModel>(passedGame);
    const [gameOver, setGameOver] = useState(false);
    const [winningWords, setWinningWords] = useState<WordModel[]>([]);
    const [userTimeExpired, setUserTimeExpired] = useState(false);
    const [checkOpponentTimeExpired, setCheckOpponentTimeExpired] = useState(false);
    const [tickCount, setTickCount] = useState(0);
    const [matchAbortedTicker, setMatchAbortedTicker] = useState(false);
    const [matchAbortedTime, setMatchAbortedTime] = useState(10);
    const [wordCheckComplete, setWordCheckComplete] = useState(true);
    const [winningGridSpots, setWinningGridSpots] = useState<string[]>([]);
    // const [view, setView] = useState<"HomeView" | "PlayCasualGameView">("PlayCasualGameView");
    const { width, height } = useWindowSize();
    // const dimensionDivider = 9 * 1.75;
    // const upperBound = 650;

    const [movesCopy, setMovesCopy] = useState<MoveModel[]>([]);
    const [movesDict, setMovesDict] = useState<Record<string, MoveModel>>({});
    const [yourTurn, setYourTurn] = useState(false);
    const [yourTimeRemaining, setYourTimeRemaining] = useState(180);
    const [opponentTimeRemaining, setOpponentTimeRemaining] = useState(180);
    const [checkGameOver, setCheckGameOver] = useState(false);
    const [movesMade, setMovesMade] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            onAppearActions();
        } catch {
            setGameOver(true);
        }
    }, []);

    async function onAppearActions() {
        const wordBank = await WordBankFunctions.getWordBank();
        setWordBankDict(wordBank);
        const numberOfKeys = Object.keys(wordBank).length;
        console.log(`onappear: The dictionary has ${numberOfKeys} keys.`);
        setMatchAbortedTicker(!matchAbortedTicker);
        setTickCount(tickCount + 1);
        setYourTurn(game.playerOneId == user.id);
    }

    useEffect(() => {
        if (moves.length > movesMade) {
            setMovesCopy(moves);
        } else if (movesMade === 0) {
            setYourTurn(game.playerOneId == user.id);
        } else {
            // game over stuff
            setCheckGameOver(true);
        }
    }, [moves])



    useEffect(() => {
        if (tickCount < 20 && !gameOver) {
            const timeout = setTimeout(async () => {
                setTickCount(tickCount + 1);
                try {
                    const check = await CasualGameService.getGameUpdate(game);
                    if (check) {

                    }
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
        gameManagerFunction()
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


    function gameManagerFunction() {
        if (movesCopy.length > 0) {
            const movesDictUpdate = Object.fromEntries(movesCopy.map((move) => [move.coordinates, move]));
            setMovesDict(movesDictUpdate);
            setMovesMade(Math.max(movesCopy.length, movesMade));

            const [yourTime, opponentTime] = ClockFunctions.getTimeRemainingForBothPlayers(user.id, movesCopy);
            setYourTimeRemaining(yourTime);
            setOpponentTimeRemaining(opponentTime);

            if (movesCopy[movesCopy.length - 1].userId === user.id) {
                setYourTurn(false);
            } else {
                setYourTurn(true);
            }
        } else if (movesMade == 0) {
            setYourTurn(game.playerOneId == user.id);
        } else {
            setCheckGameOver(true);
        }
    }

    async function wordCheckFunction(): Promise<void> {
        try {
            const lastMove = movesCopy.at(movesCopy.length - 1);
            const checkMovesDict = Object.fromEntries(movesCopy.map((move) => [move.coordinates, move]));
            if (lastMove) {
                setWordCheckComplete(false);
                const wordResults = await GameFunctions.checkWords(lastMove, checkMovesDict, wordBankDict);
                let winningSpots: Set<string> = new Set();
                let updatedWinningWords = [...winningWords]; // Local copy

                for (const [word, coordinates] of wordResults) {
                    winningSpots = new Set([...winningSpots, ...coordinates]);
                    updatedWinningWords.push(word); // Update the local copy
                }

                setWinningWords(updatedWinningWords);
                setWinningGridSpots([...winningSpots]);

                if (updatedWinningWords.length !== 0) {
                    let wordArray = updatedWinningWords.map((item) => item.word);
                    await CasualGameService.setGameWinner(game, lastMove.userId, wordArray, [...winningSpots]);
                    await CasualGameService.moveFinishedGame(game);
                    setGameOver(true);
                }
                setWordCheckComplete(true);
            }
        } catch (e) {
        }

        if (!gameOver) {
            if (movesCopy.length >= 49) {
                if (winningWords.length === 0) { // Use derived or passed variable here
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

    if (gameOver || checkGameOver) {
        return (
            <View>
                <VStack>
                    <JumblemLogoSimple />

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

                    <Button onClick={() => navigate("/home")}>
                        Home
                    </Button>

                    <CasualGameOverGrid
                        user={user}
                        game={game}
                        movesDict={movesDict}
                        winningWords={winningWords}
                        winningGridSpots={winningGridSpots}
                    />



                </VStack>
            </View>
        );
    } else {
        return (
            <View>
                <VStack width={`${width}px`} height={`${height}px`}>
                    {/* <VSpacer /> */}
                    <JumblemLogoSimple />

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
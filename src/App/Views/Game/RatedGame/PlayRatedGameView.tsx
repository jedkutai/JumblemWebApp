import { useEffect, useState } from "react";
import { useStandardGameManager } from "../../../../Background/Managers/StandardGameManager";
import { GameModel, MoveModel, UserModel, WordModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { RatedGameService } from "../../../../Background/Service";
import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
import { View, VSpacer, VStack } from "../../../../ReactSwiftly";
import RatedGameGrid from "./RatedGameGrid";
import RatedGameHeader from "./RatedGameHeader";
import { Button } from "@mui/material";
import { ClockFunctions } from "../../../../Background/Utils/ClockFunctions";
import RatedGameOverGrid from "./RatedGameOverGrid";
import JumblemLogoSimple from "../../../Components/JumblemLogoSimple";
import { useNavigate } from "react-router-dom";
import { WordBankFunctions } from "../../../../Background/Utils/WordBankFunctions";
import HowToPlayHeader from "../../../Components/HowToPlayHeader";

interface PlayRatedGameViewProps {
    passedUser: UserModel;
    passedGame: GameModel;

}

export default function PlayRatedGameView({ passedUser, passedGame }: PlayRatedGameViewProps) {
    const {
        moves,
    } = useStandardGameManager(passedUser, passedGame);
    const [wordBankDict, setWordBankDict] = useState<Record<string, string[]>>({});
    const [user] = useState<UserModel>(passedUser);
    const [game, setGame] = useState<GameModel>(passedGame);
    const [gameOver, setGameOver] = useState(false);
    const [winningWords, setWinningWords] = useState<WordModel[]>([]);
    const [userTimeExpired, setUserTimeExpired] = useState(false);
    const [checkOpponentTimeExpired, setCheckOpponentTimeExpired] = useState(false);
    const [tickCount, setTickCount] = useState(0);
    const [matchAbortedTicker, setMatchAbortedTicker] = useState(false);
    const [matchAbortedTime, setMatchAbortedTime] = useState(15);
    const [wordCheckComplete, setWordCheckComplete] = useState(true);
    const [winningGridSpots, setWinningGridSpots] = useState<string[]>([]);
    // const [view, setView] = useState<"HomeView" | "PlayRatedGameView">("PlayRatedGameView");
    const { width, height } = useWindowSize();

    const [movesCopy, setMovesCopy] = useState<MoveModel[]>([]);
    const [movesDict, setMovesDict] = useState<Record<string, MoveModel>>({});
    const [yourTurn, setYourTurn] = useState(false);
    const [yourTimeRemaining, setYourTimeRemaining] = useState(180);
    const [opponentTimeRemaining, setOpponentTimeRemaining] = useState(180);
    const [checkGameOver, setCheckGameOver] = useState(false);
    const [movesMade, setMovesMade] = useState(0);
    const navigate = useNavigate();

    const [tick, setTick] = useState(false);
    const [userClock, setUserClock] = useState(0);
    const [opponentClock, setOpponentClock] = useState(0);
    const [anchorTime, setAnchorTime] = useState(Date.now());
    const tickRate = 1000 * 0.5;

    useEffect(() => {
        try {
            onAppearActions();
        } catch {
            setGameOver(true);
        }
    }, []);

    useEffect(() => {
        setUserClock(0);
        setOpponentClock(0);
    }, [yourTurn]);

    useEffect(() => {

        if (!gameOver) {
            const timeout = setTimeout(async () => {
                if (movesCopy.length !== 0) {
                    const elapsedSeconds = Math.floor((Date.now() - anchorTime) / 1000);
                    if (yourTurn) {
                        setUserClock(elapsedSeconds);
                        setOpponentClock(0);
                    } else {
                        setUserClock(0);
                        setOpponentClock(elapsedSeconds);
                    }
                }

                if (yourTurn && yourTimeRemaining - userClock <= 0) {
                    setUserTimeExpired(true);
                } else if (!yourTurn && opponentTimeRemaining - opponentClock <= 0) {
                    setCheckOpponentTimeExpired(true);
                }

                setTick(!tick);
            }, tickRate);



            return () => clearTimeout(timeout);
        }
    }, [tick])

    async function onAppearActions() {
        setTick(!tick);
        const wordBank = await WordBankFunctions.getWordBank();
        setWordBankDict(wordBank);
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
        const timeout = setTimeout(async () => {
            if (movesCopy.length === 0 && !gameOver) {
                setMatchAbortedTime(matchAbortedTime - 1);
                setMatchAbortedTicker(!matchAbortedTicker);

                if (matchAbortedTime === 0) {
                    try {
                        await RatedGameService.setGameWinner(game, "aborted", [], []);
                        await RatedGameService.moveFinishedGame(game);
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
        updateGameState();
        // gameManagerFunction()
        // wordCheckFunction();
    }, [movesCopy]);

    useEffect(() => {
        const fetchLastMove = async (): Promise<void> => {
            if (checkOpponentTimeExpired && !gameOver) {
                try {
                    await RatedGameService.setGameWinner(game, user.id, [], []);
                    await RatedGameService.moveFinishedGame(game);
                    setGameOver(true);
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
                        await RatedGameService.setGameWinner(game, winnerId, [], []);
                        await RatedGameService.moveFinishedGame(game);
                        setGameOver(true);
                    } catch {

                    }
                }
            }

            setUserTimeExpired(false);
        }

        doTheThing();


    }, [userTimeExpired]);

    async function updateGameState(): Promise<void> {
        if (movesCopy.length > 0) {
            // Update moves dictionary
            const movesDictUpdate = Object.fromEntries(movesCopy.map((move) => [move.coordinates, move]));
            setMovesDict(movesDictUpdate);
            setMovesMade((prev) => Math.max(movesCopy.length, prev));
    
            // Update time tracking
            const [yourTime, opponentTime] = ClockFunctions.getTimeRemainingForBothPlayers(user.id, movesCopy);
            setYourTimeRemaining(yourTime);
            setOpponentTimeRemaining(opponentTime);
    
            // Set anchor time from last move
            const lastMove = movesCopy[movesCopy.length - 1];
            setAnchorTime(lastMove ? new Date(lastMove.timestamp.toDate()).getTime() : Date.now());
    
            // Determine turn
            setYourTurn(lastMove?.userId !== user.id);
    
            // Perform word validation
            await validateWords(lastMove, movesDictUpdate);
        } else if (movesMade === 0) {
            setYourTurn(game.playerOneId === user.id);
        } else {
            setCheckGameOver(true);
        }
    }
    
    async function validateWords(lastMove: MoveModel | undefined, checkMovesDict: Record<string, MoveModel>): Promise<void> {
        if (!lastMove) return;
    
        try {
            setWordCheckComplete(false);
            const wordResults = await GameFunctions.checkWords(lastMove, checkMovesDict, wordBankDict);
            let winningSpots = new Set<string>();
            let updatedWinningWords = [...winningWords];
    
            for (const [word, coordinates] of wordResults) {
                winningSpots = new Set([...winningSpots, ...coordinates]);
                updatedWinningWords.push(word);
            }
    
            setWinningWords(updatedWinningWords);
            setWinningGridSpots([...winningSpots]);
    
            // Check for a winner
            if (updatedWinningWords.length > 0) {
                await RatedGameService.setGameWinner(game, lastMove.userId, updatedWinningWords.map((item) => item.word), [...winningSpots]);
                await RatedGameService.moveFinishedGame(game);
                setGameOver(true);
            }
        } catch (e) {
            console.error("Error validating words:", e);
        } finally {
            setWordCheckComplete(true);
        }
    
        // Handle game ending scenario
        if (!gameOver && movesCopy.length >= 49 && winningWords.length === 0) {
            try {
                await RatedGameService.setGameWinner(game, "draw", [], []);
                await RatedGameService.moveFinishedGame(game);
                setGameOver(true);
            } catch (e) {
                console.error("Error setting draw:", e);
            }
        }
    }
    

    // function gameManagerFunction() {
    //     if (movesCopy.length > 0) {
    //         const movesDictUpdate = Object.fromEntries(movesCopy.map((move) => [move.coordinates, move]));
    //         setMovesDict(movesDictUpdate);
    //         setMovesMade(Math.max(movesCopy.length, movesMade));

    //         const [yourTime, opponentTime] = ClockFunctions.getTimeRemainingForBothPlayers(user.id, movesCopy);
    //         setYourTimeRemaining(yourTime);
    //         setOpponentTimeRemaining(opponentTime);

    //         const lastMove = movesCopy[movesCopy.length - 1];
    //         if (lastMove) {
    //             const lastMoveTime = new Date(lastMove.timestamp.toDate())
    //             setAnchorTime(lastMoveTime.getTime())
    //         } else {
    //             setAnchorTime(Date.now());
    //         }
            
    //         if (movesCopy[movesCopy.length - 1].userId === user.id) {
    //             setYourTurn(false);
    //         } else {
    //             setYourTurn(true);
    //         }
    //     } else if (movesMade == 0) {
    //         setYourTurn(game.playerOneId == user.id);
    //     } else {
    //         setCheckGameOver(true);
    //     }
    // }

    // async function wordCheckFunction(): Promise<void> {
    //     try {
    //         const lastMove = movesCopy.at(movesCopy.length - 1);
    //         const checkMovesDict = Object.fromEntries(movesCopy.map((move) => [move.coordinates, move]));
    //         if (lastMove) {
    //             setWordCheckComplete(false);
    //             const wordResults = await GameFunctions.checkWords(lastMove, checkMovesDict, wordBankDict);
    //             let winningSpots: Set<string> = new Set();
    //             let updatedWinningWords = [...winningWords]; // Local copy

    //             for (const [word, coordinates] of wordResults) {
    //                 winningSpots = new Set([...winningSpots, ...coordinates]);
    //                 updatedWinningWords.push(word); // Update the local copy
    //             }

    //             setWinningWords(updatedWinningWords);
    //             setWinningGridSpots([...winningSpots]);

    //             if (updatedWinningWords.length !== 0) {
    //                 let wordArray = updatedWinningWords.map((item) => item.word);
    //                 await RatedGameService.setGameWinner(game, lastMove.userId, wordArray, [...winningSpots]);
    //                 await RatedGameService.moveFinishedGame(game);
    //                 setGameOver(true);
    //             }
    //             setWordCheckComplete(true);
    //         }
    //     } catch (e) {
    //     }

    //     if (!gameOver) {
    //         if (movesCopy.length >= 49) {
    //             if (winningWords.length === 0) { // Use derived or passed variable here
    //                 try {
    //                     await RatedGameService.setGameWinner(game, "draw", [], []);
    //                     await RatedGameService.moveFinishedGame(game);
    //                     setGameOver(true);
    //                 } catch {
    //                 }
    //             }
    //         }
    //     }
    // }



    if (gameOver || checkGameOver) {
        return (
            <View>
                <VStack>
                    <HowToPlayHeader versus={true}/>
                    <Button onClick={() => navigate("/home")}>
                        <JumblemLogoSimple />
                    </Button>

                    <RatedGameHeader
                        userId={user.id}
                        opponentId={user.id === game.playerOneId ? game.playerTwoId : game.playerOneId}
                        userTimeRemaining={yourTimeRemaining}
                        opponentTimeRemaining={opponentTimeRemaining}
                        yourTurn={yourTurn}
                        clock={yourTurn ? userClock : opponentClock}
                        userRatingChange={user.id === game.playerOneId ? game.playerOneRatingChange : game.playerTwoRatingChange}
                        opponentRatingChange={user.id !== game.playerOneId ? game.playerOneRatingChange : game.playerTwoRatingChange}
                    />



                    <RatedGameOverGrid
                        user={user}
                        game={game}
                        setGame={setGame}
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
                    <HowToPlayHeader versus={true} />
                    <JumblemLogoSimple />

                    <RatedGameHeader
                        userId={user.id}
                        opponentId={user.id === game.playerOneId ? game.playerTwoId : game.playerOneId}
                        userTimeRemaining={yourTimeRemaining}
                        opponentTimeRemaining={opponentTimeRemaining}
                        yourTurn={yourTurn}
                        clock={yourTurn ? userClock : opponentClock}

                    />

                    <RatedGameGrid
                        user={user}
                        game={game}
                        gameOver={gameOver}
                        wordCheckComplete={wordCheckComplete}
                        matchAbortedTime={matchAbortedTime}
                        movesDict={movesDict}
                        yourTurn={yourTurn}
                        setYourTurn={setYourTurn}
                        lastMove={moves.length > 0 ? movesCopy[movesCopy.length - 1] : undefined}
                        movesCopy={movesCopy}
                    />

                    <VSpacer />
                </VStack>
            </View>
        );
    }
}
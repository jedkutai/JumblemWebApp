import { useEffect, useState } from "react";
import { useStandardGameManager } from "../../../../Background/Managers/StandardGameManager";
import { GameModel, MoveModel, UserModel, WordModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { Button } from "@mui/material";
import { PrivateGameService } from "../../../../Background/Service";
import { ClockFunctions } from "../../../../Background/Utils/ClockFunctions";
import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
import { View, VStack, VSpacer } from "../../../../ReactSwiftly";
import HomeView from "../../Body/HomeView";
import PrivateGameHeader from "./PrivateGameHeader";
import PrivateGameGrid from "./PrivateGameGrid";
import PrivateGameOverGrid from "./PrivateGameOverGrid";
// import RematchButton from "../../../Components/RematchButton";
import RematchController from "./PrivateRematch/RematchController";
import JumblemLogoSimple from "../../../Components/JumblemLogoSimple";
import { useNavigate } from "react-router-dom";
import { WordBankFunctions } from "../../../../Background/Utils/WordBankFunctions";
import HowToPlayHeader from "../../../Components/HowToPlayHeader";

interface PlayPrivateGameViewProps {
    passedUser: UserModel;
    passedGame: GameModel;
}

export default function PlayPrivateGameView({
    passedUser,
    passedGame,
}: PlayPrivateGameViewProps) {
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
    const [matchAbortedTime, setMatchAbortedTime] = useState(15);
    const [wordCheckComplete, setWordCheckComplete] = useState(true);
    const [winningGridSpots, setWinningGridSpots] = useState<string[]>([]);
    const [view, setView] = useState<"HomeView" | "PlayPrivateGameView" | "PrivateRematchView">("PlayPrivateGameView");
    const { width, height } = useWindowSize();

    const [movesCopy, setMovesCopy] = useState<MoveModel[]>([]);
    const [movesDict, setMovesDict] = useState<Record<string, MoveModel>>({});
    const [yourTurn, setYourTurn] = useState(false);
    const [yourTimeRemaining, setYourTimeRemaining] = useState(180);
    const [opponentTimeRemaining, setOpponentTimeRemaining] = useState(180);
    const [checkGameOver, setCheckGameOver] = useState(false);
    const [movesMade, setMovesMade] = useState(0);

    const [rematchOffered, setRematchedOffered] = useState(false);
    const [rematchTicker, setRematchTicker] = useState(false);
    const [stopRematchTicker, setStopRematchTicker] = useState(false);
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
        if (gameOver) {
            setRematchTicker(!rematchTicker);
        }
    }, [gameOver]);

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

    // useEffect(() => {
    //     if (tickCount < 20 && !gameOver) {
    //         const timeout = setTimeout(async () => {
    //             setTickCount(tickCount + 1);
    //             try {
    //                 const update = await PrivateGameService.getGameUpdate(game);
    //                 if (update) {

    //                 }
    //             } catch {
    //                 setGameOver(true);
    //             }

    //         }, 1000 * 0.5);

    //         return () => clearTimeout(timeout);
    //     }

    // }, [tickCount]);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (movesCopy.length === 0 && !gameOver) {
                setMatchAbortedTime(matchAbortedTime - 1);
                setMatchAbortedTicker(!matchAbortedTicker);

                if (matchAbortedTime === 0) {
                    try {
                        await PrivateGameService.setGameWinner(game, "aborted", [], []);
                        await PrivateGameService.moveFinishedGame(game);
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
                    await PrivateGameService.setGameWinner(game, user.id, [], []);
                    await PrivateGameService.moveFinishedGame(game);
                    setGameOver(true);
                    // let lastMove = await PrivateGameService.getFinalMove(game);
                    // if (lastMove !== null) {
                    //     if (lastMove.userId === user.id) {
                    //         await PrivateGameService.setGameWinner(game, user.id, [], []);
                    //         await PrivateGameService.moveFinishedGame(game);
                    //         setGameOver(true);
                    //     }
                    // }
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
                        await PrivateGameService.setGameWinner(game, winnerId, [], []);
                        await PrivateGameService.moveFinishedGame(game);
                        setGameOver(true);
                    } catch {

                    }
                }
            }

            setUserTimeExpired(false);
        }

        doTheThing();


    }, [userTimeExpired]);

    useEffect(() => {
        if (!stopRematchTicker || !gameOver) {
            rematchTickerActions();
        }
    }, [rematchTicker]);

    async function rematchTickerActions() {
        const timeout = setTimeout(async () => {
            try {
                const result = await PrivateGameService.checkIfRematchOffered(user, game);
                setRematchedOffered(result);
            } catch {

            }
            setRematchTicker(!rematchTicker);
        }, 1000);

        return () => clearTimeout(timeout);
    }

    function gameManagerFunction() {
        if (movesCopy.length > 0) {
            const movesDictUpdate = Object.fromEntries(movesCopy.map((move) => [move.coordinates, move]));
            setMovesDict(movesDictUpdate);
            setMovesMade(Math.max(movesCopy.length, movesMade));

            const [yourTime, opponentTime] = ClockFunctions.getTimeRemainingForBothPlayers(user.id, movesCopy);
            setYourTimeRemaining(yourTime);
            setOpponentTimeRemaining(opponentTime);

            const lastMove = movesCopy[movesCopy.length - 1];
            if (lastMove) {
                const lastMoveTime = new Date(lastMove.timestamp.toDate())
                setAnchorTime(lastMoveTime.getTime())
            } else {
                setAnchorTime(Date.now());
            }
            
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
                    await PrivateGameService.setGameWinner(game, lastMove.userId, wordArray, [...winningSpots]);
                    await PrivateGameService.moveFinishedGame(game);
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
                        await PrivateGameService.setGameWinner(game, "draw", [], []);
                        await PrivateGameService.moveFinishedGame(game);
                        setGameOver(true);
                    } catch {
                    }
                }
            }
        }
    }

    function navigateRematchView() {
        setView("PrivateRematchView");
        setStopRematchTicker(true);
    }

    switch (view) {
        case "HomeView":
            return (
                <HomeView passedUser={user} />
            );
        case "PrivateRematchView":
            return (
                <RematchController
                    passedUser={user}
                    previousGame={game}
                />
            );
    }

    if (gameOver || checkGameOver) {
        return (
            <View>
                <VStack>
                    <HowToPlayHeader versus={true}/>
                    <Button onClick={() => navigate("/home")}>
                        <JumblemLogoSimple />
                    </Button>

                    <PrivateGameHeader
                        userId={user.id}
                        opponentId={user.id === game.playerOneId ? game.playerTwoId : game.playerOneId}
                        userTimeRemaining={yourTimeRemaining}
                        opponentTimeRemaining={opponentTimeRemaining}
                        yourTurn={yourTurn}
                        clock={yourTurn ? userClock : opponentClock}
                    />


                    <PrivateGameOverGrid
                        user={user}
                        game={game}
                        movesDict={movesDict}
                        winningWords={winningWords}
                        winningGridSpots={winningGridSpots}
                        navigateRematchView={navigateRematchView}
                        rematchOffered={rematchOffered}
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

                    <PrivateGameHeader
                        userId={user.id}
                        opponentId={user.id === game.playerOneId ? game.playerTwoId : game.playerOneId}
                        userTimeRemaining={yourTimeRemaining}
                        opponentTimeRemaining={opponentTimeRemaining}
                        yourTurn={yourTurn}
                        clock={yourTurn ? userClock : opponentClock}
                    />

                    <PrivateGameGrid
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
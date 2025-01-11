// import { Button } from "@mui/material";
import { View, VSpacer, VStack } from "../../../../ReactSwiftly";
import JumblemLogoSimple from "../../../Components/JumblemLogoSimple";
import { GuestService } from "../../../../Background/Service";
import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
import { ClockFunctions } from "../../../../Background/Utils/ClockFunctions";
import { useEffect, useState } from "react";
import { WordBankFunctions } from "../../../../Background/Utils/WordBankFunctions";
import { useNavigate } from "react-router-dom";
import { GameModel, MoveModel, UserModel, WordModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { useStandardGameManager } from "../../../../Background/Managers/StandardGameManager";
import GuestCasualGameHeader from "./GuestCasualGameHeader";
import GuestCasualGameGrid from "./GuestCasualGameGrid";
import GuestCasualGameOverGrid from "./GuestCasualGameOverGrid";
import { Button } from "@mui/material";
import HowToPlayHeader from "../../../Components/HowToPlayHeader";

interface GuestPlayCasualGameViewProps {
    passedUser: UserModel;
    passedGame: GameModel;
}

export default function GuestPlayCasualGameView({ passedUser, passedGame }: GuestPlayCasualGameViewProps) {
    const {
        moves,
    } = useStandardGameManager(passedUser, passedGame);

    const [wordBankDict, setWordBankDict] = useState<Record<string, string[]>>({});
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

        const lastMove = movesCopy[movesCopy.length - 1];
        if (lastMove) {
            const lastMoveTime = new Date(lastMove.timestamp.toDate())
            setAnchorTime(lastMoveTime.getTime())
        } else {
            setAnchorTime(Date.now());
        }
    }, [yourTurn]);

    useEffect(() => {

        if (!gameOver) {
            const timeout = setTimeout(async () => {
                if (movesCopy.length !== 0) {

                    const elapsedSeconds = Math.floor((Date.now() - anchorTime) / 1000);
                    if (yourTurn) {
                        setUserClock(elapsedSeconds);
                    } else {
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
        setYourTurn(game.playerOneId == passedUser.id);
    }

    useEffect(() => {
        if (moves.length > movesMade) {
            setMovesCopy(moves);
        } else if (movesMade === 0) {
            setYourTurn(game.playerOneId == passedUser.id);
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
                    const check = await GuestService.getGameUpdate(game);
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
                        await GuestService.setGameWinner(game, "aborted", [], []);
                        await GuestService.moveFinishedGame(game);
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
                    await GuestService.setGameWinner(game, passedUser.id, [], []);
                    await GuestService.moveFinishedGame(game);
                    setGameOver(true);
                    // let lastMove = await GuestService.getFinalMove(game);
                    // if (lastMove !== null) {
                    //     if (lastMove.userId === passedUser.id) {
                    //         await GuestService.setGameWinner(game, passedUser.id, [], []);
                    //         await GuestService.moveFinishedGame(game);
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
                if (passedUser.id !== game.playerOneId) {
                    winnerId = game.playerOneId;
                } else {
                    winnerId = game.playerTwoId;
                }

                if (winnerId) {
                    try {
                        await GuestService.setGameWinner(game, winnerId, [], []);
                        await GuestService.moveFinishedGame(game);
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

            const [yourTime, opponentTime] = ClockFunctions.getTimeRemainingForBothPlayers(passedUser.id, movesCopy);
            setYourTimeRemaining(yourTime);
            setOpponentTimeRemaining(opponentTime);

            if (movesCopy[movesCopy.length - 1].userId === passedUser.id) {
                setYourTurn(false);
            } else {
                setYourTurn(true);
            }
        } else if (movesMade == 0) {
            setYourTurn(game.playerOneId == passedUser.id);
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
                    await GuestService.setGameWinner(game, lastMove.userId, wordArray, [...winningSpots]);
                    await GuestService.moveFinishedGame(game);
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
                        await GuestService.setGameWinner(game, "draw", [], []);
                        await GuestService.moveFinishedGame(game);
                        setGameOver(true);
                    } catch {
                    }
                }
            }
        }
    }

    if (gameOver || checkGameOver) {
        return (
            <View startAtTop={true}>
                <VStack>
                    <HowToPlayHeader versus={true} />
                    <Button onClick={() => navigate("/home")}>
                        <JumblemLogoSimple />
                    </Button>

                    <GuestCasualGameHeader
                        userId={passedUser.id}
                        opponentId={passedUser.id === game.playerOneId ? game.playerTwoId : game.playerOneId}
                        userTimeRemaining={yourTimeRemaining}
                        opponentTimeRemaining={opponentTimeRemaining}
                        yourTurn={yourTurn}
                        clock={yourTurn ? userClock : opponentClock}
                    />


                    <GuestCasualGameOverGrid
                        user={passedUser}
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
            <View startAtTop={true}>
                <VStack width={`${width}px`} height={`${height}px`}>
                    <HowToPlayHeader versus={true} />
                    <JumblemLogoSimple />

                    <GuestCasualGameHeader
                        userId={passedUser.id}
                        opponentId={passedUser.id === game.playerOneId ? game.playerTwoId : game.playerOneId}
                        userTimeRemaining={yourTimeRemaining}
                        opponentTimeRemaining={opponentTimeRemaining}
                        yourTurn={yourTurn}
                        clock={yourTurn ? userClock : opponentClock}
                    />

                    <GuestCasualGameGrid
                        user={passedUser}
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
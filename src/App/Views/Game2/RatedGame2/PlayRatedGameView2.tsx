import { useEffect, useState } from "react";
import { useStandardGameManager2 } from "../../../../Background/Managers/StandardGameManager2";
import { UserModel, GameModel, WordModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { WordBankFunctions } from "../../../../Background/Utils/WordBankFunctions";
import { RatedGameService } from "../../../../Background/Service";
import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
import { View, VStack } from "../../../../ReactSwiftly";
import HowToPlayHeader from "../../../Components/HowToPlayHeader";
import JumblemLogoSimple from "../../../Components/JumblemLogoSimple";
import RatedGameGrid2 from "./RatedGameGrid2";
import RatedGameHeader2 from "./RatedGameHeader2";
import RatedGameOverGrid from "./RatedGameOverGrid";


interface PlayRatedGameView2Props {
    passedUser: UserModel;
    passedGame: GameModel;
}

export default function PlayRatedGameView2({ passedUser, passedGame }: PlayRatedGameView2Props) {
    const {
        movesCopy,
        movesDict,
        yourTurn,
        yourTimeRemaining,
        opponentTimeRemaining,
        checkGameOver,
        anchorTime,
        processComplete,
        movesMade
    } = useStandardGameManager2(passedUser, passedGame);
    const { width, height } = useWindowSize();

    const user: UserModel = passedUser;
    const [game, setGame] = useState<GameModel>(passedGame);
    const [wordBankDict, setWordBankDict] = useState<Record<string, string[]>>({});

    const [gameOver, setGameOver] = useState(false);
    const [wordCheckComplete, setWordCheckComplete] = useState(true);
    const [userTimeExpired, setUserTimeExpired] = useState(false);
    const [checkOpponentTimeExpired, setCheckOpponentTimeExpired] = useState(false);
    const [winningWords, setWinningWords] = useState<WordModel[]>([]);
    const [winningGridSpots, setWinningGridSpots] = useState<string[]>([]);

    const [matchAbortedTimer, setMatchAbortedTime] = useState(15);
    const [tickCount, setTickCount] = useState(0);
    const [matchAbortedTicker, setMatchAbortedTicker] = useState(false);

    async function onAppearActions() {
        const wordBank = await WordBankFunctions.getWordBank();
        setWordBankDict(wordBank);
    }

    async function wordCheckFunction(): Promise<void> {
        try {
            const lastMove = movesCopy.at(movesCopy.length - 1);
            if (lastMove) {
                console.log("Last move found");
                setWordCheckComplete(false);
                const wordResults = await GameFunctions.checkWords(lastMove, movesDict, wordBankDict);
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
                    await RatedGameService.setGameWinner(game, lastMove.userId, wordArray, [...winningSpots]);
                    await RatedGameService.moveFinishedGame(game);
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
                        await RatedGameService.setGameWinner(game, "draw", [], []);
                        await RatedGameService.moveFinishedGame(game);
                        setGameOver(true);
                    } catch {
                    }
                }
            }
        }
    }

    useEffect(() => {
        onAppearActions();
    }, []);

    useEffect(() => {
        setMatchAbortedTicker(!matchAbortedTicker);
        setTickCount(tickCount + 1);
    }, [wordBankDict])

    useEffect(() => {
        if (tickCount < 20 && !gameOver) {
            const timeout = setTimeout(async () => {
                setTickCount(tickCount + 1);
                try {
                    const check = await RatedGameService.getGameUpdate(game);
                    if (check) {

                    }
                } catch {
                    setGameOver(true);
                }

            }, 1000 * 0.5);

            return () => clearTimeout(timeout);
        }
    }, [tickCount])

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (movesCopy.length == 0 && !gameOver) {
                setMatchAbortedTime(matchAbortedTimer - 1);
                setMatchAbortedTicker(!matchAbortedTicker);

                if (matchAbortedTimer == 0) {
                    try {
                        await RatedGameService.setGameWinner(game, "aborted", [], []);
                        await RatedGameService.moveFinishedGame(game);
                    } catch {

                    }

                    setGameOver(true);
                }
            }

        }, 1000 * 1);

        return () => clearTimeout(timeout);
    }, [matchAbortedTicker]);

    useEffect(() => {
        setGameOver(checkGameOver);
    }, [checkGameOver]);

    useEffect(() => {
        wordCheckFunction();
    }, [movesDict]);

    useEffect(() => {
        if (checkOpponentTimeExpired && !gameOver) {
            const fetchLastMove = async (): Promise<void> => {
                if (checkOpponentTimeExpired && !gameOver) {
                    try {
                        await RatedGameService.setGameWinner(game, user.id, [], []);
                        await RatedGameService.moveFinishedGame(game);
                        setGameOver(true);
                    } catch {
                    }
                }
                setCheckOpponentTimeExpired(false);
            }
            fetchLastMove();
        }


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


    if (gameOver) {
        return (
            <View startAtTop={true}>
                <VStack width={`${width}px`} height={`${height}px`}>
                    <HowToPlayHeader versus={true} />
                    <JumblemLogoSimple />

                    <RatedGameHeader2
                        setUserTimeExpired={setUserTimeExpired}
                        setCheckOpponentTimeExpired={setCheckOpponentTimeExpired}
                        userId={user.id}
                        opponentId={user.id === game.playerOneId ? game.playerTwoId : game.playerOneId}
                        userTimeRemaining={yourTimeRemaining}
                        opponentTimeRemaining={opponentTimeRemaining}
                        yourTurn={yourTurn}
                        firstMoveMade={(movesCopy.length > 0)}
                        gameOver={gameOver}
                        anchorTime={anchorTime}
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
            <View startAtTop={true}>
                <VStack width={`${width}px`} height={`${height}px`}>
                    <HowToPlayHeader versus={true} />
                    <JumblemLogoSimple />

                    <RatedGameHeader2
                        setUserTimeExpired={setUserTimeExpired}
                        setCheckOpponentTimeExpired={setCheckOpponentTimeExpired}
                        userId={user.id}
                        opponentId={user.id === game.playerOneId ? game.playerTwoId : game.playerOneId}
                        userTimeRemaining={yourTimeRemaining}
                        opponentTimeRemaining={opponentTimeRemaining}
                        yourTurn={yourTurn}
                        firstMoveMade={(movesCopy.length > 0)}
                        gameOver={gameOver}
                        anchorTime={anchorTime}
                    />

                    <RatedGameGrid2
                        user={user}
                        game={game}
                        movesDict={movesDict}
                        yourTurn={yourTurn}
                        movesCopy={movesCopy}
                        processComplete={processComplete}
                        gameOver={gameOver}
                        wordCheckComplete={wordCheckComplete}
                        matchAbortedTimer={matchAbortedTimer}
                        movesMade={movesMade}
                    />
                </VStack>
            </View>
        );
    }
}
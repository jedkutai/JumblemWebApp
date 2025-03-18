import { useState, useEffect } from "react";
import { useStandardGameManager2 } from "../../../../../Background/Managers/StandardGameManager2";
import { UserModel, GameModel, WordModel } from "../../../../../Background/Models";
import { CasualGameService } from "../../../../../Background/Service";
import { GameFunctions } from "../../../../../Background/Utils/GameFunctions";
import { useWindowSize } from "../../../../../Background/Utils/useWindowSize";
import { WordBankFunctions } from "../../../../../Background/Utils/WordBankFunctions";
import { View, VStack } from "../../../../../ReactSwiftly";
import HowToPlayHeader from "../../../../Components/HowToPlayHeader";
import JumblemLogoSimple from "../../../../Components/JumblemLogoSimple";
import CasualGameGrid2 from "../CasualGameGrid2";
import CasualGameHeader2 from "../CasualGameHeader2";
import CasualGameOverGrid2 from "../CasualGameOverGrid2";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";


interface BotPlayCasualGameView2Props {
    passedUser: UserModel;
    passedGame: GameModel;
}

export default function BotPlayCasualGameView2({ passedUser, passedGame }: BotPlayCasualGameView2Props) {
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
    const game: GameModel = passedGame;
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

    const [botLetterBank, setBotLetterBank] = useState<string[]>(GameFunctions.getLetters(7));

    const navigate = useNavigate();
    
    async function onAppearActions() {
        const wordBank = await WordBankFunctions.getWordBank();
        setWordBankDict(wordBank);
    }

    async function wordCheckFunction(): Promise<void> {
        try {
            const lastMove = movesCopy.at(movesCopy.length - 1);
            if (lastMove) {
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

    async function botMove() {
        if (wordCheckComplete) {
            if (!gameOver) {
                if (!yourTurn) {
                    const letterBank = botLetterBank;
                    const moveDelay = (movesCopy.length < 6 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 5)) + 2;
                    const timeout = setTimeout(async () => {
                        try {
                            const [resultCoordinates, resultLetter] = await GameFunctions.botMove(botLetterBank, movesDict, wordBankDict, (movesMade + 1));
                            await CasualGameService.makeBotMove(user, game, resultCoordinates, resultLetter, (movesMade + 1), letterBank);
                            const indexToRemove = botLetterBank.indexOf(resultLetter);
                            botLetterBank.splice(indexToRemove, 1);

                            const newLetters = GameFunctions.getLetters(1);
                            const updatedLetters: string[] = [...botLetterBank, ...newLetters];
                            updatedLetters.sort();
                            setBotLetterBank(updatedLetters);

                        } catch {

                        }

                    }, 1000 * moveDelay);
                    return () => clearTimeout(timeout);


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
                    const check = await CasualGameService.getGameUpdate(game);
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
                        await CasualGameService.setGameWinner(game, "aborted", [], []);
                        await CasualGameService.moveFinishedGame(game);
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
                        await CasualGameService.setGameWinner(game, user.id, [], []);
                        await CasualGameService.moveFinishedGame(game);
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

    useEffect(() => {
        if (wordCheckComplete && processComplete && !yourTurn && !gameOver) {
            botMove();
        }

    }, [wordCheckComplete, processComplete]);

    if (gameOver) {
        return (
            <View startAtTop={true}>
                <VStack width={`${width}px`} height={`${height}px`}>
                    <HowToPlayHeader versus={true} />
                    <Button onClick={() => navigate("/home")}>
                        <JumblemLogoSimple />
                    </Button>

                    <CasualGameHeader2
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

                    <CasualGameOverGrid2
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
            <View startAtTop={true}>
                <VStack width={`${width}px`} height={`${height}px`}>
                    <HowToPlayHeader versus={true} />
                    <JumblemLogoSimple />
                    <CasualGameHeader2
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

                    <CasualGameGrid2
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
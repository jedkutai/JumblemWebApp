import { useEffect, useState } from "react";
import { MoveModel, UserModel, WordModel } from "../../../../Background/Models";
import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
import { View, VStack } from "../../../../ReactSwiftly";
import JumblemLogoSimple from "../../../Components/JumblemLogoSimple";
import VersusCrashCourseHeader from "./VersusCrashCourseHeader";
// import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import VersusCrashCourseGrid from "./VersusCrashCourseGrid";
import { Timestamp } from "firebase/firestore";
import { WordBankFunctions } from "../../../../Background/Utils/WordBankFunctions";
import VersusCrashCourseGameOverGrid from "./VersusCrashCourseGameOverGrid";
import HowToPLayVersus from "../../../Views/HowToPlay/HowToPlayVersus";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { UserModelGuest } from "../../../../Background/Extends/UserModelGuest";

enum GameState {
    intro,
    howTo,
    active,
    draw,
    userWins,
    botWins
}



export default function VersusCrashCourse() {
    const user: UserModel = UserModelGuest;
    const [wordBankDict, setWordBankDict] = useState<Record<string, string[]>>({});
    const [gameState, setGameState] = useState<GameState>(GameState.intro);
    const [moves, setMoves] = useState<MoveModel[]>([]);
    const [movesDict, setMovesDict] = useState<Record<string, MoveModel>>({});
    const [yourTurn, setYourTurn] = useState<boolean>(true);

    const [gameOver, setGameOver] = useState<boolean>(false);
    const [wordCheckComplete, setWordCheckComplete] = useState<boolean>(true);
    const [winningWords, setWinningWords] = useState<WordModel[]>([]);
    const [winningGridSpots, setWinningGridSpots] = useState<string[]>([]);
    const [botLetterBank, setBotLetterBank] = useState<string[]>(GameFunctions.getLetters(7));

    const [lastMove, setLastMove] = useState<MoveModel | undefined>(undefined);
    const {height} = useWindowSize();

    const style = {
        button: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(227, 218, 195)",
            color: "black",
            fontWeight: 600,
        },
        
    }

    useEffect(() => {
        onAppearActions();
    }, []);
    useEffect(() => {
        if (gameState == GameState.intro) {
            // clear everything
            setMoves([]);
            setMovesDict({});
            setYourTurn(true);
            setGameOver(false);
            setWordCheckComplete(true);
            setWinningWords([]);
            setWinningGridSpots([]);
            setBotLetterBank(GameFunctions.getLetters(7));
            setLastMove(undefined);

        } else if (gameState == GameState.draw || gameState == GameState.userWins || gameState == GameState.botWins) {
            // set user has played
            localStorage.setItem("versusCrashCoursePlayed", "true");
        }
    }, [gameState]);

    useEffect(() => {
        if (moves.length > 0) {
            setLastMove(moves.at(moves.length - 1));
            gameManagerFunction();
        }
        // wordCheckFunction();
    }, [moves])

    useEffect(() => {
        wordCheckFunction();
    }, [movesDict])

    useEffect(() => {
        if (!yourTurn && !gameOver) {
            botMove();
        }
    }, [yourTurn]);

    async function onAppearActions() {
        const wordBank = await WordBankFunctions.getWordBank();
        setWordBankDict(wordBank);
    }

    function gameManagerFunction() {
        if (moves.length > 0) {
            const movesDictUpdate = Object.fromEntries(moves.map((move) => [move.coordinates, move]));
            setMovesDict(movesDictUpdate);


            setYourTurn(moves.length % 2 == 0);
        }
    }

    async function wordCheckFunction(): Promise<void> {
        try {
            const checkMovesDict = Object.fromEntries(moves.map((move) => [move.coordinates, move]));
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
                    setGameState(moves.length % 2 == 1 ? GameState.userWins : GameState.botWins);
                    setGameOver(true);
                } else {
                    setWordCheckComplete(true);
                }
                
            }
        } catch (e) {
        }

        if (!gameOver) {
            if (moves.length >= 49) {
                if (winningWords.length === 0) {
                    setGameOver(true);
                    setGameState(GameState.draw);

                }
            }
        }
    }

    async function botMove() {
        if (wordCheckComplete) {
            if (!gameOver) {
                if (!yourTurn) {
                    const moveDelay = 3;
                    const timeout = setTimeout(async () => {
                        try {
                            const [resultCoordinates, resultLetter] = await GameFunctions.introBotMove(botLetterBank, moves, wordBankDict);
                            const indexToRemove = botLetterBank.indexOf(resultLetter);
                            botLetterBank.splice(indexToRemove, 1);

                            const newLetters = GameFunctions.getLetters(1);
                            const updatedLetters: string[] = [...botLetterBank, ...newLetters];
                            updatedLetters.sort();
                            setBotLetterBank(updatedLetters);

                            const newMove: MoveModel = {
                                id: `${moves.length}`,
                                gameId: "bootCamp",
                                userId: "bot",
                                coordinates: resultCoordinates,
                                letter: resultLetter,
                                timestamp: Timestamp.now()
                            }

                            let newMoves = [...moves, newMove]
                            setMoves(newMoves);

                        } catch {

                        }

                    }, 1000 * moveDelay);
                    return () => clearTimeout(timeout);
                }
            }
        }
    }

    return (
        <View startAtTop={true}>
            <VStack>
                <>

                    {gameState == GameState.intro && (
                        <>
                            <JumblemLogoSimple />
                            <Typography>{"Versus Crash Course".toUpperCase()}</Typography>
                            
                            <div style={{ height: `${Math.max((height - 200) * .4, 100)}px` }}></div>
                            <Button variant="contained" style={style.button} onClick={() => setGameState(GameState.howTo)}>
                                CONTINUE
                            </Button>
                        </>


                    )}

                    {gameState == GameState.howTo && (
                        <>
                            <Button onClick={() => setGameState(GameState.active)}>
                                Next
                            </Button>
                            <HowToPLayVersus />
                            <Button onClick={() => setGameState(GameState.active)}>
                                Next
                            </Button>
                        </>
                    )}

                    {gameState == GameState.active && (
                        <>
                            <JumblemLogoSimple />
                            <VersusCrashCourseHeader user={user} yourTurn={yourTurn} />
                            <VersusCrashCourseGrid
                                user={user}
                                wordCheckComplete={wordCheckComplete}
                                yourTurn={yourTurn}
                                gameOver={gameOver}
                                setGameOver={setGameOver}
                                movesDict={movesDict}
                                setMovesDict={setMovesDict}
                                moves={moves}
                                setMoves={setMoves}
                            />
                        </>
                    )}
                    {gameState == GameState.draw || gameState == GameState.userWins || gameState == GameState.botWins  && (
                        <>
                            <JumblemLogoSimple />
                            <VersusCrashCourseHeader user={user} yourTurn={yourTurn} />

                            <VersusCrashCourseGameOverGrid
                                movesDict={movesDict}
                                winningWords={winningWords}
                                winningGridSpots={winningGridSpots}
                                gameState={gameState}
                                setGameState={setGameState}
                            />
                        </>
                    )}
                </>
            </VStack>
        </View>
    );
}
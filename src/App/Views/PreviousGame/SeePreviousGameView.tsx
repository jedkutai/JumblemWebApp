import { useEffect, useState } from "react";
import { GameModel, MoveModel, WordModel } from "../../../Background/Models";
import { HSpacer, HStack, View, VStack } from "../../../ReactSwiftly";
import PreviousGameGrid from "./PreviousGameGrid";
import { Button, CircularProgress, Typography } from "@mui/material";
import { FetchService, GameService } from "../../../Background/Service";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import PreviousGameFunctionBar from "./PreviousGameFunctionBar";
import PreviousGamePlayerHeader from "./PreviousGamePlayerHeader";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import PreviousGameRatedPlayerHeader from "./PreviousGameRatedPlayerHeaderProps";
import { useNavigate } from "react-router-dom";
import { ColoredWord } from "../../Components";
import WordRarityBar from "../../Components/WordRarityBar";
import { WordBankFunctions } from "../../../Background/Utils/WordBankFunctions";

interface SeePreviousGameViewProps {
    previousGame: GameModel;
}

export default function SeePreviousGameView({ previousGame }: SeePreviousGameViewProps) {
    const [wordBankDict, setWordBankDict] = useState<Record<string, string[]>>({});
    const [lastMovePlayerId, setLastMovePlayerId] = useState("");
    const [moves, setMoves] = useState<MoveModel[] | null>(null);
    const [movesDict, setMovesDict] = useState<Record<string, MoveModel>>({});
    // const [showWinningWords, setShowWinningWords] = useState(false);
    const [winningWords, setWinningWords] = useState<WordModel[]>([]);
    const [currentMove, setCurrentMove] = useState(49);
    const [maxMoves, setMaxMoves] = useState(49);
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const { minDimension } = useWindowSize();
    const navigate = useNavigate();

    useEffect(() => {
        onAppearActions();
    }, []);

    useEffect(() => {
        onChangeOfCurrentMove();
    }, [currentMove]);

    function onChangeOfCurrentMove() {
        if (moves) {
            const newMovesDict = Object.fromEntries(moves.slice(0, currentMove).map((move) => [move.coordinates, move]));
            setMovesDict(newMovesDict);
            const lastMove = moves[currentMove - 1];
            if (lastMove) {
                setLastMovePlayerId(lastMove.userId);
            } else {
                setLastMovePlayerId("");
            }
        }
    }

    async function onAppearActions() {
        try {
            const wordBank = await WordBankFunctions.getWordBank();
            setWordBankDict(wordBank);
            if (previousGame.winningWords) {
                let fetchedWords: WordModel[] = [];
                for (const word of previousGame.winningWords) {
                    const wordModel = await FetchService.fetchWordModelByWord(word, wordBankDict);
                    fetchedWords.push(wordModel);
                }
                fetchedWords.sort((a, b) => a.word.localeCompare(b.word));
                setWinningWords(fetchedWords);
            }

            const fetchedMoves = await GameService.fetchMoves(previousGame.id);
            setMoves(fetchedMoves);
            setMaxMoves(fetchedMoves.length);
            setCurrentMove(fetchedMoves.length);


        } catch {
            setMoves(null);
            setCurrentMove(0);
            setMaxMoves(0);
        }
    }

    function goToPreviousMove() {
        if (currentMove > 1) {
            setCurrentMove(currentMove - 1);
        }
    }

    function goToNextMove() {
        if (currentMove < maxMoves) {
            setCurrentMove(currentMove + 1);
        }
    }

    function goToFirstMove() {
        setCurrentMove(1);
    }

    function goToLastMove() {
        setCurrentMove(maxMoves);
    }


    return (
        <View>
            {previousGame.playerTwoId ? (
                <>
                    {moves ? (
                        <VStack>
                            <Button onClick={() => navigate("/home")}>
                                <JumblemLogoSimple />
                            </Button>
                            {previousGame.gameMode === "standard" ? (
                                <HStack maxWidth="400px">
                                    <HSpacer />
                                    <PreviousGameRatedPlayerHeader
                                        playerId={previousGame.playerOneId}
                                        highlight={previousGame.playerOneId === lastMovePlayerId}
                                        rating={previousGame.playerOneRating}
                                        ratingChange={previousGame.playerOneRatingChange}
                                    />
                                    <HSpacer />
                                    <PreviousGameRatedPlayerHeader
                                        playerId={previousGame.playerTwoId}
                                        highlight={previousGame.playerTwoId === lastMovePlayerId}
                                        rating={previousGame.playerTwoRating}
                                        ratingChange={previousGame.playerTwoRatingChange}
                                    />
                                    <HSpacer />
                                </HStack>
                            ) : (
                                <HStack maxWidth="400px">
                                    <HSpacer />
                                    <PreviousGamePlayerHeader
                                        playerId={previousGame.playerOneId}
                                        highlight={previousGame.playerOneId === lastMovePlayerId}

                                    />
                                    <HSpacer />
                                    <PreviousGamePlayerHeader
                                        playerId={previousGame.playerTwoId}
                                        highlight={previousGame.playerTwoId === lastMovePlayerId}
                                    />
                                    <HSpacer />
                                </HStack>
                            )}
                            <PreviousGameGrid
                                winningWords={previousGame.winningWords ?? []}
                                winningGridSpots={previousGame.winningCoordinates ?? []}
                                moves={moves.slice(0, currentMove)}
                                movesDict={movesDict}
                                maxMoves={maxMoves}
                            />

                            <HStack width={`${(Math.max(minDimension, upperBound) * 8 / dimensionDivider) + 200}px`}>

                                <PreviousGameFunctionBar
                                    goToFirstMove={goToFirstMove}
                                    goToLastMove={goToLastMove}
                                    goToNextMove={goToNextMove}
                                    goToPreviousMove={goToPreviousMove}
                                />
                            </HStack>

                            {winningWords.length > 0 && (
                                <>
                                    <WordRarityBar />
                                    {winningWords.map((word, index) => (
                                        <ColoredWord key={index} word={word} />
                                    ))}
                                </>
                            )}
                        </VStack>
                    ) : (
                        <CircularProgress sx={{ color: "black" }} />
                    )}
                </>

            ) : (
                <Typography>An error occurred. Please try again later.</Typography>
            )}
        </View>
    )
}
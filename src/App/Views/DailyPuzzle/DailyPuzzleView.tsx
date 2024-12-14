import { useEffect, useState } from "react";
import { DailyPuzzleModel, GridSpotModel, UserModel, WordModel } from "../../../Background/Models";
import { GridSpot } from "../../../Background/Extends/GridSpot";
import { HStack, View, VStack } from "../../../ReactSwiftly";
import DailyPuzzleGrid from "./DailyPuzzleGrid";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { Button, Typography } from "@mui/material";
import { FetchService, GameService } from "../../../Background/Service";
import { DailyPuzzleFunctions } from "../../../Background/Utils/DailyPuzzleFunctions";
import DailyPuzzleLetterBank from "./DailyPuzzleLetterBank";
import DailyPuzzleFoundWords from "./DailyPuzzleFoundWords";
import DailyPuzzleLeaderboardView from "./DailyPuzzleLeaderboardView";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { DisplayFunctions } from "../../../Background/Utils/DisplayFunctions";

interface DailyPuzzleViewProps {
    passedUser: UserModel;
    dailyPuzzle: DailyPuzzleModel;
    dailyPuzzleDict: Record<string, GridSpotModel>;
}

export default function DailyPuzzleView({
    passedUser,
    dailyPuzzle,
    dailyPuzzleDict
}: DailyPuzzleViewProps) {
    const [user, setUser] = useState<UserModel>(passedUser);
    const [selectedGridSpot, setSelectedGridSpot] = useState("");
    const [selectedLetter, setSelectedLetter] = useState("");
    const [repeatGuessWarning, setRepeatGuessWarning] = useState(false);
    const [checkingGuess, setCheckingGuess] = useState(false);
    const [guessesDict, setGuessesDict] = useState<Record<string, string[]>>({});
    const [livesRemaining, setLivesRemaining] = useState(3);
    const [goldenGrids, setGoldenGrids] = useState<string[]>([]);
    const [wrongGuessHighlight, setWrongGuessHighlight] = useState(false);
    const [showScoreDetails, setShowScoreDetails] = useState(false);
    // const [showHowToPlaySheet, setShowHowToPlaySheet] = useState(false);
    const [correctWords, setCorrectWords] = useState<Record<string, [WordModel, number]>>({});
    const [grid, setGrid] = useState<GridSpotModel[][]>(GridSpot.grid);
    const [submittingPuzzle, setSubmittingPuzzle] = useState(false);
    const [view, setView] = useState<"PlayPuzzle" | "PuzzleLeaderBoard">("PlayPuzzle");
    const startTime = Date.now();
    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const styles = {
        logo: {
            maxWidth: `${Math.min(minDimension / 3, 300)}px`,
            maxHeight: `${Math.min(minDimension / 3, 200)}px`,
            marginBottom: "20px",
        },
    }

    useEffect(() => {
        onAppearActions();
    }, []);

    useEffect(() => {
        if (repeatGuessWarning) {
            const timeout = setTimeout(async () => {
                setRepeatGuessWarning(false);
            }, 1000 * 2.5);

            return () => clearTimeout(timeout);
        }
    }, [repeatGuessWarning])

    useEffect(() => {
        if (selectedLetter.length > 0) {
            const leter = selectedLetter;
            const gridSpot = selectedGridSpot;
            checkForWord(gridSpot, leter);

            setSelectedLetter("");
        }
    }, [selectedLetter])

    useEffect(() => {
        if (wrongGuessHighlight) {
            const timeout = setTimeout(async () => {
                setWrongGuessHighlight(false);
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [wrongGuessHighlight]);


    async function onAppearActions() {
        try {
            const updatedUser = await FetchService.fetchUserByUid(user.id);
            setUser(updatedUser);
            await GameService.updateLastPuzzlePlayed(user, dailyPuzzle);
            const newGrid = GridSpot.grid.map((row, r) =>
                row.map((_, c) => {
                    const key = `${r},${c}`;
                    return dailyPuzzleDict[key];
                })
            );
            setGrid(newGrid);
        } catch {

        }
    }

    async function checkForWord(gridSpot: string, letter: string) {
        if (!checkingGuess) {
            setCheckingGuess(true);

            let canGuess = true;

            // Check if the guess already exists
            if (guessesDict[gridSpot]?.includes(letter.toLowerCase())) {
                canGuess = false;
                setRepeatGuessWarning(true); // Trigger warning
            }

            if (canGuess) {
                const [r, c] = DailyPuzzleFunctions.getCoordinateInts(gridSpot);

                // Update the grid immutably
                setGrid((prevGrid) =>
                    prevGrid.map((row, rowIndex) =>
                        row.map((cell, colIndex) =>
                            rowIndex === r && colIndex === c
                                ? { ...cell, letter }
                                : cell
                        )
                    )
                );

                // Update guessesDict immutably
                setGuessesDict((prevGuessesDict) => {
                    const newGuessesDict = { ...prevGuessesDict };
                    if (newGuessesDict[gridSpot]) {
                        newGuessesDict[gridSpot] = [...newGuessesDict[gridSpot], letter.toLowerCase()].sort();
                    } else {
                        newGuessesDict[gridSpot] = [letter.toLowerCase()];
                    }
                    return newGuessesDict;
                });

                if (gridSpot && letter) {
                    // Update dailyPuzzleDict immutably
                    const updatedSpot = { ...dailyPuzzleDict[gridSpot], letter: letter.toLowerCase() };
                    const updatedDailyPuzzleDict = { ...dailyPuzzleDict, [gridSpot]: updatedSpot };

                    try {
                        const words = await DailyPuzzleFunctions.checkWords(updatedSpot, updatedDailyPuzzleDict);

                        // Update goldenGrids and correctWords immutably
                        words.forEach(([wordModel, winningGridSpots]) => {
                            setGoldenGrids((prevGoldenGrids) => [...prevGoldenGrids, ...winningGridSpots]);
                            setCorrectWords((prevCorrectWords) => {
                                const updatedCorrectWords = { ...prevCorrectWords };
                                if (updatedCorrectWords[wordModel.word]) {
                                    updatedCorrectWords[wordModel.word][1] += 1;
                                } else {
                                    updatedCorrectWords[wordModel.word] = [wordModel, 1];
                                }
                                return updatedCorrectWords;
                            });
                        });

                        if (words.length === 0) {
                            setLivesRemaining((prevLives) => {
                                const newLives = prevLives - 1;
                                if (newLives <= 0) {
                                    setSelectedGridSpot("");
                                }
                                return newLives;
                            });
                            setWrongGuessHighlight(true); // Trigger wrong guess animation
                        }
                    } catch (error) {
                        console.error("Error checking words:", error);
                    }
                }

                // Reset grid and goldenGrids after a delay
                setTimeout(() => {
                    setGrid((prevGrid) =>
                        prevGrid.map((row, rowIndex) =>
                            row.map((cell, colIndex) =>
                                rowIndex === r && colIndex === c ? { ...cell, letter: "" } : cell
                            )
                        )
                    );
                    setGoldenGrids([]);
                }, 1000);
            }

            setCheckingGuess(false);
        }
    }



    async function submitPuzzle() {
        if (submittingPuzzle) return;

        setSubmittingPuzzle(true);
        try {
            const timeDuration = (Date.now() - startTime) / 1000;
            await GameService.submitDailyPuzzleEntry(user, dailyPuzzle, correctWords, timeDuration);
            setView("PuzzleLeaderBoard");
        } catch {

        }
        setSubmittingPuzzle(false);
    }

    if (view === "PuzzleLeaderBoard") {
        return (
            <DailyPuzzleLeaderboardView passedUser={user} dailyPuzzle={dailyPuzzle}/>
        );
    }

    return (
        <View>
            <VStack spacing="0px">
                <JumblemLogoSimple />
                <Typography>Daily Puzzle: {DisplayFunctions.displayPuzzleDate(dailyPuzzle.timestamp)}</Typography>

                <DailyPuzzleGrid
                    grid={grid}
                    selectedGridSpot={selectedGridSpot}
                    setSelectedGridSpot={setSelectedGridSpot}
                    dailyPuzzleDict={dailyPuzzleDict}
                    goldenGrids={goldenGrids}
                />

                <HStack padding="10px">
                    <Typography color={livesRemaining > 1 ? "primary" : "error"}>{`Lives: ${livesRemaining}`}</Typography>

                    <Button variant={showScoreDetails ? "contained" : "outlined"} onClick={() => setShowScoreDetails(!showScoreDetails)}>
                        {`Score: ${DailyPuzzleFunctions.getScore(correctWords)}`}
                    </Button>

                    <Button variant={submittingPuzzle ? "outlined" : "contained"} onClick={() => submitPuzzle()}>
                        {submittingPuzzle ? "Submitting..." : "Submit"}
                    </Button>
                </HStack>

                {showScoreDetails && (
                    <DailyPuzzleFoundWords correctWords={correctWords} />
                )}

                {(livesRemaining > 0 || !submittingPuzzle) && (
                    <DailyPuzzleLetterBank
                    letters={dailyPuzzle.letterBank.sort()}
                    selectedGridSpot={selectedGridSpot}
                    setSelectedLetter={setSelectedLetter}
                    livesRemaining={livesRemaining}
                    blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                />
                )}

                <VStack spacing="0px" height="30px">
                    {repeatGuessWarning ? (
                        <Typography color="error">This is a duplicate guess!</Typography>
                    ) : (
                        <>
                            {guessesDict[selectedGridSpot] && guessesDict[selectedGridSpot].length > 0 && (
                                <>
                                    <Typography textAlign={"center"}>GUESSES</Typography>
                                    <Typography textAlign={"center"}>{`${guessesDict[selectedGridSpot].join(", ").toUpperCase()}`}</Typography>
                                </>
                            )}
                        </>
                    )}
                </VStack>
            </VStack>
        </View>
    );
}
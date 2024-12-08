import { useEffect, useState } from "react";
import { DailyPuzzleModel, GridSpotModel, UserModel, WordModel } from "../../../Background/Models";
import { GridSpot } from "../../../Background/Extends/GridSpot";
import { View, VStack } from "../../../ReactSwiftly";
import DailyPuzzleGrid from "./DailyPuzzleGrid";
import JumblemLogoSimple from "../../../assets/jumblem_logo_simple.png";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { Typography } from "@mui/material";
import { GameService } from "../../../Background/Service";
import { Timestamp } from "firebase/firestore";

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
    const [showHowToPlaySheet, setShowHowToPlaySheet] = useState(false);
    const [correctWords, setCorrectWords] = useState<Record<string, [WordModel, number]>>({});
    const [grid, setGrid] = useState<GridSpotModel[][]>(GridSpot.grid);
    const startTime = new Date();
    const { minDimension } = useWindowSize();
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


    async function onAppearActions() {
        try {
            // await GameService.updateLastPuzzlePlayed(user, dailyPuzzle);
            const newGrid = GridSpot.grid.map((row, r) => 
                row.map((_, c) => {
                    const key = `${r},${c}`;
                    console.log(key);
                    return dailyPuzzleDict[key];
                })
            );
            setGrid(newGrid);
        } catch {

        }
    }

    function displayPuzzleDate(time: Timestamp): string {
        const puzzleDate = new Date(time.toDate());
        return puzzleDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }

    return (
        <View>
            <VStack spacing="0px">
            <img src={JumblemLogoSimple} alt="Jumblem Logo" style={styles.logo} />
            <Typography>Daily Puzzle: {displayPuzzleDate(dailyPuzzle.timestamp)}</Typography>

                <DailyPuzzleGrid
                    grid={grid}
                    selectedGridSpot={selectedGridSpot}
                    setSelectedGridSpot={setSelectedGridSpot}
                    dailyPuzzleDict={dailyPuzzleDict}
                    goldenGrids={goldenGrids}
                />
            </VStack>
        </View>
    );
}
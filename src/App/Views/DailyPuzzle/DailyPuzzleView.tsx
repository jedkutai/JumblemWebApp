import { useState } from "react";
import { DailyPuzzleModel, GridSpotModel, UserModel, WordModel } from "../../../Background/Models";
import { GridSpot } from "../../../Background/Extends/GridSpot";

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
}
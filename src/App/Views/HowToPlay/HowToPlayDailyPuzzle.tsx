import { useState } from "react";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { HStack, View, VStack } from "../../../ReactSwiftly";
import DailyPuzzleExampleGrid1 from "../../Components/HowTo/DailyPuzzleExampleGrid1";
import HowToPLaySection from "../../Components/HowToPlaySection";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { Button } from "@mui/material";
import DailyPuzzleExampleGrid2 from "../../Components/HowTo/DailyPuzzleExampleGrid2";
import DailyPuzzleExampleGrid3 from "../../Components/HowTo/DailyPuzzleExampleGrid3";
import { useNavigate } from "react-router-dom";

enum ExampleGridShown {
    puzzle,
    solution1,
    solution2
}

export default function HowToPlayDailyPuzzle() {
    const [exampleGridShown, setExampleGridShown] = useState<ExampleGridShown>(ExampleGridShown.puzzle)
    const { width } = useWindowSize();
    const navigate = useNavigate();
    return (
        <View startAtTop={true}>
            <VStack width={`${width - 40}px`}>
                <Button onClick={() => navigate("/home")}>
                    <JumblemLogoSimple />
                </Button>
                
                <HowToPLaySection
                    title="Objective"
                    descriptions={["Create as many words as possible by placing one letter on the board at a time."]}
                />

                <HowToPLaySection
                    title="Rules"
                    descriptions={[
                        "Words can be created horizontally, vertically, or diagonally and can be read in any direction.",
                        "Words must be at least 4 letters long.",
                        "Letters may only be placed next to, above, or below a letter already on the board.",
                        "If placing a letter on the board does not create a word, one of the lives will be lost."
                    ]}
                />

                <HStack>
                    <Button
                        style={{ color: exampleGridShown == ExampleGridShown.puzzle ? "black" : "gray" }}
                        onClick={() => setExampleGridShown(ExampleGridShown.puzzle)}
                    >
                        Puzzle
                    </Button>
                    <Button
                        style={{ color: exampleGridShown == ExampleGridShown.solution1 ? "black" : "gray" }}
                        onClick={() => setExampleGridShown(ExampleGridShown.solution1)}
                    >
                        Solution 1
                    </Button>
                    <Button
                        style={{ color: exampleGridShown == ExampleGridShown.solution2 ? "black" : "gray" }}
                        onClick={() => setExampleGridShown(ExampleGridShown.solution2)}
                    >
                        Solution 2
                    </Button>
                </HStack>

                {exampleGridShown == ExampleGridShown.puzzle && (
                    <DailyPuzzleExampleGrid1 />
                )}
                {exampleGridShown == ExampleGridShown.solution1 && (
                    <DailyPuzzleExampleGrid2 />
                )}
                {exampleGridShown == ExampleGridShown.solution2 && (
                    <DailyPuzzleExampleGrid3 />
                )}

                <HowToPLaySection
                    title="Scoring"
                    descriptions={[
                        "Players are awarded the following scores for each word that is created.",
                        "Common words: 25",
                        "Uncommon words: 50",
                        "Rare words: 75",
                        "Legendary words: 100"
                    ]}
                />

                <HowToPLaySection
                    title="User Interface"
                    descriptions={[
                        "After each word is created, the word will be highlighted and added to the score.",
                        "Tap on the score to see the words that have been created.",
                        "View the leaderboard to see where you rank.",
                        "Tap on a player's score to see the words that they created.",
                        "Tap on a word to see its definition."
                    ]}
                />
            </VStack>
        </View>
    );
}
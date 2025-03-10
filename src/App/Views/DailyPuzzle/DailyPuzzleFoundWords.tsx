import { Button, Typography } from "@mui/material";
import { WordModel } from "../../../Background/Models";
import { HStack, VStack } from "../../../ReactSwiftly";
import { ColoredWord } from "../../Components";
import WordRarityBar from "../../Components/WordRarityBar";
import { useState } from "react";

enum WordRarity {
    legendary,
    rare,
    uncommon,
    common
}

enum ModeShown {
    all,
    recent
}

interface DailyPuzzleFoundWordsProps {
    correctWords: Record<string, [WordModel, number]>;
    recentWords: Record<string, [WordModel, number]>;
}

export default function DailyPuzzleFoundWords({ correctWords, recentWords }: DailyPuzzleFoundWordsProps) {
    const [mode, setMode] = useState<ModeShown>(ModeShown.all);

    function getWordRarity(word: WordModel): WordRarity {
        switch (word.score) {
            case (1): {
                return WordRarity.legendary;
            }
            case (2): {
                return WordRarity.rare;
            }
            case (3): {
                return WordRarity.uncommon;
            }
            case (4): {
                return WordRarity.common;
            }

            default: {
                return WordRarity.common;
            }
        }
    }

    return (
        <VStack spacing="0px">
            <WordRarityBar />
            {Object.keys(recentWords).length > 0 && (
                <Button onClick={() => setMode(mode == ModeShown.all ? ModeShown.recent : ModeShown.all)}>
                {mode == ModeShown.all ? "Show Recent Words" : "Show All Words"}
            </Button>
            )}

            {Object.keys(mode == ModeShown.all ? correctWords : recentWords).sort().map((word) => {
                const [wordModel, count] = correctWords[word];
                const wordRarity = getWordRarity(wordModel);
                return (
                    <HStack key={word}>
                        <ColoredWord word={wordModel} />
                        {wordRarity == WordRarity.common && (
                            <Typography style={{ color: "black", fontWeight: 600 }}>{count > 1 ? `25 x ${count}` : "25"}</Typography>
                        )}
                        {wordRarity == WordRarity.uncommon && (
                            <Typography style={{ color: "black", fontWeight: 600 }}>{count > 1 ? `50 x ${count}` : "50"}</Typography>
                        )}
                        {wordRarity == WordRarity.rare && (
                            <Typography style={{ color: "black", fontWeight: 600 }}>{count > 1 ? `75 x ${count}` : "75"}</Typography>
                        )}
                        {wordRarity == WordRarity.legendary && (
                            <Typography style={{ color: "black", fontWeight: 600 }}>{count > 1 ? `100 x ${count}` : "100"}</Typography>
                        )}
                    </HStack>
                );
            })}
        </VStack>
    );
}
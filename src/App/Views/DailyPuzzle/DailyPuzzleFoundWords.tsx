import { Typography } from "@mui/material";
import { WordModel } from "../../../Background/Models";
import { HStack, VStack } from "../../../ReactSwiftly";
import { ColoredWord } from "../../Components";
import WordRarityBar from "../../Components/WordRarityBar";

enum WordRarity {
    legendary,
    rare,
    uncommon,
    common
}

interface DailyPuzzleFoundWordsProps {
    correctWords: Record<string, [WordModel, number]>;
}

export default function DailyPuzzleFoundWords({ correctWords }: DailyPuzzleFoundWordsProps) {


    function getWordRarity(word: WordModel): WordRarity {
        let wordType: WordRarity = WordRarity.legendary;

        if (word.score >= 3469832) {
            wordType = WordRarity.common;
        } else if (word.score >= 433133) {
            wordType = WordRarity.uncommon;
        } else if (word.score >= 94965) {
            wordType = WordRarity.rare;
        }

        return wordType;
    }

    return (
        <VStack spacing="0px">
            <WordRarityBar />
            {Object.keys(correctWords).sort().map((word) => {
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
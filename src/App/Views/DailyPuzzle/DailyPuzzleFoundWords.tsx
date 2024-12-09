import { Typography } from "@mui/material";
import { WordModel } from "../../../Background/Models";
import { HStack, VStack } from "../../../ReactSwiftly";
import { ColoredWord } from "../../Components";

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
            {Object.keys(correctWords).sort().map((word) => {
                const [wordModel, count] = correctWords[word];
                const wordRarity = getWordRarity(wordModel);
                return (
                    <HStack>
                        <ColoredWord word={wordModel} />
                        {wordRarity == WordRarity.common && (
                            <Typography>{`[25 x ${count}]`}</Typography>
                        )}
                        {wordRarity == WordRarity.uncommon && (
                            <Typography>{`[50 x ${count}]`}</Typography>
                        )}
                        {wordRarity == WordRarity.rare && (
                            <Typography>{`[75 x ${count}]`}</Typography>
                        )}
                        {wordRarity == WordRarity.legendary && (
                            <Typography>{`[100 x ${count}]`}</Typography>
                        )}
                    </HStack>
                );
            })}
        </VStack>
    );
}
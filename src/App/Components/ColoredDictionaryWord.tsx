import { Typography } from "@mui/material";
import { WordModel } from "../../Background/Models";

enum WordRarity {
    legendary,
    rare,
    uncommon,
    common
}

interface ColoredWordProps {
    word: WordModel;
}

export function ColoredDictionaryWord({ word }: ColoredWordProps) {
    const wordRarity: WordRarity = getWordRarity();

    function getWordRarity(): WordRarity {
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
        // <Typography variant="h1" style={{ color: "gray"}}>{wordModel.word}</Typography>
        <>
            {wordRarity == WordRarity.common && (
                <Typography variant="h1" style={{ color: "rgba(142,142,147,255)"}}>{word.word}</Typography>
                // <h2 style={{ color: "rgba(142,142,147,255)", margin: 0, padding: 0 }}>{word.word.toUpperCase()}</h2>
            )}
            {wordRarity == WordRarity.uncommon && (
                <Typography variant="h1" style={{ color: "black"}}>{word.word}</Typography>
                // <h2 style={{ color: "black", margin: 0, padding: 0 }}>{word.word.toUpperCase()}</h2>
            )}
            {wordRarity == WordRarity.rare && (
                <Typography variant="h1" style={{ color: "rgba(175,82,221,255)"}}>{word.word}</Typography>
                // <h2 style={{ color: "rgba(175,82,221,255)", margin: 0, padding: 0 }}>{word.word.toUpperCase()}</h2>
            )}
            {wordRarity == WordRarity.legendary && (
                <Typography variant="h1" style={{ color: "rgba(255,59,48,255)"}}>{word.word}</Typography>
                // <h2 style={{ color: "rgba(255,59,48,255)", margin: 0, padding: 0 }}>{word.word.toUpperCase()}</h2>
            )}
        </>
    );
}
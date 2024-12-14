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

export function ColoredWord({ word }: ColoredWordProps) {
    const wordRarity: WordRarity = getWordRarity();

    function getWordRarity(): WordRarity {
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
        <>
            {wordRarity == WordRarity.common && (
                <h2 style={{ color: "gray", margin: 0, padding: 0 }}>{word.word.toUpperCase()}</h2>
            )}
            {wordRarity == WordRarity.uncommon && (
                <h2 style={{ color: "black", margin: 0, padding: 0 }}>{word.word.toUpperCase()}</h2>
            )}
            {wordRarity == WordRarity.rare && (
                <h2 style={{ color: "purple", margin: 0, padding: 0 }}>{word.word.toUpperCase()}</h2>
            )}
            {wordRarity == WordRarity.legendary && (
                <h2 style={{ color: "red", margin: 0, padding: 0 }}>{word.word.toUpperCase()}</h2>
            )}
        </>
    );
}
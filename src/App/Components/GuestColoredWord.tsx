import { WordModel } from "../../Background/Models";

enum WordRarity {
    legendary,
    rare,
    uncommon,
    common
}

interface GuestColoredWordProps {
    word: WordModel;
}

export function GuestColoredWord({ word }: GuestColoredWordProps) {
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
                <h2 style={{ color: "rgba(142,142,147,255)", margin: 0, padding: 0 }}>{word.word.toUpperCase()}</h2>
            )}
            {wordRarity == WordRarity.uncommon && (
                <h2 style={{ color: "black", margin: 0, padding: 0 }}>{word.word.toUpperCase()}</h2>
            )}
            {wordRarity == WordRarity.rare && (
                <h2 style={{ color: "rgba(175,82,221,255)", margin: 0, padding: 0 }}>{word.word.toUpperCase()}</h2>
            )}
            {wordRarity == WordRarity.legendary && (
                <h2 style={{ color: "rgba(255,59,48,255)", margin: 0, padding: 0 }}>{word.word.toUpperCase()}</h2>
            )}
        </>
    );
}
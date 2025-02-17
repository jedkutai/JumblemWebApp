import { Button } from "@mui/material";
import { WordModel } from "../../Background/Models";
import { HStack } from "../../ReactSwiftly";
import { FaChevronRight } from "react-icons/fa";

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

    function getDefinition() {
        window.open(`/dictionary/${word.word}`, "_blank");
    }


    return (
        <Button onClick={getDefinition}>
            <HStack>
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
                <FaChevronRight size={20} color="gray"/>
            </HStack>
        </Button>
    );
}
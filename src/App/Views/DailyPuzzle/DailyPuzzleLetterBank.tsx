import { HStack } from "../../../ReactSwiftly";
import { DimLetterBlock } from "../../Components";
import DailyPuzzleClickableWhiteLetterBlock from "./DailyPuzzleClickableWhiteLetterBlock";

interface DailyPuzzleLetterBankProps {
    letters: string[];
    selectedGridSpot: string;
    setSelectedLetter: (letter: string) => void;
    livesRemaining: number;
    blockDimension: number;
}

export default function DailyPuzzleLetterBank({
    letters,
    selectedGridSpot,
    setSelectedLetter,
    livesRemaining,
    blockDimension,
}: DailyPuzzleLetterBankProps) {

    return (
        <HStack spacing="0px" padding="10px">
            {letters.map((letter, index) => (
                <div key={index}>
                {(selectedGridSpot.length === 0  || livesRemaining <= 0) ? (
                    <DimLetterBlock letter={letter} blockDimension={blockDimension}/>
                ) : (
                <DailyPuzzleClickableWhiteLetterBlock 
                    letter={letter}
                    blockDimension={blockDimension}
                    setSelectedLetter={setSelectedLetter}
                />
                )}
                </div>
            ))}
        </HStack>
    );
}

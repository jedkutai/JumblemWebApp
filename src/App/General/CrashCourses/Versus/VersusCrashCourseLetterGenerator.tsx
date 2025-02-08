import { useEffect } from "react";
import { UserModel, MoveModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import VersusCrashCourseLetterGeneratorBlock from "./VersusCrashCourseLetterGeneratorBlock";
import { HStack } from "../../../../ReactSwiftly";


interface VersusCrashCourseLetterGeneratorProps {
    user: UserModel;
    letters: string[];
    setLetters: (letters: string[]) => void;
    wordCheckComplete: boolean;
    movesDict: Record<string, MoveModel>;
    selectedBlock: string;
    setSelectedBlock: (selectedBlock: string) => void;
    yourTurn: boolean;
    blockDimension: number;
    moves: MoveModel[];
    setMoves: (newMoves: MoveModel[]) => void;
}

export default function VersusCrashCourseLetterGenerator({
    user,
    letters,
    setLetters,
    wordCheckComplete,
    // movesDict,
    selectedBlock,
    setSelectedBlock,
    yourTurn,
    blockDimension,
    moves, 
    setMoves
}: VersusCrashCourseLetterGeneratorProps) {
    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;

    useEffect(() => {
        setLetters(["J", "U", "M", "B", "L", "E", "M"]);
    }, []);


    return (
        <HStack
            spacing="0px"
            width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
        >
            {letters.map((letter, index) => (
                <VersusCrashCourseLetterGeneratorBlock
                    key={index}
                    user={user}
                    letters={letters}
                    setLetters={setLetters}
                    letter={letter}
                    yourTurn={yourTurn}
                    wordCheckComplete={wordCheckComplete}
                    blockDimension={blockDimension}
                    removeIndex={index}
                    selectedBlock={selectedBlock}
                    setSelectedBlock={setSelectedBlock}
                    moves={moves}
                    setMoves={setMoves}
                />
            ))}
        </HStack>
    );
}
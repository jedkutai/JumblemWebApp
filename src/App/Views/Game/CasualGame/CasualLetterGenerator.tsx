import { useEffect } from "react";
import { GameModel, MoveModel, UserModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { HStack } from "../../../../ReactSwiftly";
import CasualLetterGeneratorBlock from "./CasualLetterGeneratorBlock";
import { GameFunctions } from "../../../../Background/Utils/GameFunctions";

interface CasualLetterGeneratorProps {
    user: UserModel;
    game: GameModel;
    letters: string[];
    setLetters: (letters: string[]) => void;
    wordCheckComplete: boolean;
    moves: Record<string, MoveModel>;
    selectedBlock: string;
    setSelectedBlock: (selectedBlock: string) => void;
    yourTurn: boolean;
    blockDimension: number;
}

export default function CasualLetterGenerator({
    user,
    game,
    letters,
    setLetters,
    wordCheckComplete,
    selectedBlock,
    setSelectedBlock,
    yourTurn,
    blockDimension
}: CasualLetterGeneratorProps) {
    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;

    useEffect(() => {
        const temp = GameFunctions.getLetters(7);
        temp.sort();
        setLetters(temp);
    }, []);
    
    return (
        <HStack
            spacing="0px"
            width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
        >
            {letters.map((letter, index) => (
                <CasualLetterGeneratorBlock
                    key={index}
                    user={user}
                    game={game}
                    letters={letters}
                    setLetters={setLetters}
                    letter={letter}
                    yourTurn={yourTurn}
                    wordCheckComplete={wordCheckComplete}
                    blockDimension={blockDimension}
                    removeIndex={index}
                    selectedBlock={selectedBlock}
                    setSelectedBlock={setSelectedBlock}
                />
            ))}
        </HStack>
    );
}
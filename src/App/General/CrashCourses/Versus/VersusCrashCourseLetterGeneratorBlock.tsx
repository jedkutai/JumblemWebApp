import { useState } from "react";
import { MoveModel, UserModel } from "../../../../Background/Models";
import { DimLetterBlock, ClickableWhiteLetterBlock } from "../../../Components";
import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
import { Timestamp } from "firebase/firestore";

interface VersusCrashCourseLetterGeneratorBlockProps {
    user: UserModel;
    letters: string[];
    setLetters: (letters: string[]) => void;
    yourTurn: boolean;
    wordCheckComplete: boolean;
    blockDimension: number;
    letter: string;
    removeIndex: number;
    selectedBlock: string;
    setSelectedBlock: (selectedBlock: string) => void;

    moves: MoveModel[];
    setMoves: (newMoves: MoveModel[]) => void;
}

export default function VersusCrashCourseLetterGeneratorBlock({
    user,
    letters,
    setLetters,
    yourTurn,
    wordCheckComplete,
    blockDimension,
    letter,
    removeIndex,
    selectedBlock,
    setSelectedBlock,
    moves,
    setMoves
}: VersusCrashCourseLetterGeneratorBlockProps) {
    const [canSelect, setCanSelect] = useState(true);

    async function bustAMove() {
        if (yourTurn && wordCheckComplete) {
            setCanSelect(false);
            try {
                const letterBank = letters;
                const newMove: MoveModel = {
                    id: `${moves.length}`,
                    gameId: "bootCamp",
                    userId: user.id,
                    coordinates: selectedBlock,
                    letter: letter,
                    timestamp: Timestamp.now(),
                    number: (moves.length + 1),
                    letterBank: letterBank.sort()
                }

                let newMoves = [...moves, newMove]
                setMoves(newMoves);



                letters.splice(removeIndex, 1);

                const newLetters = GameFunctions.getLetters(1);
                const updatedLetters: string[] = [...letters, ...newLetters];
                updatedLetters.sort();
                setLetters(updatedLetters);

                setSelectedBlock("");
                setCanSelect(true);
            } catch {

            }
            // setSelectedBlock("");
            // setCanSelect(true);
        }
    }
    return (
        <>
            {(selectedBlock === "" || !canSelect) && (
                <DimLetterBlock letter={letter} blockDimension={blockDimension} />
            )}

            {!(selectedBlock === "") && canSelect && (
                <ClickableWhiteLetterBlock letter={letter} blockDimension={blockDimension} action={bustAMove} />
            )}
        </>
    );
}
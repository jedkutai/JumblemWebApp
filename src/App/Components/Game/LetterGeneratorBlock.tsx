import { useState } from "react";
import { UserModel, GameModel } from "../../../Background/Models";
import DimLetterBlock from "../DimLetterBlock";
import ClickableWhiteLetterBlock from "../ClickableWhiteLetterBlock";
import { CasualGameService } from "../../../Background/Service";
import { GameFunctions } from "../../../Background/Utils/GameFunctions";

interface LetterGeneratorBlockProps {
    user: UserModel;
    game: GameModel;
    letters: string[];
    setLetters: (letters: string[]) => void;
    yourTurn: boolean;
    wordCheckComplete: boolean;
    blockDimension: number;
    letter: string;
    removeIndex: number;
    selectedBlock: string;
    setSelectedBlock: (selectedBlock: string) => void;
}

export default function LetterGeneratorBlock({
    user,
    game,
    letters,
    setLetters,
    yourTurn,
    wordCheckComplete,
    blockDimension,
    removeIndex,
    selectedBlock,
    setSelectedBlock,
    letter
}: LetterGeneratorBlockProps) {
    const [canSelect, setCanSelect] = useState(true);



    async function bustAMove() {
        if (yourTurn && wordCheckComplete) {
            setCanSelect(false);
            try {
                await CasualGameService.makeMove(user, game, selectedBlock, letter);
                letters.splice(removeIndex, 1);

                const newLetters = GameFunctions.getLetters(1);
                const updatedLetters: string[] = [...letters, ...newLetters];
                updatedLetters.sort();
                setLetters(updatedLetters);
            } catch {

            }
            setSelectedBlock("");
            setCanSelect(true);
        }
    }

    return (
        <>
            {(selectedBlock === "" || !canSelect) && (
                <DimLetterBlock letter={letter} blockDimension={blockDimension} />
            )}

            {!(selectedBlock === "") && canSelect && (
                <ClickableWhiteLetterBlock letter={letter} blockDimension={blockDimension} action={bustAMove}/>
            )}
        </>
    );
}


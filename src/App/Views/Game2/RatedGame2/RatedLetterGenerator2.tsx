import { useEffect } from "react";
import { UserModel, GameModel } from "../../../../Background/Models";
import { RatedGameService } from "../../../../Background/Service";
import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { HStack } from "../../../../ReactSwiftly";
import { DimLetterBlock, ClickableWhiteLetterBlock } from "../../../Components";

interface RatedLetterGenerator2Props {
    user: UserModel;
    game: GameModel;
    letters: string[];
    setLetters: (letters: string[]) => void;
    canSelect: boolean;
    setCanSelect: (canSelect: boolean) => void;
    processComplete: boolean;
    wordCheckComplete: boolean;
    selectedBlock: string;
    setSelectedBlock: (selectedBlock: string) => void;
    yourTurn: boolean;
    movesMade: number;
    timeOffset: number;
}

export default function RatedLetterGenerator2({
    user,
    game,
    letters,
    setLetters,
    canSelect,
    setCanSelect,
    processComplete,
    wordCheckComplete,
    selectedBlock,
    setSelectedBlock,
    yourTurn,
    movesMade,
    timeOffset
}: RatedLetterGenerator2Props) {

    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const blockDimension = Math.max(minDimension, upperBound) / dimensionDivider;

    useEffect(() => {
        const temp = GameFunctions.getLetters(7);
        temp.sort();
        setLetters(temp);
    }, []);

    async function bustAMove(letter: string, removeIndex: number) {
        if (yourTurn && wordCheckComplete) {
            try {
                const letterBank = letters;
                setCanSelect(false);
                await RatedGameService.makeMove(user, game, selectedBlock, letter, (movesMade + 1), letterBank, timeOffset);
                letters.splice(removeIndex, 1);

                const newLetters = GameFunctions.getLetters(1);
                const updatedLetters: string[] = [...letters, ...newLetters];
                updatedLetters.sort();
                setLetters(updatedLetters);

                setSelectedBlock("");
                setCanSelect(true);
            } catch {

            }

        }
    }

    return (
        <HStack
            spacing="0px"
            width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
        >
            {letters.map((letter, index) => (
                <div key={index}>
                {(selectedBlock === "" || !canSelect || !processComplete) ? (
                    <DimLetterBlock letter={letter} blockDimension={blockDimension} />
                ) : (
                    <ClickableWhiteLetterBlock letter={letter} blockDimension={blockDimension} action={() => bustAMove(letter, index)} />
                )}
                </div>
            ))}
        </HStack>
    );
}
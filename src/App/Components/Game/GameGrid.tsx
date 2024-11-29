import { useEffect, useState } from "react";
import { GameModel, GridSpotModel, MoveModel, UserModel } from "../../../Background/Models";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { GameFunctions } from "../../../Background/Utils/GameFunctions";
import { VSpacer, VStack } from "../../../ReactSwiftly";
import GameRow from "./GameRow";
import { GridSpot } from "../../../Background/Extends/GridSpot";
import LetterGenerator from "./LetterGenerator";


interface GameGridProps {
    user: UserModel;
    game: GameModel;
    gameOver: boolean;
    wordCheckComplete: boolean;
    matchAbortedTime: number;
    movesDict: Record<string, MoveModel>;
    yourTurn: boolean;
    lastMove: MoveModel | undefined;
    movesCopy: MoveModel[]

}

export default function GameGrid({
    user,
    game,
    gameOver,
    wordCheckComplete,
    matchAbortedTime,
    movesDict,
    yourTurn,
    lastMove,
    movesCopy
}: GameGridProps) {
    const { minDimension } = useWindowSize();
    const [grid, setGrid] = useState<GridSpotModel[][]>(GridSpot.grid);
    const [letters, setLetters] = useState<string[]>([]);
    const [canSelect, setCanSelect] = useState(false);
    const [availableBlocks, setAvailableBlocks] = useState(["3,3"]);
    const [selectedBlock, setSelectedBlock] = useState("");
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    useEffect(() => {
        const newAvailableBlocks = GameFunctions.getAvailableBlocks(movesDict, availableBlocks);
        setAvailableBlocks(newAvailableBlocks);
    }, [movesDict]);


    return (
        <VStack maxHeight={`${(Math.max(minDimension, upperBound) * 8 / dimensionDivider) + 200}px`}>
            <VStack
                spacing="0px"
                backgroundColor="rgb(255, 255, 255, 0.25)"
                width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                minHeight={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                cornerRadius="5px"
            >
                {grid.map((row, index) => (
                    <GameRow
                        key={index}
                        row={row}
                        availableBlocks={availableBlocks}
                        wordCheckComplete={wordCheckComplete}
                        moves={movesDict}
                        selectedBlock={selectedBlock}
                        setSelectedBlock={setSelectedBlock}
                        yourTurn={yourTurn}
                        blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                        lastMove={lastMove}
                    />
                ))}

            </VStack>
            
            <VSpacer />

            <LetterGenerator
                user={user}
                game={game}
                letters={letters}
                setLetters={setLetters}
                wordCheckComplete={wordCheckComplete}
                moves={movesDict}
                selectedBlock={selectedBlock}
                setSelectedBlock={setSelectedBlock}
                yourTurn={yourTurn}
                blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
            />
        </VStack>
    );


}
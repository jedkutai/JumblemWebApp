import { useEffect, useState } from "react";
import { GameModel, GridSpotModel, MoveModel, UserModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
import { VSpacer, VStack, ZStack } from "../../../../ReactSwiftly";
import CasualGameRow from "./CasualGameRow";
import { GridSpot } from "../../../../Background/Extends/GridSpot";


interface CasualGameGridProps {
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

export default function CasualGameGrid({
    user,
    game,
    gameOver,
    wordCheckComplete,
    matchAbortedTime,
    movesDict,
    yourTurn,
    lastMove,
    movesCopy
}: CasualGameGridProps) {
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
                    <CasualGameRow
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
                {/* <CasualGameRow
                    row={grid[0]}
                    availableBlocks={availableBlocks}
                    wordCheckComplete={wordCheckComplete}
                    moves={movesDict}
                    selectedBlock={selectedBlock}
                    setSelectedBlock={setSelectedBlock}
                    yourTurn={yourTurn}
                    blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                    lastMove={lastMove}
                />
                <CasualGameRow
                    row={grid[1]}
                    availableBlocks={availableBlocks}
                    wordCheckComplete={wordCheckComplete}
                    moves={movesDict}
                    selectedBlock={selectedBlock}
                    setSelectedBlock={setSelectedBlock}
                    yourTurn={yourTurn}
                    blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                    lastMove={lastMove}
                />
                <CasualGameRow
                    row={grid[2]}
                    availableBlocks={availableBlocks}
                    wordCheckComplete={wordCheckComplete}
                    moves={movesDict}
                    selectedBlock={selectedBlock}
                    setSelectedBlock={setSelectedBlock}
                    yourTurn={yourTurn}
                    blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                    lastMove={lastMove}
                />
                <CasualGameRow
                    row={grid[3]}
                    availableBlocks={availableBlocks}
                    wordCheckComplete={wordCheckComplete}
                    moves={movesDict}
                    selectedBlock={selectedBlock}
                    setSelectedBlock={setSelectedBlock}
                    yourTurn={yourTurn}
                    blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                    lastMove={lastMove}
                />
                <CasualGameRow
                    row={grid[4]}
                    availableBlocks={availableBlocks}
                    wordCheckComplete={wordCheckComplete}
                    moves={movesDict}
                    selectedBlock={selectedBlock}
                    setSelectedBlock={setSelectedBlock}
                    yourTurn={yourTurn}
                    blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                    lastMove={lastMove}
                />
                <CasualGameRow
                    row={grid[5]}
                    availableBlocks={availableBlocks}
                    wordCheckComplete={wordCheckComplete}
                    moves={movesDict}
                    selectedBlock={selectedBlock}
                    setSelectedBlock={() => selectedBlock}
                    yourTurn={yourTurn}
                    blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                    lastMove={lastMove}
                />
                <CasualGameRow
                    row={grid[6]}
                    availableBlocks={availableBlocks}
                    wordCheckComplete={wordCheckComplete}
                    moves={movesDict}
                    selectedBlock={selectedBlock}
                    setSelectedBlock={setSelectedBlock}
                    yourTurn={yourTurn}
                    blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                    lastMove={lastMove}
                /> */}
            </VStack>

            <VSpacer />


        </VStack>
    );


}
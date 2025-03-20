import { useState } from "react";
import { GridSpot } from "../../../../Background/Extends/GridSpot";
import { GridSpotModel, MoveModel, WordModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { VStack } from "../../../../ReactSwiftly";
import { ColoredWord } from "../../../Components";
import WordRarityBar from "../../../Components/WordRarityBar";
import SpectateGameRow from "./SpectateGameRow";

interface SpectateGameGridProps {
    movesDict: Record<string, MoveModel>;
    winningWords: WordModel[];
    winningGridSpots: string[];
    lastMove: MoveModel | undefined;
}

export default function SpectateGameGrid({
    movesDict,
    winningWords,
    winningGridSpots,
    lastMove
}: SpectateGameGridProps) {
    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const [grid] = useState<GridSpotModel[][]>(GridSpot.grid);




    return (
        <VStack spacing="10px">
            <VStack
                spacing="0px"
                backgroundColor="rgb(255, 255, 255, 0.25)"
                width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                minHeight={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                cornerRadius="5px"
            >

                {grid.map((row, index) => (
                    <SpectateGameRow
                        key={index}
                        row={row}
                        movesDict={movesDict}
                        winningGridSpots={winningGridSpots}
                        blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                        lastMove={lastMove}
                    />
                ))}

            </VStack>


            {winningWords.length > 0 && (
                <VStack spacing="10px">
                    <WordRarityBar />
                    {winningWords.map((word, index) => (
                        <ColoredWord key={index} word={word} />
                    ))}
                </VStack>
            )}

        </VStack>
    );
}

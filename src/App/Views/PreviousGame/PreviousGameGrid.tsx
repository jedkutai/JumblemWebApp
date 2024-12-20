import { GridSpot } from "../../../Background/Extends/GridSpot";
import { MoveModel } from "../../../Background/Models";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { HStack, VStack } from "../../../ReactSwiftly";
import PreviousGameBlock from "./PreviousGameBlock";

interface PreviousGameGridProps {
    winningWords: string[];
    winningGridSpots: string[];
    moves: MoveModel[];
    movesDict: Record<string, MoveModel>;
    maxMoves: number;
}

export default function PreviousGameGrid({
    // winningWords,
    winningGridSpots,
    moves,
    movesDict,
    maxMoves
}: PreviousGameGridProps) {
    const grid = GridSpot.grid;

    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const { minDimension } = useWindowSize();

    const blockDimension = Math.max(minDimension, upperBound) / dimensionDivider

    return (
        <VStack maxHeight={`${(Math.max(minDimension, upperBound) * 8 / dimensionDivider) + 200}px`} spacing="10px">
            <VStack
                spacing="0px"
                backgroundColor="rgb(255, 255, 255, 0.25)"
                width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                minHeight={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                cornerRadius="5px"
            >
                {grid.map((row, index) => (
                    <HStack key={index} spacing="0px">
                        {row.map((spot) => (
                            <PreviousGameBlock
                                movesCount={moves.length}
                                maxMoves={maxMoves}
                                winningGridSpots={winningGridSpots}
                                move={movesDict[spot.id]}
                                blockDimension={blockDimension}
                                key={spot.id}
                            />
                        ))}
                    </HStack>
                ))}

            </VStack>
        </VStack>
    )
}
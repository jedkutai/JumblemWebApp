import { GridSpotModel } from "../../../Background/Models";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { HStack, VStack } from "../../../ReactSwiftly";
import { DailyPuzzleFunctions } from "../../../Background/Utils/DailyPuzzleFunctions";
import { EmptyBlock } from "../../Components";
import LetterBlockDailyPuzzle from "./LetterBlockDailyPuzzle";

interface DailyPuzzleGridProps {
    grid: GridSpotModel[][];
    selectedGridSpot: string;
    setSelectedGridSpot: (value: string) => void;
    dailyPuzzleDict: Record<string, GridSpotModel>;
    goldenGrids: string[];
}

export default function DailyPuzzleGrid({
    grid,
    selectedGridSpot,
    setSelectedGridSpot,
    goldenGrids
}: DailyPuzzleGridProps) {
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const { minDimension } = useWindowSize();




    return (
        // <VStack maxHeight={`${(Math.max(minDimension, upperBound) * 8 / dimensionDivider) + 200}px`} spacing="10px">
        <VStack spacing="10px">
            <VStack
                spacing="0px"
                backgroundColor="rgb(255, 255, 255, 0.25)"
                width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                minHeight={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                cornerRadius="5px"
            >
                {grid.map((row, index) => (
                    <HStack key={index} spacing="0px">
                        {row.map((spot, index) => (
                            <div key={index}>
                                {DailyPuzzleFunctions.validSquare(spot, grid) ? (
                                    <LetterBlockDailyPuzzle
                                        gridSpot={spot}
                                        blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                                        selectedGridSpot={selectedGridSpot}
                                        setSelectedGridSpot={setSelectedGridSpot}
                                        goldenGrids={goldenGrids}
                                    />
                                ) : (
                                    <EmptyBlock blockDimension={Math.max(minDimension, upperBound) / dimensionDivider} />
                                )}
                            </div>

                        ))}
                    </HStack>
                ))}
            </VStack>
        </VStack>
    )
}

import { GridSpot } from "../../../Background/Extends/GridSpot";
import { GridSpotModel } from "../../../Background/Models";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { HStack, VStack } from "../../../ReactSwiftly";
import { EmptyBlock } from "../EmptyBlock";
import ExampleLetterBlock from "./ExampleLetterBlock";


export default function DailyPuzzleExampleGrid1() {

    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const { minDimension } = useWindowSize();
    const blockDimension = Math.max(minDimension, upperBound) / dimensionDivider;
    const grid: GridSpotModel[][] = GridSpot.grid;

    const lettersToDisplay: Record<string, [string, boolean, boolean]> = {
        "2,2": ["A", false, false],
        "3,2": ["C", false, false],
        "4,2": ["E", false, false],
        "2,3": ["X", false, false],
        "3,3": ["Y", false, false],
        "4,3": ["Z", false, false],
        "2,4": ["Z", false, false],
        "3,4": ["Y", false, false],
        "4,4": ["X", false, false],

    };

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
                    <HStack spacing="0px" key={index}>
                        {row.map((block, index) => (
                            <div key={index}>
                                {lettersToDisplay[block.id] ? (
                                    <ExampleLetterBlock
                                        letter={lettersToDisplay[block.id][0]}
                                        highlight={lettersToDisplay[block.id][1]}
                                        outline={lettersToDisplay[block.id][2]}
                                        blockDimension={blockDimension}
                                    />
                                ) : (
                                    <EmptyBlock blockDimension={blockDimension} />
                                )}
                            </div>
                        ))}
                    </HStack>
                ))}
            </VStack>

            <HStack spacing="0px">
                <ExampleLetterBlock
                    letter={"R"}
                    highlight={false}
                    outline={false}
                    blockDimension={blockDimension}
                />
                <ExampleLetterBlock
                    letter={"A"}
                    highlight={false}
                    outline={false}
                    blockDimension={blockDimension}
                />
                <ExampleLetterBlock
                    letter={"N"}
                    highlight={false}
                    outline={false}
                    blockDimension={blockDimension}
                />
                <ExampleLetterBlock
                    letter={"D"}
                    highlight={false}
                    outline={false}
                    blockDimension={blockDimension}
                />
                <ExampleLetterBlock
                    letter={"O"}
                    highlight={false}
                    outline={false}
                    blockDimension={blockDimension}
                />
                <ExampleLetterBlock
                    letter={"M"}
                    highlight={false}
                    outline={false}
                    blockDimension={blockDimension}
                />
                <ExampleLetterBlock
                    letter={"S"}
                    highlight={false}
                    outline={false}
                    blockDimension={blockDimension}
                />
            </HStack>
        </VStack>
    );
}
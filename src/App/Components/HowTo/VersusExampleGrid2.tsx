import { GridSpot } from "../../../Background/Extends/GridSpot";
import { GridSpotModel } from "../../../Background/Models";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { HStack, VStack } from "../../../ReactSwiftly";
import { ColoredWord } from "../ColoredWord";
import { EmptyBlock } from "../EmptyBlock";
import WordRarityBar from "../WordRarityBar";
import ExampleLetterBlock from "./ExampleLetterBlock";

export default function VersusExamlpeGrid2() {
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const { minDimension } = useWindowSize();
    const blockDimension = Math.max(minDimension, upperBound) / dimensionDivider;
    const grid: GridSpotModel[][] = GridSpot.grid;

    const lettersToDisplay: Record<string, [string, boolean]> = {
        "0,3": ["T", false],
        "0,2": ["S", false],
        "0,1": ["M", true],


        "1,4": ["I", false],
        "1,3": ["A", false],
        "1,2": ["E", true],

        "2,3": ["H", true],

        "3,4": ["T", true],
        "3,3": ["P", false],

        "4,5": ["H", false],
        "4,4": ["I", false],

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
                                        outline={false}
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

            <WordRarityBar />

            <ColoredWord word={
                {
                    id: "them",
                    word: "them",
                    score: 2087397258
                }
            } />
        </VStack>
    )

}
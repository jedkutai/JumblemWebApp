import { GridSpot } from "../../../Background/Extends/GridSpot";
import { GridSpotModel } from "../../../Background/Models";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { HStack, VStack } from "../../../ReactSwiftly";
import { ColoredWord } from "../ColoredWord";
import { EmptyBlock } from "../EmptyBlock";
import WordRarityBar from "../WordRarityBar";
import ExampleLetterBlock from "./ExampleLetterBlock";

export default function VersusExamlpeGrid3() {
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const { minDimension } = useWindowSize();
    const blockDimension = Math.max(minDimension, upperBound) / dimensionDivider;
    const grid: GridSpotModel[][] = GridSpot.grid;

    const lettersToDisplay: Record<string, [string, boolean]> = {
        "0,5": ["C", false],
        "0,4": ["M", false],

        "1,4": ["A", false],

        "2,6": ["B", false],
        "2,5": ["E", true],
        "2,4": ["B", false],
        "2,3": ["S", false],
        "2,2": ["C", false],

        "3,4": ["R", true],
        "3,3": ["T", false],
        "3,2": ["R", false],

        "4,3": ["O", true],
        "4,2": ["E", false],
        "4,1": ["I", false],
        "4,0": ["O", false],

        "5,2": ["T", true],
        "5,1": ["K", false],
        "5,0": ["T", false],

        "6,2": ["R", false],
        "6,1": ["R", false],
        "6,0": ["K", false],

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
                    id: "tore",
                    word: "tore",
                    score: 7969866
                }
            } />

        </VStack>
    )

}
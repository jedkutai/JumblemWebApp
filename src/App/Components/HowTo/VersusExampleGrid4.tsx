import { GridSpot } from "../../../Background/Extends/GridSpot";
import { GridSpotModel } from "../../../Background/Models";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { HStack, VStack } from "../../../ReactSwiftly";
import { ColoredWord } from "../ColoredWord";
import { EmptyBlock } from "../EmptyBlock";
import WordRarityBar from "../WordRarityBar";
import ExampleLetterBlock from "./ExampleLetterBlock";

export default function VersusExamlpeGrid4() {
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const { minDimension } = useWindowSize();
    const blockDimension = Math.max(minDimension, upperBound) / dimensionDivider;
    const grid: GridSpotModel[][] = GridSpot.grid;

    const lettersToDisplay: Record<string, [string, boolean]> = {
        "0,4": ["C", false],
        "0,3": ["O", false],
        "0,2": ["R", false],
        "0,1": ["O", true],
        "0,0": ["E", false],

        "1,3": ["N", false],
        "1,2": ["N", false],
        "1,1": ["I", true],
        "1,0": ["O", false],

        "2,3": ["C", false],
        "2,2": ["H", false],
        "2,1": ["N", true],
        "2,0": ["R", false],

        "3,4": ["O", false],
        "3,3": ["D", false],
        "3,1": ["K", true],

        "4,6": ["G", false],
        "4,5": ["E", false],
        "4,4": ["L", false],
        "4,3": ["W", false],
        "4,2": ["E", false],
        "4,1": ["Y", true],
        "4,0": ["A", false],

        "5,6": ["R", false],

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

            <HStack>
                <ColoredWord word={
                    {
                        id: "inky",
                        word: "inky",
                        score: 706574
                    }
                } />
                <ColoredWord word={
                    {
                        id: "oink",
                        word: "oink",
                        score: 61867
                    }
                } />
            </HStack>
        </VStack>
    )

}
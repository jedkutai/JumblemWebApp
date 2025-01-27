import { GridSpot } from "../../../Background/Extends/GridSpot";
import { GridSpotModel } from "../../../Background/Models";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { HStack, VStack } from "../../../ReactSwiftly";
import { ColoredWord } from "../ColoredWord";
import { EmptyBlock } from "../EmptyBlock";
import WordRarityBar from "../WordRarityBar";
import ExampleLetterBlock from "./ExampleLetterBlock";

export default function VersusExamlpeGrid1() {
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const { minDimension } = useWindowSize();
    const blockDimension = Math.max(minDimension, upperBound) / dimensionDivider;
    const grid: GridSpotModel[][] = GridSpot.grid;
    
    const lettersToDisplay: Record<string, [string, boolean]> = {
        "3,5": ["E", true],
        "3,4": ["L", true],
        "3,3": ["O", true],
        "3,2": ["S", true],
        "3,1": ["C", false],
        "3,0": ["A", false],

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

            <WordRarityBar/>
            <ColoredWord word={
                {
                    id: "sole",
                    word: "sole",
                    score: 46419016
                }
            }/>

        </VStack>
    )

}
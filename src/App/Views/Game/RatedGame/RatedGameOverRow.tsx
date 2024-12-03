import { GridSpotModel, MoveModel } from "../../../../Background/Models";
import { HStack } from "../../../../ReactSwiftly";
import RatedGameOverBlock from "./RatedGameOverBlock";

interface RatedGameOverRowProps {
    row: GridSpotModel[];
    movesDict: Record<string, MoveModel>;
    winningGridSpots: string[];
    blockDimension: number;
}

export default function RatedGameOverRow({
    row,
    movesDict, 
    winningGridSpots,
    blockDimension
}: RatedGameOverRowProps) {

    return (
        <HStack spacing="0px">
            {row.map((spot, index) => (
                <RatedGameOverBlock 
                key={index}
                move={movesDict[spot.id]} 
                partOfWord={winningGridSpots.includes(spot.id)} 
                blockDimension={blockDimension} 
                />
            ))}
        </HStack>
    );
}
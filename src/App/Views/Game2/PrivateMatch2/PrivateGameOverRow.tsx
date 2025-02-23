import { GridSpotModel, MoveModel } from "../../../../Background/Models";
import { HStack } from "../../../../ReactSwiftly";
import PrivateGameOverBlock from "./PrivateGameOverBlock";

interface PrivateGameOverRowProps {
    row: GridSpotModel[];
    movesDict: Record<string, MoveModel>;
    winningGridSpots: string[];
    blockDimension: number;
}

export default function PrivateGameOverRow({
    row,
    movesDict, 
    winningGridSpots,
    blockDimension
}: PrivateGameOverRowProps) {

    return (
        <HStack spacing="0px">
            {row.map((spot, index) => (
                <PrivateGameOverBlock 
                key={index}
                move={movesDict[spot.id]} 
                partOfWord={winningGridSpots.includes(spot.id)} 
                blockDimension={blockDimension} 
                />
            ))}
        </HStack>
    );
}
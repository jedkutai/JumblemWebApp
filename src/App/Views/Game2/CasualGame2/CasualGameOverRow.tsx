import { GridSpotModel, MoveModel } from "../../../../Background/Models";
import { HStack } from "../../../../ReactSwiftly";
import CasualGameOverBlock from "./CasualGameOverBlock";

interface CasualGameOverRowProps {
    row: GridSpotModel[];
    movesDict: Record<string, MoveModel>;
    winningGridSpots: string[];
    blockDimension: number;
}

export default function CasualGameOverRow({
    row,
    movesDict, 
    winningGridSpots,
    blockDimension
}: CasualGameOverRowProps) {

    return (
        <HStack spacing="0px">
            {row.map((spot, index) => (
                <CasualGameOverBlock 
                key={index}
                move={movesDict[spot.id]} 
                partOfWord={winningGridSpots.includes(spot.id)} 
                blockDimension={blockDimension} 
                />
            ))}
        </HStack>
    );
}
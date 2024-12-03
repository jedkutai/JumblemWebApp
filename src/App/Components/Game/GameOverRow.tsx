import { GridSpotModel, MoveModel } from "../../../Background/Models";
import { HStack } from "../../../ReactSwiftly";
import GameOverBlock from "./GameOverBlock";

interface GameOverRowProps {
    row: GridSpotModel[];
    movesDict: Record<string, MoveModel>;
    winningGridSpots: string[];
    blockDimension: number;
}

export default function GameOverRow({
    row,
    movesDict, 
    winningGridSpots,
    blockDimension
}: GameOverRowProps) {

    return (
        <HStack spacing="0px">
            {row.map((spot, index) => (
                <GameOverBlock 
                key={index}
                move={movesDict[spot.id]} 
                partOfWord={winningGridSpots.includes(spot.id)} 
                blockDimension={blockDimension} 
                />
            ))}
        </HStack>
    );
}
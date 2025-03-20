import { GridSpotModel, MoveModel } from "../../../../Background/Models";
import { HStack } from "../../../../ReactSwiftly";
import SpectateGameBlock from "./SpectateGameBlock";

interface SpectateGameRowProps {
    row: GridSpotModel[];
    movesDict: Record<string, MoveModel>;
    blockDimension: number;
    lastMove: MoveModel | undefined;
    winningGridSpots: string[];
}

export default function SpectateGameRow({
    row,
    movesDict,
    blockDimension,
    lastMove,
    winningGridSpots
}: SpectateGameRowProps) {

    return (
        <HStack spacing="0px">
            {row.map((block, index) => (
                <SpectateGameBlock
                    key={index}
                    block={block}
                    movesDict={movesDict}
                    blockDimension={blockDimension}
                    lastMove={lastMove}
                    winningGridSpots={winningGridSpots}
                />
            ))}
        </HStack>
    );
}
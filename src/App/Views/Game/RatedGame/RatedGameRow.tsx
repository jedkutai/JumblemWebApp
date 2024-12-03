import { GridSpotModel, MoveModel } from "../../../../Background/Models";
import { HStack } from "../../../../ReactSwiftly";
import RatedGameBlock from "./RatedGameBlock";

interface RatedGameRowProps {
    row: GridSpotModel[];
    availableBlocks: string[];
    wordCheckComplete: boolean;
    moves: Record<string, MoveModel>;
    selectedBlock: string;
    setSelectedBlock: (selectedBlock: string) => void;
    yourTurn: boolean;
    blockDimension: number;
    lastMove: MoveModel | undefined;
}


export default function RatedGameRow({
    row,
    availableBlocks,
    wordCheckComplete,
    moves,
    selectedBlock,
    setSelectedBlock,
    yourTurn,
    blockDimension,
    lastMove
}: RatedGameRowProps) {

    return (
        <HStack spacing="0px">
            {row.map((block, index) => (
                <RatedGameBlock
                    key={index}
                    block={block}
                    availableBlocks={availableBlocks}
                    wordCheckComplete={wordCheckComplete}
                    moves={moves}
                    selectedBlock={selectedBlock}
                    yourTurn={yourTurn}
                    blockDimension={blockDimension}
                    lastMove={lastMove}
                    setSelectedBlock={setSelectedBlock}
                />
            ))}

        </HStack>
    );
}
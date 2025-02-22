import { GridSpotModel, MoveModel } from "../../../../Background/Models";
import { HStack } from "../../../../ReactSwiftly";
import CasualGameBlock2 from "./CasualGameBlock2";


interface CasualGameRow2Props {
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

export default function CasualGameRow2({
    row,
    availableBlocks,
    wordCheckComplete,
    moves,
    selectedBlock,
    setSelectedBlock,
    yourTurn,
    blockDimension,
    lastMove
}: CasualGameRow2Props) {

    return (
        <HStack spacing="0px">
            {row.map((block, index) => (
                <CasualGameBlock2 
                    key={index}
                    block={block}
                    availableBlocks={availableBlocks}
                    wordCheckComplete={wordCheckComplete}
                    moves={moves}
                    selectedBlock={selectedBlock}
                    setSelectedBlock={setSelectedBlock}
                    yourTurn={yourTurn}
                    blockDimension={blockDimension}
                    lastMove={lastMove}

                />
            ))}

        </HStack>
    );
}
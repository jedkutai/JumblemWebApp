import { GridSpotModel, MoveModel } from "../../../../Background/Models";
import { HStack } from "../../../../ReactSwiftly";
import CasualGameBlock from "./CasualGameBlock";

interface CasualGameRowProps {
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


export default function CasualGameRow({
    row,
    availableBlocks,
    wordCheckComplete,
    moves,
    selectedBlock,
    setSelectedBlock,
    yourTurn,
    blockDimension,
    lastMove
}: CasualGameRowProps) {

    return (
        <HStack spacing="0px">
            {row.map((block, index) => (
                <CasualGameBlock
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
            {/* <CasualGameBlock
                block={row[0]}
                availableBlocks={availableBlocks}
                wordCheckComplete={wordCheckComplete}
                moves={moves}
                selectedBlock={selectedBlock}
                yourTurn={yourTurn}
                blockDimension={blockDimension}
                lastMove={lastMove}
                setSelectedBlock={setSelectedBlock}
            />
            <CasualGameBlock
                block={row[1]}
                availableBlocks={availableBlocks}
                wordCheckComplete={wordCheckComplete}
                moves={moves}
                selectedBlock={selectedBlock}
                yourTurn={yourTurn}
                blockDimension={blockDimension}
                lastMove={lastMove}
                setSelectedBlock={setSelectedBlock}
            />
            <CasualGameBlock
                block={row[2]}
                availableBlocks={availableBlocks}
                wordCheckComplete={wordCheckComplete}
                moves={moves}
                selectedBlock={selectedBlock}
                yourTurn={yourTurn}
                blockDimension={blockDimension}
                lastMove={lastMove}
                setSelectedBlock={setSelectedBlock}
            />
            <CasualGameBlock
                block={row[3]}
                availableBlocks={availableBlocks}
                wordCheckComplete={wordCheckComplete}
                moves={moves}
                selectedBlock={selectedBlock}
                yourTurn={yourTurn}
                blockDimension={blockDimension}
                lastMove={lastMove}
                setSelectedBlock={setSelectedBlock}
            />
            <CasualGameBlock
                block={row[4]}
                availableBlocks={availableBlocks}
                wordCheckComplete={wordCheckComplete}
                moves={moves}
                selectedBlock={selectedBlock}
                yourTurn={yourTurn}
                blockDimension={blockDimension}
                lastMove={lastMove}
                setSelectedBlock={setSelectedBlock}
            />
            <CasualGameBlock
                block={row[5]}
                availableBlocks={availableBlocks}
                wordCheckComplete={wordCheckComplete}
                moves={moves}
                selectedBlock={selectedBlock}
                yourTurn={yourTurn}
                blockDimension={blockDimension}
                lastMove={lastMove}
                setSelectedBlock={setSelectedBlock}
            />
            <CasualGameBlock
                block={row[6]}
                availableBlocks={availableBlocks}
                wordCheckComplete={wordCheckComplete}
                moves={moves}
                selectedBlock={selectedBlock}
                yourTurn={yourTurn}
                blockDimension={blockDimension}
                lastMove={lastMove}
                setSelectedBlock={setSelectedBlock}
            /> */}

        </HStack>
    );
}
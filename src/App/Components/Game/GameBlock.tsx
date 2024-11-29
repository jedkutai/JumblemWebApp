import { GridSpotModel, MoveModel } from "../../../Background/Models";
import EmptyBlock from "../EmptyBlock";
import EmptySelectedBlock from "../EmptySelectedBlock";
import EmptyValidBlock from "../EmptyValidBlock";
import WhiteLetterBlock from "../WhiteLetterBlock";
import YellowLetterBlock from "../YellowLetterBlock";

interface GameBlockProps {
    block: GridSpotModel
    availableBlocks: string[];
    wordCheckComplete: boolean;
    moves: Record<string, MoveModel>;
    selectedBlock: string;
    setSelectedBlock: (selectedBlock: string) => void;
    yourTurn: boolean;
    blockDimension: number;
    lastMove: MoveModel | undefined;

}

export default function GameBlock({
    // index,
    // row,
    block,
    availableBlocks,
    wordCheckComplete,
    moves,
    selectedBlock,
    setSelectedBlock,
    yourTurn,
    blockDimension,
    lastMove
}: GameBlockProps) {
    


    return (
        <>
            {availableBlocks.includes(block.id) && Object.keys(moves).includes(block.id) && lastMove && lastMove.coordinates === block.id && (
                <YellowLetterBlock letter={moves[block.id].letter} blockDimension={blockDimension} />
            )}
            {availableBlocks.includes(block.id) && Object.keys(moves).includes(block.id) && lastMove && lastMove.coordinates !== block.id && (
                <WhiteLetterBlock letter={moves[block.id].letter} blockDimension={blockDimension} />
            )}
            {availableBlocks.includes(block.id) && !Object.keys(moves).includes(block.id) && (!yourTurn || !wordCheckComplete) && (
                <EmptyBlock blockDimension={blockDimension} />
            )}
            {availableBlocks.includes(block.id) && !Object.keys(moves).includes(block.id) && yourTurn && wordCheckComplete && (selectedBlock === block.id) && (
                <EmptySelectedBlock blockDimension={blockDimension} setSelectedBlock={setSelectedBlock}/>
            )}
            {availableBlocks.includes(block.id) && !Object.keys(moves).includes(block.id) && yourTurn && wordCheckComplete && (selectedBlock !== block.id) && (
                <EmptyValidBlock blockDimension={blockDimension} setSelectedBlock={setSelectedBlock} blockId={block.id}/>
            )}
            {!availableBlocks.includes(block.id) && (
                <EmptyBlock blockDimension={blockDimension} />
            )}
        </>
    )
}
import { GridSpotModel, MoveModel } from "../../../../Background/Models";
import { EmptyBlock, EmptySelectedBlock, EmptyValidBlock, WhiteLetterBlock, YellowLetterBlock } from "../../../Components";

interface CasualGameBlock2Props {
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

export default function CasualGameBlock2({
    block,
    availableBlocks,
    wordCheckComplete,
    moves,
    selectedBlock,
    setSelectedBlock,
    yourTurn,
    blockDimension,
    lastMove
}: CasualGameBlock2Props) {

    if (availableBlocks.includes(block.id)) {
        if (Object.keys(moves).includes(block.id)) {
            if (lastMove && lastMove.coordinates == block.id) {
                return (
                    <YellowLetterBlock letter={moves[block.id].letter} blockDimension={blockDimension} />
                );

            } else {
                return (
                    <WhiteLetterBlock letter={moves[block.id].letter} blockDimension={blockDimension} />
                );

            }
        } else if (!yourTurn || !wordCheckComplete) {
            return (
                <EmptyBlock blockDimension={blockDimension} />
            );

        } else if (selectedBlock == block.id) {
            return (
                <EmptySelectedBlock blockDimension={blockDimension} setSelectedBlock={setSelectedBlock} />
            );

        } else {
            return (
                <EmptyValidBlock blockDimension={blockDimension} setSelectedBlock={setSelectedBlock} blockId={block.id} />
            );

        }
    } else {
        return (
            <EmptyBlock blockDimension={blockDimension} />
        );
    }


}
import { GridSpotModel, MoveModel } from "../../../../Background/Models";
import { EmptyBlock, WhiteLetterBlock, YellowLetterBlock } from "../../../Components";

interface SpectateGameBlockProps {
    block: GridSpotModel;
    movesDict: Record<string, MoveModel>;
    blockDimension: number;
    lastMove: MoveModel | undefined;
    winningGridSpots: string[];
}

export default function SpectateGameBlock({
    block,
    movesDict,
    blockDimension,
    lastMove,
    winningGridSpots
}: SpectateGameBlockProps) {
    if (winningGridSpots.includes(block.id)) {
        return (
            <WhiteLetterBlock letter={movesDict[block.id].letter} blockDimension={blockDimension} highlight={true}/>
        )
    } else if (Object.keys(movesDict).includes(block.id)) {
        if (lastMove && lastMove.coordinates == block.id) {
            return (
                <YellowLetterBlock letter={movesDict[block.id].letter} blockDimension={blockDimension} />
            );

        } else {
            return (
                <WhiteLetterBlock letter={movesDict[block.id].letter} blockDimension={blockDimension} />
            );

        }
    } else {
        return (
            <EmptyBlock blockDimension={blockDimension} />
        );
    }
}
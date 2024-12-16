
import { MoveModel } from "../../../Background/Models";
import { EmptyBlock, WhiteLetterBlock } from "../../Components";

interface PreviousGameBlockProps {
    movesCount: number;
    maxMoves: number;
    winningGridSpots: string[];
    move: MoveModel | null;
    blockDimension: number;
}

export default function PreviousGameBlock({
    movesCount,
    maxMoves,
    winningGridSpots,
    move,
    blockDimension,
}: PreviousGameBlockProps) {
    const partOfWord = move ? movesCount === maxMoves && winningGridSpots.includes(move.coordinates) : false;


    return (
        <>
            {move ? (
                <WhiteLetterBlock letter={move.letter} blockDimension={blockDimension} highlight={partOfWord} />
            ) : (
                <EmptyBlock blockDimension={blockDimension}/>
            )}
        </>
    );
}
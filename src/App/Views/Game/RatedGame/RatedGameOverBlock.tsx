import { MoveModel } from "../../../../Background/Models";
import { WhiteLetterBlock, EmptyBlock } from "../../../Components";

interface RatedGameOverBlockProps {
    move: MoveModel | undefined;
    partOfWord: boolean;
    blockDimension: number;
}

export default function RatedGameOverBlock({ move, partOfWord, blockDimension }: RatedGameOverBlockProps) {


    return (
        <>
            {move && (
                <WhiteLetterBlock letter={move.letter} blockDimension={blockDimension} highlight={partOfWord}/>
            )}
            {move == undefined && (
                <EmptyBlock blockDimension={blockDimension} />
            )}
        </>
    );
}
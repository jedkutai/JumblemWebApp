import { MoveModel } from "../../../../Background/Models";
import { WhiteLetterBlock, EmptyBlock } from "../../../Components";

interface CasualGameOverBlockProps {
    move: MoveModel | undefined;
    partOfWord: boolean;
    blockDimension: number;
}

export default function CasualGameOverBlock({ move, partOfWord, blockDimension }: CasualGameOverBlockProps) {


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
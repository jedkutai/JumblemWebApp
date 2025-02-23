import { MoveModel } from "../../../../Background/Models";
import { WhiteLetterBlock, EmptyBlock } from "../../../Components";

interface PrivateGameOverBlockProps {
    move: MoveModel | undefined;
    partOfWord: boolean;
    blockDimension: number;
}

export default function PrivateGameOverBlock({ move, partOfWord, blockDimension }: PrivateGameOverBlockProps) {


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
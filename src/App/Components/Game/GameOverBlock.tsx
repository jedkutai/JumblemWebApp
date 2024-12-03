import { MoveModel } from "../../../Background/Models";
import EmptyBlock from "../EmptyBlock";
import WhiteLetterBlock from "../WhiteLetterBlock";

interface GameOverBlockProps {
    move: MoveModel | undefined;
    partOfWord: boolean;
    blockDimension: number;
}

export default function GameOverBlock({ move, partOfWord, blockDimension }: GameOverBlockProps) {


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
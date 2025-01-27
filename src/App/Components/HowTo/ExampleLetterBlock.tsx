import { EmptyValidBlock } from "../EmptyValidBlock";
import { WhiteLetterBlock } from "../WhiteLetterBlock";

interface ExampleLetterBlockProps {
    letter: string;
    highlight: boolean;
    outline: boolean;
    blockDimension: number;
}

export default function ExampleLetterBlock({
    letter,
    highlight,
    outline,
    blockDimension
}: ExampleLetterBlockProps) {
    function doNothing() {

    }

    if (outline) {
        return (
            <EmptyValidBlock blockDimension={blockDimension} blockId="" setSelectedBlock={doNothing}/>
        );
    } else {
        return (
            <WhiteLetterBlock highlight={highlight} letter={letter} blockDimension={blockDimension}/>
        );
    }

}
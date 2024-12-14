import { PartialWordModel } from "../../Background/Models";
import { HStack } from "../../ReactSwiftly";
import { WhiteLetterBlock } from "./WhiteLetterBlock";

interface DisplayPartialWordProps {
    partialWord: PartialWordModel;
    blockDismension: number;
}

export default function DisplayPartialWord({partialWord, blockDismension}: DisplayPartialWordProps) {

    return (
        <HStack spacing="0px">
            {partialWord.partialWord.split("").map((letter, index) => (
                <WhiteLetterBlock key={index} letter={letter} blockDimension={blockDismension} border={true}/>
            ))}
        </HStack>
    );
}
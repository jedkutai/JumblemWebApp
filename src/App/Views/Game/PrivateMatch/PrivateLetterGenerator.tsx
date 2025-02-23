// import { useEffect } from "react";
// import { GameModel, MoveModel, UserModel } from "../../../../Background/Models";
// import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
// import { HStack } from "../../../../ReactSwiftly";
// import PrivateLetterGeneratorBlock from "./PrivateLetterGeneratorBlock";
// import { GameFunctions } from "../../../../Background/Utils/GameFunctions";

// interface PrivateLetterGeneratorProps {
//     user: UserModel;
//     game: GameModel;
//     letters: string[];
//     setLetters: (letters: string[]) => void;
//     wordCheckComplete: boolean;
//     moves: Record<string, MoveModel>;
//     selectedBlock: string;
//     setSelectedBlock: (selectedBlock: string) => void;
//     yourTurn: boolean;
//     setYourTurn: (turn: boolean) => void;
//     blockDimension: number;
//     movesMade: number;
// }

// export default function PrivateLetterGenerator({
//     user,
//     game,
//     letters,
//     setLetters,
//     wordCheckComplete,
//     selectedBlock,
//     setSelectedBlock,
//     yourTurn,
//     setYourTurn,
//     blockDimension,
//     movesMade
// }: PrivateLetterGeneratorProps) {
//     const { minDimension } = useWindowSize();
//     const dimensionDivider = 9 * 1.75;
//     const upperBound = 650;

//     useEffect(() => {
//         const temp = GameFunctions.getLetters(7);
//         temp.sort();
//         setLetters(temp);
//     }, []);
    
//     return (
//         <HStack
//             spacing="0px"
//             width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
//         >
//             {letters.map((letter, index) => (
//                 <PrivateLetterGeneratorBlock
//                     key={index}
//                     user={user}
//                     game={game}
//                     letters={letters}
//                     setLetters={setLetters}
//                     letter={letter}
//                     yourTurn={yourTurn}
//                     setYourTurn={setYourTurn}
//                     wordCheckComplete={wordCheckComplete}
//                     blockDimension={blockDimension}
//                     removeIndex={index}
//                     selectedBlock={selectedBlock}
//                     setSelectedBlock={setSelectedBlock}
//                     movesMade={movesMade}
//                 />
//             ))}
//         </HStack>
//     );
// }
// import { useState } from "react";
// import { UserModel, GameModel } from "../../../../Background/Models";
// import { RatedGameService } from "../../../../Background/Service";
// import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
// import { DimLetterBlock, ClickableWhiteLetterBlock } from "../../../Components";

// interface RatedLetterGeneratorBlockProps {
//     user: UserModel;
//     game: GameModel;
//     letters: string[];
//     setLetters: (letters: string[]) => void;
//     yourTurn: boolean;
//     setYourTurn: (turn: boolean) => void;
//     wordCheckComplete: boolean;
//     blockDimension: number;
//     letter: string;
//     removeIndex: number;
//     selectedBlock: string;
//     setSelectedBlock: (selectedBlock: string) => void;
//     movesMade: number;
// }

// export default function RatedLetterGeneratorBlock({
//     user,
//     game,
//     letters,
//     setLetters,
//     yourTurn,
//     setYourTurn,
//     wordCheckComplete,
//     blockDimension,
//     removeIndex,
//     selectedBlock,
//     setSelectedBlock,
//     letter,
//     movesMade
// }: RatedLetterGeneratorBlockProps) {
//     const [canSelect, setCanSelect] = useState(true);



//     async function bustAMove() {
//         if (yourTurn && wordCheckComplete) {
//             setCanSelect(false);
//             setYourTurn(false);
//             try {
//                 await RatedGameService.makeMove(user, game, selectedBlock, letter, (movesMade + 1));
//                 letters.splice(removeIndex, 1);

//                 const newLetters = GameFunctions.getLetters(1);
//                 const updatedLetters: string[] = [...letters, ...newLetters];
//                 updatedLetters.sort();
//                 setLetters(updatedLetters);

//                 setSelectedBlock("");
//                 setCanSelect(true);
//             } catch {

//             }
//             // setSelectedBlock("");
//             // setCanSelect(true);
//         }
//     }

//     return (
//         <>
//             {(selectedBlock === "" || !canSelect) && (
//                 <DimLetterBlock letter={letter} blockDimension={blockDimension} />
//             )}

//             {!(selectedBlock === "") && canSelect && (
//                 <ClickableWhiteLetterBlock letter={letter} blockDimension={blockDimension} action={bustAMove}/>
//             )}
//         </>
//     );
// }


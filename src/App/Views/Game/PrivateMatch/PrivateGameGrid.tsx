// import { useEffect, useState } from "react";
// import { GameModel, GridSpotModel, MoveModel, UserModel } from "../../../../Background/Models";
// import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
// import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
// import { VStack } from "../../../../ReactSwiftly";
// import PrivateGameRow from "./PrivateGameRow";
// import { GridSpot } from "../../../../Background/Extends/GridSpot";
// import PrivateLetterGenerator from "./PrivateLetterGenerator";
// import PregameMessage from "../../../Components/PregameMessage";


// interface PrivateGameGridProps {
//     user: UserModel;
//     game: GameModel;
//     gameOver: boolean;
//     wordCheckComplete: boolean;
//     matchAbortedTime: number;
//     movesDict: Record<string, MoveModel>;
//     yourTurn: boolean;
//     setYourTurn: (turn: boolean) => void;
//     lastMove: MoveModel | undefined;
//     movesCopy: MoveModel[];
// }

// export default function PrivateGameGrid({
//     user,
//     game,
//     wordCheckComplete,
//     matchAbortedTime,
//     movesDict,
//     yourTurn,
//     setYourTurn,
//     lastMove,
// }: PrivateGameGridProps) {
//     const { minDimension } = useWindowSize();
//     const [grid] = useState<GridSpotModel[][]>(GridSpot.grid);
//     const [letters, setLetters] = useState<string[]>([]);
//     // const [canSelect, setCanSelect] = useState(false);
//     const [availableBlocks, setAvailableBlocks] = useState(["3,3"]);
//     const [selectedBlock, setSelectedBlock] = useState("");
//     const dimensionDivider = 9 * 1.75;
//     const upperBound = 650;
//     useEffect(() => {
//         const newAvailableBlocks = GameFunctions.getAvailableBlocks(movesDict, availableBlocks);
//         setAvailableBlocks(newAvailableBlocks);
//     }, [movesDict]);


//     return (
//         // <VStack maxHeight={`${(Math.max(minDimension, upperBound) * 8 / dimensionDivider) + 200}px`} spacing="10px">
//         <VStack spacing="10px">
//             <VStack
//                 spacing="0px"
//                 backgroundColor="rgb(255, 255, 255, 0.25)"
//                 width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
//                 minHeight={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
//                 cornerRadius="5px"
//             >
//                 {grid.map((row, index) => (
//                     <PrivateGameRow
//                         key={index}
//                         row={row}
//                         availableBlocks={availableBlocks}
//                         wordCheckComplete={wordCheckComplete}
//                         moves={movesDict}
//                         selectedBlock={selectedBlock}
//                         setSelectedBlock={setSelectedBlock}
//                         yourTurn={yourTurn}
//                         blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
//                         lastMove={lastMove}
//                     />
//                 ))}

//             </VStack>

//             <PrivateLetterGenerator
//                 user={user}
//                 game={game}
//                 letters={letters}
//                 setLetters={setLetters}
//                 wordCheckComplete={wordCheckComplete}
//                 moves={movesDict}
//                 selectedBlock={selectedBlock}
//                 setSelectedBlock={setSelectedBlock}
//                 yourTurn={yourTurn}
//                 setYourTurn={setYourTurn}
//                 blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
//             />

//             {lastMove == undefined && matchAbortedTime > 10 && (
//                 <PregameMessage />
//             )}
//             {lastMove == undefined && matchAbortedTime <= 10 && (
//                 <p>{yourTurn ? `Make first move in ${Math.max(matchAbortedTime, 0)}...` : `Auto-abort in ${Math.max(matchAbortedTime, 0)}...`}</p>
//             )}
//         </VStack>
//     );


// }
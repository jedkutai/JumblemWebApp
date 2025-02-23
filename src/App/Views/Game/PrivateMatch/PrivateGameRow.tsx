// import { GridSpotModel, MoveModel } from "../../../../Background/Models";
// import { HStack } from "../../../../ReactSwiftly";
// import PrivateGameBlock from "./PrivateGameBlock";

// interface PrivateGameRowProps {
//     row: GridSpotModel[];
//     availableBlocks: string[];
//     wordCheckComplete: boolean;
//     moves: Record<string, MoveModel>;
//     selectedBlock: string;
//     setSelectedBlock: (selectedBlock: string) => void;
//     yourTurn: boolean;
//     blockDimension: number;
//     lastMove: MoveModel | undefined;
// }


// export default function PrivateGameRow({
//     row,
//     availableBlocks,
//     wordCheckComplete,
//     moves,
//     selectedBlock,
//     setSelectedBlock,
//     yourTurn,
//     blockDimension,
//     lastMove
// }: PrivateGameRowProps) {

//     return (
//         <HStack spacing="0px">
//             {row.map((block, index) => (
//                 <PrivateGameBlock
//                     key={index}
//                     block={block}
//                     availableBlocks={availableBlocks}
//                     wordCheckComplete={wordCheckComplete}
//                     moves={moves}
//                     selectedBlock={selectedBlock}
//                     yourTurn={yourTurn}
//                     blockDimension={blockDimension}
//                     lastMove={lastMove}
//                     setSelectedBlock={setSelectedBlock}
//                 />
//             ))}

//         </HStack>
//     );
// }
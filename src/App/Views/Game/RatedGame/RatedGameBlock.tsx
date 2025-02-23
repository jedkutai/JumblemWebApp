// import { GridSpotModel, MoveModel } from "../../../../Background/Models";
// import { YellowLetterBlock, WhiteLetterBlock, EmptyBlock, EmptySelectedBlock, EmptyValidBlock } from "../../../Components";


// interface RatedGameBlockProps {
//     block: GridSpotModel
//     availableBlocks: string[];
//     wordCheckComplete: boolean;
//     moves: Record<string, MoveModel>;
//     selectedBlock: string;
//     setSelectedBlock: (selectedBlock: string) => void;
//     yourTurn: boolean;
//     blockDimension: number;
//     lastMove: MoveModel | undefined;

// }

// export default function RatedGameBlock({
//     block,
//     availableBlocks,
//     wordCheckComplete,
//     moves,
//     selectedBlock,
//     setSelectedBlock,
//     yourTurn,
//     blockDimension,
//     lastMove
// }: RatedGameBlockProps) {
    


//     return (
//         <>
//             {(availableBlocks.includes(block.id) && Object.keys(moves).includes(block.id) && lastMove && lastMove.coordinates === block.id) && (
//                 <YellowLetterBlock letter={moves[block.id].letter} blockDimension={blockDimension} />
//             )}
//             {(availableBlocks.includes(block.id) && Object.keys(moves).includes(block.id) && lastMove && lastMove.coordinates !== block.id) && (
//                 <WhiteLetterBlock letter={moves[block.id].letter} blockDimension={blockDimension} />
//             )}
//             {(availableBlocks.includes(block.id) && !Object.keys(moves).includes(block.id) && (!yourTurn || !wordCheckComplete)) && (
//                 <EmptyBlock blockDimension={blockDimension} />
//             )}
//             {(availableBlocks.includes(block.id) && !Object.keys(moves).includes(block.id) && yourTurn && wordCheckComplete && (selectedBlock === block.id)) && (
//                 <EmptySelectedBlock blockDimension={blockDimension} setSelectedBlock={setSelectedBlock}/>
//             )}
//             {(availableBlocks.includes(block.id) && !Object.keys(moves).includes(block.id) && yourTurn && wordCheckComplete && (selectedBlock !== block.id)) && (
//                 <EmptyValidBlock blockDimension={blockDimension} setSelectedBlock={setSelectedBlock} blockId={block.id}/>
//             )}
//             {(!availableBlocks.includes(block.id)) && (
//                 <EmptyBlock blockDimension={blockDimension} />
//             )}
//         </>
//     )
// }
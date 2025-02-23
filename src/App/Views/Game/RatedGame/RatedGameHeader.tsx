
// import { HSpacer, HStack, VStack } from "../../../../ReactSwiftly";
// import RatedPlayerHeader from "./RatedPlayerHeader";


// interface RatedGameHeaderProps {

//     userId: string,
//     opponentId: string | undefined,
//     userTimeRemaining: number,
//     opponentTimeRemaining: number,
//     yourTurn: boolean,
//     userRatingChange?: number,
//     opponentRatingChange?: number,
//     clock: number,
// }

// export default function RatedGameHeader({

//     userId, 
//     opponentId, 
//     userTimeRemaining, 
//     opponentTimeRemaining, 
//     yourTurn, 
//     clock,
//     userRatingChange,
//     opponentRatingChange,
// }: RatedGameHeaderProps) {



//     return (
//         <VStack>
//             <HStack maxWidth="400px">
//                 <HSpacer/>
//                 <RatedPlayerHeader 
//                     playerId={userId}
//                     timeRemaining={yourTurn ? userTimeRemaining - clock : userTimeRemaining}
//                     highlight={yourTurn}
//                     ratingChange={userRatingChange}
//                 />
//                 <HSpacer/>
//                 <RatedPlayerHeader
//                     playerId={opponentId}
//                     timeRemaining={!yourTurn ? opponentTimeRemaining - clock : opponentTimeRemaining}
//                     highlight={!yourTurn}
//                     ratingChange={opponentRatingChange}
//                 />
//                 <HSpacer/>
//             </HStack>
//         </VStack>
//     );

// }

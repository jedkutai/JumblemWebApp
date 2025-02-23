// // import { useEffect, useState } from "react";
// import { HSpacer, HStack, VStack } from "../../../../ReactSwiftly";
// import CasualPlayerHeader from "./CasualPlayerHeader";


// interface CasualGameHeaderProps {
//     userId: string,
//     opponentId: string | undefined,
//     userTimeRemaining: number,
//     opponentTimeRemaining: number,
//     yourTurn: boolean,
//     clock: number,
// }

// export default function CasualGameHeader({
//     userId, 
//     opponentId, 
//     userTimeRemaining, 
//     opponentTimeRemaining, 
//     yourTurn, 
//     clock,
// }: CasualGameHeaderProps) {


//     return (
//         <VStack>
//             <HStack maxWidth="400px">
//                 <HSpacer/>
//                 <CasualPlayerHeader 
//                     playerId={userId}
//                     timeRemaining={yourTurn ? userTimeRemaining - clock : userTimeRemaining}
//                     highlight={yourTurn}

//                 />
//                 <HSpacer/>
//                 <CasualPlayerHeader
//                     playerId={opponentId}
//                     timeRemaining={!yourTurn ? opponentTimeRemaining - clock : opponentTimeRemaining}
//                     highlight={!yourTurn}
//                 />
//                 <HSpacer/>
//             </HStack>
//         </VStack>
//     );

// }
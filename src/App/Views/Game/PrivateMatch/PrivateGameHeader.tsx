// // import { useEffect, useState } from "react";
// import { HSpacer, HStack, VStack } from "../../../../ReactSwiftly";
// import PrivatePlayerHeader from "./PrivatePlayerHeader";


// interface PrivateGameHeaderProps {
//     // userTimeExpired: boolean,
//     // setUserTimeExpired: (userTimeExpired: boolean) => void,
//     // checkOpponentTimeExpired: boolean,
//     // setCheckOpponentTimeExpired: (checkOpponentTimeExpired: boolean) => void,
//     userId: string,
//     opponentId: string | undefined,
//     userTimeRemaining: number,
//     opponentTimeRemaining: number,
//     yourTurn: boolean,
//     clock: number,
//     // firstMoveMade: boolean,
//     // gameOver: boolean,
// }

// export default function PrivateGameHeader({
//     // setUserTimeExpired,
//     // setCheckOpponentTimeExpired,
//     userId, 
//     opponentId, 
//     userTimeRemaining, 
//     opponentTimeRemaining, 
//     yourTurn, 
//     clock,
//     // firstMoveMade,
//     // gameOver,
// }: PrivateGameHeaderProps) {




//     return (
//         <VStack>
//             <HStack maxWidth="400px">
//                 <HSpacer/>
//                 <PrivatePlayerHeader 
//                     playerId={userId}
//                     timeRemaining={yourTurn ? userTimeRemaining - clock : userTimeRemaining}
//                     highlight={yourTurn}

//                 />
//                 <HSpacer/>
//                 <PrivatePlayerHeader
//                     playerId={opponentId}
//                     timeRemaining={!yourTurn ? opponentTimeRemaining - clock : opponentTimeRemaining}
//                     highlight={!yourTurn}
//                 />
//                 <HSpacer/>
//             </HStack>
//         </VStack>
//     );

// }

// // playerId: string,
// // timeRemaining: number,
// // highlight: boolean,
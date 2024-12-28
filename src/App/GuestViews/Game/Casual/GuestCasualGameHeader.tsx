// import { useState, useEffect } from "react";
import { VStack, HStack, HSpacer } from "../../../../ReactSwiftly";
import CasualPlayerHeader from "../../../Views/Game/CasualGame/CasualPlayerHeader";

interface GuestCasualGameHeaderProps {
    // userTimeExpired: boolean,
    // setUserTimeExpired: (userTimeExpired: boolean) => void,
    // checkOpponentTimeExpired: boolean,
    // setCheckOpponentTimeExpired: (checkOpponentTimeExpired: boolean) => void,
    userId: string,
    opponentId: string | undefined,
    userTimeRemaining: number,
    opponentTimeRemaining: number,
    yourTurn: boolean,
    clock: number,
    // firstMoveMade: boolean,
    // gameOver: boolean,
}

export default function GuestCasualGameHeader({
    // setUserTimeExpired,
    // setCheckOpponentTimeExpired,
    userId, 
    opponentId, 
    userTimeRemaining, 
    opponentTimeRemaining, 
    yourTurn, 
    clock,
    // firstMoveMade,
    // gameOver,
}: GuestCasualGameHeaderProps) {




    return (
        <VStack>
            <HStack maxWidth="400px">
                <HSpacer/>
                <CasualPlayerHeader 
                    playerId={userId}
                    timeRemaining={yourTurn ? userTimeRemaining - clock : userTimeRemaining}
                    highlight={yourTurn}

                />
                <HSpacer/>
                <CasualPlayerHeader
                    playerId={opponentId}
                    timeRemaining={!yourTurn ? opponentTimeRemaining - clock : opponentTimeRemaining}
                    highlight={!yourTurn}
                />
                <HSpacer/>
            </HStack>
        </VStack>
    );

}
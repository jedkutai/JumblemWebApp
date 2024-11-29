import { useEffect, useState } from "react";
import { HSpacer, HStack, VStack } from "../../../../ReactSwiftly";
import CasualPlayerHeader from "./CasualPlayerHeader";


interface CasualGameHeaderProps {
    userTimeExpired: boolean,
    setUserTimeExpired: (userTimeExpired: boolean) => void,
    checkOpponentTimeExpired: boolean,
    setCheckOpponentTimeExpired: (checkOpponentTimeExpired: boolean) => void,
    userId: string,
    opponentId: string | undefined,
    userTimeRemaining: number,
    opponentTimeRemaining: number,
    yourTurn: boolean,
    firstMoveMade: boolean,
    gameOver: boolean,
    
}

export default function CasualGameHeader({
    userTimeExpired, 
    setUserTimeExpired,
    checkOpponentTimeExpired, 
    setCheckOpponentTimeExpired,
    userId, 
    opponentId, 
    userTimeRemaining, 
    opponentTimeRemaining, 
    yourTurn, 
    firstMoveMade,
    gameOver
}: CasualGameHeaderProps) {

    const [tick, setTick] = useState(false);
    const [clock, setClock] = useState(0);

    useEffect(() => {
        setTick(!tick);
    }, []);

    useEffect(() => {
        setClock(0);
    }, [yourTurn]);

    useEffect(() => {

        if (!gameOver) {
            const timeout = setTimeout(async() => {
                if (firstMoveMade) {
                    setClock(clock + 1);
                }
                setTick(!tick);
            }, 1000);

            if (yourTurn && userTimeRemaining - clock <= 0) {
                setUserTimeExpired(true);
            } else if (!yourTurn && opponentTimeRemaining - clock <= 0) {
                setCheckOpponentTimeExpired(true);
            }

            return () => clearTimeout(timeout);
        }
    }, [tick])


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

// playerId: string,
// timeRemaining: number,
// highlight: boolean,
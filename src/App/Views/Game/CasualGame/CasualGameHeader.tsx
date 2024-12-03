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
    setUserTimeExpired,
    setCheckOpponentTimeExpired,
    userId, 
    opponentId, 
    userTimeRemaining, 
    opponentTimeRemaining, 
    yourTurn, 
    firstMoveMade,
    gameOver,
}: CasualGameHeaderProps) {

    const [tick, setTick] = useState(false);
    const [clock, setClock] = useState(0);
    const [anchorTime, setAnchorTime] = useState(Date.now());

    useEffect(() => {
        setTick(!tick);
    }, []);

    useEffect(() => {
        setClock(0);
        setAnchorTime(Date.now());
    }, [yourTurn]);

    useEffect(() => {

        if (!gameOver) {
            const timeout = setTimeout(async() => {
                if (firstMoveMade) {

                    const elapsedSeconds = Math.floor((Date.now() - anchorTime) / 1000);
                    setClock(elapsedSeconds);
                }

                if (yourTurn && userTimeRemaining - clock <= 0) {
                    setUserTimeExpired(true);
                } else if (!yourTurn && opponentTimeRemaining - clock <= 0) {
                    setCheckOpponentTimeExpired(true);
                }

                setTick(!tick);
            }, 1000);



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
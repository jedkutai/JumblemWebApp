import { useEffect, useState } from "react";
import { HSpacer, HStack, VStack } from "../../../../ReactSwiftly";
import CasualPlayerHeader2 from "./CasualPlayerHeader2";

interface CasualGameHeader2Props {
    setUserTimeExpired: (timeExpired: boolean) => void;
    setCheckOpponentTimeExpired: (timeExpired: boolean) => void;

    userId: string;
    opponentId: string | undefined,
    userTimeRemaining: number;
    opponentTimeRemaining: number;
    yourTurn: boolean;
    firstMoveMade: boolean;
    gameOver: boolean;
    anchorTime: number;
}

export default function CasualGameHeader2({
    setUserTimeExpired,
    setCheckOpponentTimeExpired,
    userId,
    opponentId,
    userTimeRemaining,
    opponentTimeRemaining,
    yourTurn,
    firstMoveMade,
    gameOver,
    anchorTime
}: CasualGameHeader2Props) {
    const [tick, setTick] = useState(false);
    const [userClock, setUserClock] = useState(0);
    const [opponentClock, setOpponentClock] = useState(0);
    const [recentTurnChange, setRecentTurnChange] = useState(false);

    async function onAppearActions() {
        try {
            setTick(!tick);
        } catch {

        }
    }
    useEffect(() => {
        onAppearActions();
    }, []);

    useEffect(() => {
        setRecentTurnChange(true);
        setOpponentClock(0);
        setUserClock(0);
    }, [yourTurn]);

    useEffect(() => {
        if (!gameOver) {
            const timeout = setTimeout(async () => {
                if (recentTurnChange) {
                    setRecentTurnChange(false);
                } else {
                    if (firstMoveMade) {
                        const elapsedSeconds = Math.floor((Date.now() - anchorTime) / 1000);
                        if (yourTurn) {
                            setUserClock(elapsedSeconds);
                            setOpponentClock(0);
                        } else {
                            setUserClock(0);
                            setOpponentClock(elapsedSeconds);
                        }
                    }

                    if (yourTurn && userTimeRemaining - userClock <= 0) {
                        setUserTimeExpired(true);
                    }
                    if (!yourTurn && opponentTimeRemaining - opponentClock <= 0) {
                        setCheckOpponentTimeExpired(true);
                    }

                }

                setTick(!tick);
            }, 1000 * 1);
            return () => clearTimeout(timeout);
        }
    }, [tick])

    return (
        <VStack>
            <HStack maxWidth="400px">
                <HSpacer />
                <CasualPlayerHeader2
                    playerId={userId}
                    timeRemaining={yourTurn ? userTimeRemaining - userClock : userTimeRemaining}
                    highlight={yourTurn}
                />


                <CasualPlayerHeader2
                    playerId={opponentId}
                    timeRemaining={!yourTurn ? opponentTimeRemaining - opponentClock : opponentTimeRemaining}
                    highlight={!yourTurn}
                />
                <HSpacer />
            </HStack>
        </VStack>
    );
}
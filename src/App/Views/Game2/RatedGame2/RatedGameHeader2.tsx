import { useState, useEffect } from "react";
import { VStack, HStack, HSpacer } from "../../../../ReactSwiftly";
import RatedPlayerHeader2 from "./RatedPlayerHeader2";
import { ClockFunctions } from "../../../../Background/Utils/ClockFunctions";

interface RatedGameHeader2Props {
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
    userRatingChange?: number,
    opponentRatingChange?: number,
}

export default function RatedGameHeader2({
    setUserTimeExpired,
    setCheckOpponentTimeExpired,
    userId,
    opponentId,
    userTimeRemaining,
    opponentTimeRemaining,
    yourTurn,
    firstMoveMade,
    gameOver,
    anchorTime,
    userRatingChange,
    opponentRatingChange
}: RatedGameHeader2Props) {
    const [tick, setTick] = useState(false);
    const [userClock, setUserClock] = useState(0);
    const [opponentClock, setOpponentClock] = useState(0);
    const [recentTurnChange, setRecentTurnChange] = useState(false);
    const [timeOffset, setTimeOffset] = useState(0);

    async function onAppearActions() {
        try {
            const internetTimeOffest = await ClockFunctions.getTimeOffset();
            setTimeOffset(internetTimeOffest);
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
                        const elapsedSeconds = Math.floor((Date.now() - anchorTime + timeOffset) / 1000);
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
                <RatedPlayerHeader2
                    playerId={userId}
                    timeRemaining={yourTurn ? userTimeRemaining - userClock : userTimeRemaining}
                    highlight={yourTurn}
                    ratingChange={userRatingChange}
                />


                <RatedPlayerHeader2
                    playerId={opponentId}
                    timeRemaining={!yourTurn ? opponentTimeRemaining - opponentClock : opponentTimeRemaining}
                    highlight={!yourTurn}
                    ratingChange={opponentRatingChange}
                />
                <HSpacer />
            </HStack>
        </VStack>
    );
}
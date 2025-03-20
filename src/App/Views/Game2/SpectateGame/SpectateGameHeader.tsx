import { useEffect, useState } from "react";
import { HSpacer, HStack, VStack } from "../../../../ReactSwiftly";
import CasualPlayerHeader2 from "../CasualGame2/CasualPlayerHeader2";

interface SpectateGameHeaderProps {
    playerOneId: string;
    playerTwoId: string | undefined,
    playerOneTimeRemaining: number;
    playerTwoTimeRemaining: number;
    playerTurnId: string;
    firstMoveMade: boolean;
    gameOver: boolean;
    anchorTime: number;
}

export default function SpectateGameHeader({
    playerOneId,
    playerTwoId,
    playerOneTimeRemaining,
    playerTwoTimeRemaining,
    playerTurnId,
    firstMoveMade,
    gameOver,
    anchorTime
}: SpectateGameHeaderProps) {
    const [tick, setTick] = useState(false);
    const [playerOneClock, setPlayerOneClock] = useState(0);
    const [playerTwoClock, setPlayerTwoClock] = useState(0);
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
        setPlayerOneClock(0);
        setPlayerTwoClock(0);
    }, [playerTurnId]);

    useEffect(() => {
        if (!gameOver) {
            const timeout = setTimeout(async () => {
                if (recentTurnChange) {
                    setRecentTurnChange(false);
                } else {
                    if (firstMoveMade) {
                        const elapsedSeconds = Math.floor((Date.now() - anchorTime) / 1000);
                        if (playerOneId == playerTurnId) {
                            setPlayerOneClock(elapsedSeconds);
                            setPlayerTwoClock(0);
                        } else {
                            setPlayerOneClock(0);
                            setPlayerTwoClock(elapsedSeconds);
                        }
                    }

                }

                setTick(!tick);
            }, 1000 * 1);
            return () => clearTimeout(timeout);
        }
    }, [tick])


    return (
        <VStack>
            <HSpacer />
            <HStack maxWidth="400px">
                <CasualPlayerHeader2
                    playerId={playerOneId}
                    timeRemaining={playerOneId == playerTurnId ? playerOneTimeRemaining - playerOneClock : playerOneTimeRemaining}
                    highlight={playerOneId == playerTurnId}
                />

                <CasualPlayerHeader2
                    playerId={playerTwoId}
                    timeRemaining={playerTwoId == playerTurnId ? playerTwoTimeRemaining - playerTwoClock : playerTwoTimeRemaining}
                    highlight={playerTwoId == playerTurnId}
                />

            </HStack>
            <HSpacer />
        </VStack>
    );
}
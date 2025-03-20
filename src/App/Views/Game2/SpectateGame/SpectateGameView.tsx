import { useEffect, useState } from "react";
import { GameModel, UserModel, WordModel } from "../../../../Background/Models";
import { View, VStack } from "../../../../ReactSwiftly";
import { useSpectateGameManager } from "../../../../Background/Managers/SpectateGameManager";
import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
import SpectateGameHeader from "./SpectateGameHeader";
import JumblemLogoSimple from "../../../Components/JumblemLogoSimple";
import SpectateGameGrid from "./SpectateGameGrid";
import PageNotFoundView from "../../../Components/PageNotFoundView";
import { useNavigate } from "react-router-dom";

interface SpectateGameViewProps {
    passedUser: UserModel;
    passedGame: GameModel;
    wordBankDict: Record<string, string[]>;
}

export default function SpectateGameView({ passedUser, passedGame, wordBankDict }: SpectateGameViewProps) {
    const {
        updatedGame,
        movesCopy,
        movesDict,
        playerTurnId,
        playerOneTimeRemaining,
        playerTwoTimeRemaining,
        gameOver,
        movesMade,
        anchorTime
    } = useSpectateGameManager(passedGame);

    const [winningWords, setWinningWords] = useState<WordModel[]>([]);
    const [winningGridSpots, setWinningGridSpots] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (gameOver) {
            const timeout = setTimeout(async () => {
                navigate(`/games/${passedGame.id}`);
            }, 1000 * 3);
    
            return () => clearTimeout(timeout);
        }
    }, [gameOver])

    useEffect(() => {
        wordCheckFunction();
    }, [movesDict]);

    async function wordCheckFunction(): Promise<void> {
        try {
            const lastMove = movesCopy.at(movesCopy.length - 1);
            if (lastMove) {
                const wordResults = await GameFunctions.checkWords(lastMove, movesDict, wordBankDict);
                let winningSpots: Set<string> = new Set();
                let updatedWinningWords = [...winningWords]; // Local copy

                for (const [word, coordinates] of wordResults) {
                    winningSpots = new Set([...winningSpots, ...coordinates]);
                    updatedWinningWords.push(word); // Update the local copy
                }

                setWinningWords(updatedWinningWords);
                setWinningGridSpots([...winningSpots]);
            }
        } catch (e) {
        }

    }


    if (passedUser.admin == true) {
        return (
            <View startAtTop={true}>
                <VStack>
                    <JumblemLogoSimple />
    
                    <SpectateGameHeader
                        playerOneId={updatedGame.playerOneId}
                        playerTwoId={updatedGame.playerTwoId}
                        playerOneTimeRemaining={playerOneTimeRemaining}
                        playerTwoTimeRemaining={playerTwoTimeRemaining}
                        playerTurnId={playerTurnId}
                        firstMoveMade={movesMade > 0}
                        gameOver={gameOver}
                        anchorTime={anchorTime}
                    />
    
                    <SpectateGameGrid
                        movesDict={movesDict}
                        winningWords={winningWords}
                        winningGridSpots={winningGridSpots}
                        lastMove={movesCopy[movesCopy.length - 1]}
                    />
                </VStack>
            </View>
        );
    } else {
        return (
            <PageNotFoundView/>
        );
    }

}
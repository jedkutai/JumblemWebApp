import { useEffect, useState } from "react";
import { GameModel, GridSpotModel, MoveModel, UserModel, WordModel } from "../../../Background/Models";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { GridSpot } from "../../../Background/Extends/GridSpot";
import GameOverRow from "./GameOverRow";
import { HSpacer, VSpacer, VStack } from "../../../ReactSwiftly";
import { CasualGameService } from "../../../Background/Service";

interface GameOverGridProps {
    user: UserModel;
    game: GameModel;
    movesDict: Record<string, MoveModel>;
    winningWords: WordModel[];
    winningGridSpots: string[];

}

export default function GameOverGrid({
    user,
    game,
    movesDict,
    winningWords,
    winningGridSpots,
}: GameOverGridProps) {
    const [finalGame, setFinalGame] = useState<GameModel | undefined>(undefined);
    const [grid] = useState<GridSpotModel[][]>(GridSpot.grid);

    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    // finalGame stuff to show the result (win loss draw ect)
    useEffect(() => {
        const fetchFinalGame = async () => {
            try {
                const fetchedGame = await CasualGameService.fetchFinalGame(game);
                setFinalGame(fetchedGame);
            } catch {

            }
        }

        fetchFinalGame();
    }, []);
    return (
        <VStack maxHeight={`${(Math.max(minDimension, upperBound) * 8 / dimensionDivider) + 200}px`}>

            <VStack
                spacing="0px"
                backgroundColor="rgb(255, 255, 255, 0.25)"
                width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                minHeight={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                cornerRadius="5px"
            >
                {grid.map((row, index) => (
                    <GameOverRow
                        key={index}
                        row={row}
                        movesDict={movesDict}
                        winningGridSpots={winningGridSpots}
                        blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                    />
                ))}
            </VStack>

            <VSpacer />

            {finalGame && finalGame.winner == "draw" && (
                <h1>Draw!</h1>
            )}
            {finalGame && finalGame.winner == "aborted" && (
                <h1>Game aborted!</h1>
            )}
            {finalGame && finalGame.winner == user.id && (
                <h1>You win!</h1>
            )}
            {finalGame && finalGame.winner != "draw" && finalGame.winner != "aborted" && finalGame.winner != user.id && (
                <h1>You lose!</h1>
            )}

        </VStack>

    );
}
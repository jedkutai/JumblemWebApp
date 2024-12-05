import { useEffect, useState } from "react";
import { GameModel, GridSpotModel, MoveModel, UserModel, WordModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { GridSpot } from "../../../../Background/Extends/GridSpot";
import PrivateGameOverRow from "./PrivateGameOverRow";
import { VStack } from "../../../../ReactSwiftly";
import { PrivateGameService } from "../../../../Background/Service";
import { ColoredWord } from "../../../Components";

interface PrivateGameOverGridProps {
    user: UserModel;
    game: GameModel;
    movesDict: Record<string, MoveModel>;
    winningWords: WordModel[];
    winningGridSpots: string[];

}

export default function PrivateGameOverGrid({
    user,
    game,
    movesDict,
    winningWords,
    winningGridSpots,
}: PrivateGameOverGridProps) {
    const [finalGame, setFinalGame] = useState<GameModel | undefined>(undefined);
    const [grid] = useState<GridSpotModel[][]>(GridSpot.grid);

    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    // finalGame stuff to show the result (win loss draw ect)
    useEffect(() => {
        const fetchFinalGame = async () => {
            try {
                const fetchedGame = await PrivateGameService.fetchFinalGame(game);
                setFinalGame(fetchedGame);
            } catch {

            }
        }

        fetchFinalGame();
    }, []);
    return (
        <VStack>
            <VStack maxHeight={`${(Math.max(minDimension, upperBound) * 8 / dimensionDivider) + 200}px`} spacing="10px">

                <VStack
                    spacing="0px"
                    backgroundColor="rgb(255, 255, 255, 0.25)"
                    width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                    minHeight={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                    cornerRadius="5px"
                >
                    {grid.map((row, index) => (
                        <PrivateGameOverRow
                            key={index}
                            row={row}
                            movesDict={movesDict}
                            winningGridSpots={winningGridSpots}
                            blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                        />
                    ))}
                </VStack>


                {finalGame && finalGame.winner == "draw" && (
                    <h2>Draw!</h2>
                )}
                {finalGame && finalGame.winner == "aborted" && (
                    <h2>Game aborted!</h2>
                )}
                {finalGame && finalGame.winner == user.id && (
                    <h2>You win!</h2>
                )}
                {finalGame && finalGame.winner != "draw" && finalGame.winner != "aborted" && finalGame.winner != user.id && (
                    <h2>You lose!</h2>
                )}


            </VStack>

            <VStack spacing="10px">
                {winningWords.map((word, index) => (
                    <ColoredWord key={index} word={word} />
                ))}
            </VStack>

        </VStack>

    );
}
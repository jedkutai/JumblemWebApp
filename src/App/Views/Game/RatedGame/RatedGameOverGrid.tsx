import { useEffect, useState } from "react";
import { GameModel, GridSpotModel, MoveModel, UserModel, WordModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { GridSpot } from "../../../../Background/Extends/GridSpot";
import RatedGameOverRow from "./RatedGameOverRow";
import { VStack } from "../../../../ReactSwiftly";
import { RatedGameService } from "../../../../Background/Service";
import { ColoredWord } from "../../../Components";

interface RatedGameOverGridProps {
    user: UserModel;
    game: GameModel;
    setGame: (game: GameModel) => void;
    movesDict: Record<string, MoveModel>;
    winningWords: WordModel[];
    winningGridSpots: string[];

}

export default function RatedGameOverGrid({
    user,
    game,
    setGame,
    movesDict,
    winningWords,
    winningGridSpots,

}: RatedGameOverGridProps) {
    
    const [grid] = useState<GridSpotModel[][]>(GridSpot.grid);

    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    // game stuff to show the result (win loss draw ect)
    useEffect(() => {
        const fetchFinalGame = async () => {
            try {
                const fetchedGame = await RatedGameService.fetchFinalGame(game);
                setGame(fetchedGame);
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
                        <RatedGameOverRow
                            key={index}
                            row={row}
                            movesDict={movesDict}
                            winningGridSpots={winningGridSpots}
                            blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                        />
                    ))}
                </VStack>


                {game && game.winner == "draw" && (
                    <h2>Draw!</h2>
                )}
                {game && game.winner == "aborted" && (
                    <h2>Game aborted!</h2>
                )}
                {game && game.winner == user.id && (
                    <h2>You win!</h2>
                )}
                {game && game.winner != "draw" && game.winner != "aborted" && game.winner != user.id && (
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
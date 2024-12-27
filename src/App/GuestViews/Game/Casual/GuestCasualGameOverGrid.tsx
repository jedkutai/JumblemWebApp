import { useState, useEffect } from "react";
import { GridSpot } from "../../../../Background/Extends/GridSpot";
import { UserModel, GameModel, MoveModel, WordModel, GridSpotModel } from "../../../../Background/Models";
import { GuestService } from "../../../../Background/Service";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { VStack } from "../../../../ReactSwiftly";
import { GuestColoredWord } from "../../../Components/GuestColoredWord";
import CasualGameOverRow from "../../../Views/Game/CasualGame/CasualGameOverRow";
import { Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";

interface GuestCasualGameOverGridProps {
    user: UserModel;
    game: GameModel;
    movesDict: Record<string, MoveModel>;
    winningWords: WordModel[];
    winningGridSpots: string[];

}

export default function GuestCasualGameOverGrid({
    user,
    game,
    movesDict,
    winningWords,
    winningGridSpots,
}: GuestCasualGameOverGridProps) {
    const [finalGame, setFinalGame] = useState<GameModel | undefined>(undefined);
    const [grid] = useState<GridSpotModel[][]>(GridSpot.grid);
    // const navigate = useNavigate();
    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    // finalGame stuff to show the result (win loss draw ect)
    useEffect(() => {
        const fetchFinalGame = async () => {
            try {
                const fetchedGame = await GuestService.fetchFinalGame(game);
                setFinalGame(fetchedGame);
            } catch {

            }
        }

        fetchFinalGame();
    }, []);
    return (
        <VStack>
            {/* <VStack maxHeight={`${(Math.max(minDimension, upperBound) * 8 / dimensionDivider) + 200}px`} spacing="10px"> */}
            <VStack spacing="10px">
                <VStack
                    spacing="0px"
                    backgroundColor="rgb(255, 255, 255, 0.25)"
                    width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                    minHeight={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                    cornerRadius="5px"
                >
                    {grid.map((row, index) => (
                        <CasualGameOverRow
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

                <Button variant="contained" color="error" onClick={() => window.location.reload()}>Leave</Button>

                <VStack spacing="10px">
                    {winningWords.map((word, index) => (
                        <GuestColoredWord key={index} word={word} />
                    ))}
                </VStack>
                
            </VStack>



        </VStack>

    );
}
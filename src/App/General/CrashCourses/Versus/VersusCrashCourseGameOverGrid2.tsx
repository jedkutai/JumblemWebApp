import { useState } from "react";
import { GridSpot } from "../../../../Background/Extends/GridSpot";
import { GridSpotModel, MoveModel, WordModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { Button } from "@mui/material";
import { HStack, VStack } from "../../../../ReactSwiftly";
import { ColoredWord } from "../../../Components";
import WordRarityBar from "../../../Components/WordRarityBar";
import CasualGameOverRow from "../../../Views/Game2/CasualGame2/CasualGameOverRow";
import { useNavigate } from "react-router-dom";

enum GameState {
    intro,
    howTo,
    active,
    draw,
    userWins,
    botWins
}

interface VersusCrashCourseGameOverGrid2 {
    movesDict: Record<string, MoveModel>;
    winningWords: WordModel[];
    winningGridSpots: string[];
    gameState: GameState;
    setGameState: (newState: GameState) => void;
}

export default function VersusCrashCourseGameOverGrid2({
    movesDict,
    winningWords,
    winningGridSpots,
    gameState,
    setGameState
}: VersusCrashCourseGameOverGrid2) {
    const [grid] = useState<GridSpotModel[][]>(GridSpot.grid);
    const navigate = useNavigate();
    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;

    // finalGame stuff to show the result (win loss draw ect)
    return (
        <VStack>
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

                <HStack>
                    <Button variant="contained" color="primary" onClick={() => navigate("/home")}>Continue</Button>

                    <Button onClick={() => setGameState(GameState.intro)}>
                        Replay
                    </Button>

                </HStack>

                {gameState == GameState.draw && (
                    <h2>Draw!</h2>
                )}
                {gameState == GameState.userWins && (
                    <h2>You win!</h2>
                )}
                {gameState == GameState.botWins && (
                    <h2>You lose!</h2>
                )}

                <VStack spacing="10px">
                    <WordRarityBar />
                    {winningWords.map((word, index) => (
                        <ColoredWord key={index} word={word} />
                    ))}
                </VStack>

            </VStack>



        </VStack>

    );
}
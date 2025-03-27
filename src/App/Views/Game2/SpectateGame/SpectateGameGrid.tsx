import { useState } from "react";
import { GridSpot } from "../../../../Background/Extends/GridSpot";
import { GameModel, GridSpotModel, MoveModel, UserModel, WordModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { HStack, VStack } from "../../../../ReactSwiftly";
import { ColoredWord } from "../../../Components";
import WordRarityBar from "../../../Components/WordRarityBar";
import SpectateGameRow from "./SpectateGameRow";
import SpectateGameLetterBank from "./SpectateGameLetterBank";

interface SpectateGameGridProps {
    passedUser: UserModel;
    game: GameModel;
    movesDict: Record<string, MoveModel>;
    winningWords: WordModel[];
    winningGridSpots: string[];
    lastMove: MoveModel | undefined;
}

export default function SpectateGameGrid({
    passedUser,
    game,
    movesDict,
    winningWords,
    winningGridSpots,
    lastMove
}: SpectateGameGridProps) {
    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const [grid] = useState<GridSpotModel[][]>(GridSpot.grid);




    if (passedUser.admin == true) {
        return (
            <VStack spacing="10px">
                <HStack width={`${(Math.max(minDimension, upperBound) * 8 / dimensionDivider) + 200}px`}>
                    <SpectateGameLetterBank
                        playerId={game.playerOneId}
                        playerTurnId={lastMove?.userId ?? ""}
                        letters={game.playerOneLetterBank}
                    />

                    <VStack
                        spacing="0px"
                        backgroundColor="rgb(255, 255, 255, 0.25)"
                        minWidth={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                        minHeight={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                        cornerRadius="5px"
                    >

                        {grid.map((row, index) => (
                            <SpectateGameRow
                                key={index}
                                row={row}
                                movesDict={movesDict}
                                winningGridSpots={winningGridSpots}
                                blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                                lastMove={lastMove}
                            />
                        ))}

                    </VStack>

                    <SpectateGameLetterBank
                        playerId={game.playerTwoId}
                        playerTurnId={lastMove?.userId ?? ""}
                        letters={game.playerTwoLetterBank}
                    />


                </HStack>

                {winningWords.length > 0 && (
                    <VStack spacing="10px">
                        <WordRarityBar />
                        {winningWords.map((word, index) => (
                            <ColoredWord key={index} word={word} />
                        ))}
                    </VStack>
                )}

            </VStack>
        );
    } else {
        return (
            <VStack spacing="10px">


                <VStack
                    spacing="0px"
                    backgroundColor="rgb(255, 255, 255, 0.25)"
                    width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                    minHeight={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}
                    cornerRadius="5px"
                >

                    {grid.map((row, index) => (
                        <SpectateGameRow
                            key={index}
                            row={row}
                            movesDict={movesDict}
                            winningGridSpots={winningGridSpots}
                            blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                            lastMove={lastMove}
                        />
                    ))}

                </VStack>




                {winningWords.length > 0 && (
                    <VStack spacing="10px">
                        <WordRarityBar />
                        {winningWords.map((word, index) => (
                            <ColoredWord key={index} word={word} />
                        ))}
                    </VStack>
                )}

            </VStack>
        );
    }
}

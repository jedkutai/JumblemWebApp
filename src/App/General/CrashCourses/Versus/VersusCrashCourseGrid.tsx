import { useEffect, useState } from "react";
import { GridSpot } from "../../../../Background/Extends/GridSpot";
import { GridSpotModel, MoveModel, UserModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { VStack } from "../../../../ReactSwiftly";
import CasualGameRow from "../../../Views/Game/CasualGame/CasualGameRow";
import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
import VersusCrashCourseLetterGenerator from "./VersusCrashCourseLetterGenerator";
import { Typography } from "@mui/material";

interface VersusCrashCourseGridProps {
    user: UserModel,
    wordCheckComplete: boolean;
    yourTurn: boolean;

    gameOver: boolean;
    setGameOver: (newBool: boolean) => void;

    movesDict: Record<string, MoveModel>;
    setMovesDict: (newDict: Record<string, MoveModel>) => void;

    moves: MoveModel[];
    setMoves: (newMoves: MoveModel[]) => void;
}

export default function VersusCrashCourseGrid({
    user,
    wordCheckComplete,
    yourTurn,
    // gameOver,
    // setGameOver,
    movesDict,
    // setMovesDict,
    moves,
    setMoves
}: VersusCrashCourseGridProps) {
    const { minDimension } = useWindowSize();
    const [grid] = useState<GridSpotModel[][]>(GridSpot.grid);
    const [letters, setLetters] = useState<string[]>([]);
    const [availableBlocks, setAvailableBlocks] = useState(["3,3"]);
    const [selectedBlock, setSelectedBlock] = useState("");
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;

    // useEffect(() => {
    //     const movesDictUpdate = Object.fromEntries(moves.map((move) => [move.coordinates, move]));
    //     setMovesDict(movesDictUpdate);
    // }, [moves])

    useEffect(() => {
        const newBlocks = GameFunctions.getAvailableBlocks(movesDict, availableBlocks)
        setAvailableBlocks(newBlocks);
    }, [movesDict])
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
                    <CasualGameRow
                        key={index}
                        row={row}
                        availableBlocks={availableBlocks}
                        wordCheckComplete={wordCheckComplete}
                        moves={movesDict}
                        selectedBlock={selectedBlock}
                        setSelectedBlock={setSelectedBlock}
                        yourTurn={yourTurn}
                        blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                        lastMove={moves[moves.length - 1]}
                    />
                ))}



            </VStack>
            <VersusCrashCourseLetterGenerator
                user={user}
                letters={letters}
                setLetters={setLetters}
                wordCheckComplete={wordCheckComplete}
                movesDict={movesDict}
                selectedBlock={selectedBlock}
                setSelectedBlock={setSelectedBlock}
                yourTurn={yourTurn}
                blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                moves={moves}
                setMoves={setMoves}
            />

            <VStack width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}>
                {moves.length == 0 && (
                    <Typography textAlign={"center"}>
                        Tap the black square then select one of the banked letters to start the game.
                    </Typography>
                )}

                {moves.length % 2 == 1 && (
                    <Typography textAlign={"center"}>
                        Waiting for opponent...
                    </Typography>
                )}
                {moves.length > 0 && moves.length % 2 != 1 && (
                    <Typography textAlign={"center"}>
                        Tap any black square then select one of the banked letters to make a move.
                    </Typography>
                )}

                <Typography textAlign={"center"}>
                    First player to make a 4-7 letter word in any direction wins.
                </Typography>
            </VStack>
        </VStack>
    );
}
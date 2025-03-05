import { useState, useEffect } from "react";
import { GridSpot } from "../../../../Background/Extends/GridSpot";
import { UserModel, GameModel, MoveModel, GridSpotModel } from "../../../../Background/Models";
import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { VStack } from "../../../../ReactSwiftly";
import PregameMessage from "../../../Components/PregameMessage";
import CasualGameRow2 from "../CasualGame2/CasualGameRow2";
import PrivateLetterGenerator2 from "./PrivateLetterGenerator2";
import { LinearProgress } from "@mui/material";

interface PrivateGameGrid2Props {
    user: UserModel;
    game: GameModel;

    // gameManager
    movesDict: Record<string, MoveModel>;
    yourTurn: boolean;
    movesCopy: MoveModel[];
    processComplete: boolean;
    movesMade: number;

    gameOver: boolean;
    wordCheckComplete: boolean;
    matchAbortedTimer: number;

    timeOffset: number;
}

export default function PrivateGameGrid2({
    user,
    game,
    movesDict,
    yourTurn,
    movesCopy,
    processComplete,
    gameOver,
    wordCheckComplete,
    matchAbortedTimer,
    movesMade,
    timeOffset
}: PrivateGameGrid2Props) {
    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const [grid] = useState<GridSpotModel[][]>(GridSpot.grid);
    const [letters, setLetters] = useState<string[]>(["A"]);
    const [canSelect, setCanSelect] = useState(true);
    const [availableBlocks, setAvailableBlocks] = useState(["3,3"]);
    const [selectedBlock, setSelectedBlock] = useState("");

    useEffect(() => {
        const newAvailableBlocks = GameFunctions.getAvailableBlocks(movesDict, availableBlocks);
        setAvailableBlocks(newAvailableBlocks);
    }, [movesDict]);

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
                    <CasualGameRow2
                        key={index}
                        row={row}
                        availableBlocks={availableBlocks}
                        wordCheckComplete={wordCheckComplete}
                        moves={movesDict}
                        selectedBlock={selectedBlock}
                        setSelectedBlock={setSelectedBlock}
                        processComplete={processComplete}
                        yourTurn={yourTurn}
                        blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                        lastMove={movesCopy[movesCopy.length - 1]}
                    />
                ))}

            </VStack>

            <PrivateLetterGenerator2
                user={user}
                game={game}
                letters={letters}
                setLetters={setLetters}
                canSelect={canSelect}
                setCanSelect={setCanSelect}
                wordCheckComplete={wordCheckComplete}
                selectedBlock={selectedBlock}
                setSelectedBlock={setSelectedBlock}
                yourTurn={yourTurn}
                movesMade={movesMade}
                timeOffset={timeOffset}
            />
            
            {!processComplete && (
                <LinearProgress color="inherit" sx={{ width: `${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px` }} />
            )}


            {(!gameOver && movesCopy.length == 0 && matchAbortedTimer > 10) && (
                <PregameMessage />
            )}
            {(!gameOver && movesCopy.length == 0 && matchAbortedTimer <= 10) && (
                <p>{yourTurn ? `Make first move in ${Math.max(matchAbortedTimer, 0)}...` : `Auto-abort in ${Math.max(matchAbortedTimer, 0)}...`}</p>
            )}
        </VStack>
    );
}
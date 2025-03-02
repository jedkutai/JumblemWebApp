import { useEffect, useState } from "react";
import { GridSpot } from "../../../../Background/Extends/GridSpot";
import { GameModel, GridSpotModel, MoveModel, UserModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { VStack } from "../../../../ReactSwiftly";
import PregameMessage from "../../../Components/PregameMessage";
import CasualGameRow2 from "./CasualGameRow2";
import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
import CasualLetterGenerator2 from "./CasualLetterGenerator2";
import { LinearProgress } from "@mui/material";


interface CasualGameGrid2Props {
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
}

export default function CasualGameGrid2({
    user,
    game,
    movesDict,
    yourTurn,
    movesCopy,
    processComplete,
    gameOver,
    wordCheckComplete,
    matchAbortedTimer,
    movesMade
}: CasualGameGrid2Props) {
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
                        processComplete={processComplete}
                        selectedBlock={selectedBlock}
                        setSelectedBlock={setSelectedBlock}
                        yourTurn={yourTurn}
                        blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                        lastMove={movesCopy[movesCopy.length - 1]}
                    />
                ))}

            </VStack>

            <CasualLetterGenerator2
                user={user}
                game={game}
                letters={letters}
                setLetters={setLetters}
                canSelect={canSelect}
                setCanSelect={setCanSelect}
                processComplete={processComplete}
                wordCheckComplete={wordCheckComplete}
                selectedBlock={selectedBlock}
                setSelectedBlock={setSelectedBlock}
                yourTurn={yourTurn}
                movesMade={movesMade}
            />

            
            {!processComplete && (
                <LinearProgress color="inherit" sx={{width: `${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px` }} />
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
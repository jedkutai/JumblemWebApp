import { useState, useEffect } from "react";
import { GridSpot } from "../../../../Background/Extends/GridSpot";
import { UserModel, GameModel, MoveModel, GridSpotModel } from "../../../../Background/Models";
import { GameFunctions } from "../../../../Background/Utils/GameFunctions";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { VStack } from "../../../../ReactSwiftly";
import CasualGameRow from "../../../Views/Game/CasualGame/CasualGameRow";
import CasualLetterGenerator from "../../../Views/Game/CasualGame/CasualLetterGenerator";
import PregameMessage from "../../../Components/PregameMessage";

interface GuestCasualGameGridProps {
    user: UserModel;
    game: GameModel;
    gameOver: boolean;
    wordCheckComplete: boolean;
    matchAbortedTime: number;
    movesDict: Record<string, MoveModel>;
    yourTurn: boolean;
    setYourTurn: (turn: boolean) => void;
    lastMove: MoveModel | undefined;
    movesCopy: MoveModel[];
}

export default function GuestCasualGameGrid({
    user,
    game,
    wordCheckComplete,
    matchAbortedTime,
    movesDict,
    yourTurn,
    setYourTurn,
    lastMove,
}: GuestCasualGameGridProps) {
    const { minDimension } = useWindowSize();
    const [grid] = useState<GridSpotModel[][]>(GridSpot.grid);
    const [letters, setLetters] = useState<string[]>([]);
    const [availableBlocks, setAvailableBlocks] = useState(["3,3"]);
    const [selectedBlock, setSelectedBlock] = useState("");
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
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
                        lastMove={lastMove}
                    />
                ))}

            </VStack>

            <CasualLetterGenerator
                user={user}
                game={game}
                letters={letters}
                setLetters={setLetters}
                wordCheckComplete={wordCheckComplete}
                moves={movesDict}
                selectedBlock={selectedBlock}
                setSelectedBlock={setSelectedBlock}
                yourTurn={yourTurn}
                setYourTurn={setYourTurn}
                blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
            />

            {lastMove == undefined && matchAbortedTime > 10 && (
                <PregameMessage />
            )}
            {lastMove == undefined && matchAbortedTime <= 10 && (
                <p>{yourTurn ? `Make first move in ${Math.max(matchAbortedTime, 0)}...` : `Auto-abort in ${Math.max(matchAbortedTime, 0)}...`}</p>
            )}
        </VStack>
    );


}
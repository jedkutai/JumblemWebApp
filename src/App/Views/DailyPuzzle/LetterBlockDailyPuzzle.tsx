import { GridSpotModel } from "../../../Background/Models";
import { WhiteLetterBlock } from "../../Components";
import { DailyPuzzleClickableBlock } from "./DailyPuzzleClickableBlock";

interface LetterBlockDailyPuzzleProps {
    gridSpot: GridSpotModel;
    blockDimension: number;
    selectedGridSpot: string;
    setSelectedGridSpot: (value: string) => void;
    goldenGrids: string[];
}

export default function LetterBlockDailyPuzzle({
    gridSpot,
    blockDimension,
    selectedGridSpot,
    setSelectedGridSpot,
    goldenGrids
}: LetterBlockDailyPuzzleProps) {

    return (
        <>
            {gridSpot.letter !== "" && (
                <WhiteLetterBlock letter={gridSpot.letter} blockDimension={blockDimension} highlight={goldenGrids.includes(gridSpot.id)} />
            )}
            {gridSpot.letter === "" && (
                // <EmptyBlock blockDimension={blockDimension} />
                <DailyPuzzleClickableBlock
                    blockDimension={blockDimension}
                    blockId={gridSpot.id}
                    selectedGridSpot={selectedGridSpot}
                    setSelectedGridSpot={setSelectedGridSpot}
                />
            )}
        </>
    );
}
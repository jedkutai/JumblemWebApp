interface DailyPuzzleClickableBlockProps {
    blockDimension: number;
    blockId: string;
    selectedGridSpot: string;
    setSelectedGridSpot: (selectedBlock: string) => void;
}

export function DailyPuzzleClickableBlock({blockDimension, setSelectedGridSpot, selectedGridSpot, blockId}: DailyPuzzleClickableBlockProps) {
    const style = {
        width: `${blockDimension}px`,
        height: `${blockDimension}px`,
        margin: `${blockDimension / 20}px`,
        padding: "0px",
        borderRadius: "5px",
        border: selectedGridSpot == blockId ? "3px solid white" : "3px solid transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))",
        cursor: "pointer", // Makes it clear that it's a clickable button
        outline: "none", // Removes the focus outline
    } as React.CSSProperties;

    return (
        <button style={style} onClick={() => setSelectedGridSpot(selectedGridSpot == blockId ? "" : blockId)}></button>
    );
}
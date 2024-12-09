interface DailyPuzzleClickableWhiteLetterBlockProps {
    letter: string;
    blockDimension: number;
    setSelectedLetter: (letter: string) => void;
}

export default function DailyPuzzleClickableWhiteLetterBlock({ blockDimension, setSelectedLetter, letter }: DailyPuzzleClickableWhiteLetterBlockProps) {
    const style = {
        width: `${blockDimension}px`,
        height: `${blockDimension}px`,
        margin: `${blockDimension / 20}px`,
        padding: "0px",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",   // Optional: Border style
        fontSize: `${blockDimension / 2}px`, // Dynamically scale font size
        fontWeight: "bold",
        color: "black",
        cursor: "pointer", // Makes it clear that it's a clickable button
        outline: "none", // Removes the focus outline
    };

    return (
        <button style={style} onClick={() => setSelectedLetter(letter)}>{letter.toUpperCase()}</button>
    );
}


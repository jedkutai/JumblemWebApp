
interface WhiteLetterBlockProps {
    letter: string;
    blockDimension: number;
    highlight?: boolean;
}

export function WhiteLetterBlock({letter, blockDimension, highlight}: WhiteLetterBlockProps) {
    const style = {
        width: `${blockDimension}px`,
        height: `${blockDimension}px`,
        margin: `${blockDimension / 20}px`,
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",   // Optional: Border style
        fontSize: `${blockDimension / 2}px`, // Dynamically scale font size
        fontWeight: "bold",
        color: highlight ? "rgba(255,149,0,255)" : "black",
    };

    return (
        <div style={style}>{letter}</div>
    );
}
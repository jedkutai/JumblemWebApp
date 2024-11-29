
interface WhiteLetterBlockProps {
    letter: string;
    blockDimension: number;
}

export default function WhiteLetterBlock({letter, blockDimension}: WhiteLetterBlockProps) {
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
        color: "black",
    };

    return (
        <div style={style}>{letter}</div>
    );
}
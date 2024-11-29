
interface YellowLetterBlockProps {
    letter: string;
    blockDimension: number;
}

export default function YellowLetterBlock({letter, blockDimension}: YellowLetterBlockProps) {

    const style = {
        width: `${blockDimension}px`,
        height: `${blockDimension}px`,
        margin: `${blockDimension / 20}px`,
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(254,247,209,255)",
        fontSize: `${blockDimension / 2}px`, // Dynamically scale font size
        fontWeight: "bold",
        color: "black",
    };

    return (
        <div style={style}>{letter}</div>
    );
}
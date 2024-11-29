interface DimLetterBlockProps {
    letter: string;
    blockDimension: number;
}

export default function DimLetterBlock({letter, blockDimension}: DimLetterBlockProps) {
    const style = {
        width: `${blockDimension}px`,
        height: `${blockDimension}px`,
        margin: `${blockDimension / 20}px`,
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0.5)",
        fontSize: `${blockDimension / 2}px`, // Dynamically scale font size
        fontWeight: "bold",
        color: "black",
    };

    return (
        <div style={style}>{letter.toUpperCase()}</div>
    );
}
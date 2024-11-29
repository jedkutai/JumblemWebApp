
interface SquareProps {
    dimension: number; // Size of the square (both width and height)
    letter: string;    // Letter to display inside the square
    color: string;
}

export function Square({ dimension, letter, color }: SquareProps) {
    const style = {
        width: `${dimension}px`,
        height: `${dimension}px`,
        margin: `${dimension / 20}px`,
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color,   // Optional: Border style
        fontSize: `${dimension / 2}px`, // Dynamically scale font size
        fontWeight: "bold",
        color: "black",
    };

    return <div style={style}>{letter}</div>;
}
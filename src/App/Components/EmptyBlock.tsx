
interface EmptyBlockProps {
    blockDimension: number
}

export function EmptyBlock({blockDimension}: EmptyBlockProps) {

    const style = {
        width: `${blockDimension}px`,
        height: `${blockDimension}px`,
        margin: `${blockDimension / 20}px`,
        padding: "0px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))",
        borderRadius: "5px",
        boxSizing: "border-box" as const, // Ensures border is included in the dimensions
        border: "3px solid transparent", // Add the border here
    };

    return (
        <div style={style}></div>
    );
}

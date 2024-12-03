
interface EmptySelectedBlockProps {
    blockDimension: number;
    setSelectedBlock: (selectedBlock: string) => void;
}

export function EmptySelectedBlock({blockDimension, setSelectedBlock}: EmptySelectedBlockProps) {
    // const style = {
    //     width: `${blockDimension}px`,
    //     height: `${blockDimension}px`,
    //     margin: `${blockDimension / 20}px`,
    //     padding: "0px",
    //     borderRadius: "5px",
    //     border: "2px solid white",
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     background:"linear-gradient(to bottom right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))",
    // };

    const style = {
        width: `${blockDimension}px`,
        height: `${blockDimension}px`,
        margin: `${blockDimension / 20}px`,
        padding: "0px",
        borderRadius: "5px",
        border: "3px solid white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))",
        cursor: "pointer", // Makes it clear that it's a clickable button
        outline: "none", // Removes the focus outline
    } as React.CSSProperties;

    return (
        <button style={style} onClick={() => setSelectedBlock("")}></button>
    );
}
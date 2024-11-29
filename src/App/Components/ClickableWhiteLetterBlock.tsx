interface ClickableWhiteLetterBlockProps {
    letter: string;
    blockDimension: number;
    action: () => void;
}

export default function ClickableWhiteLetterBlock({
    letter,
    blockDimension,
    action
}: ClickableWhiteLetterBlockProps) {
    const style = {
        width: `${blockDimension}px`,
        height: `${blockDimension}px`,
        margin: `${blockDimension / 20}px`,
        padding: "0px",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        cursor: "pointer", // Makes it clear that it's a clickable button
        outline: "none", // Removes the focus outline

        fontSize: `${blockDimension / 2}px`, // Dynamically scale font size
        fontWeight: "bold",
        color: "black",
    } as React.CSSProperties;

    return (
        <button style={style} onClick={() => action()}>{letter.toUpperCase()}</button>
    );
}
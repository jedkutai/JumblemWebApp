
interface ViewProps {
    children: React.ReactNode;
}

export function View({children}: ViewProps) {
    const style = {
        margin: 0,
        padding: "1rem 0px",
        display: "flex", // Enables Flexbox
        justifyContent: "center", // Centers content horizontally
        alignItems: "center", // Centers content vertically
        minHeight: "100vh", // Full height of the viewport
        width: "100vw", // Full width of the viewport
        boxSizing: "border-box" as const, // Includes padding and borders in width/height calculations
        overflow: "auto", // Ensures no scrollbars appear if content overflows
    };
    return (
        <div style={style}>
            {children}
        </div>
    );

}
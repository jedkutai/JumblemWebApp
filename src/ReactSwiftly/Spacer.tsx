
/**
 * A flexible spacer that grows to fill horizontal available space.
 */
export function HSpacer() {
    const style = {
        flexGrow: 1,
        width: "100vh"
    };

    return <div style={style}></div>;
}



/**
 * A flexible spacer that grows to fill vertical available space.
 */
export function VSpacer() {
    const style = {
        flexGrow: 1, // Allows the spacer to take up remaining space
        height: "100vh"
    };

    return <div style={style}></div>;
}


interface ZStackProps {
    /**
     * The content to be displayed inside the ZStack.
     * All children will stack on top of each other.
     * You need to wrap each child element with <ZItem></ZItem>
     */
    children: React.ReactNode;

    /**
     * Specifies amount of padding around the view
     */
    padding?: string;
}

export function ZStack({children}: ZStackProps) {
    const style = {
        position: "relative" as const,
        width: "100%",
        height: "100%",
    };

    return (
        <div style={style}>{children}</div>
    );
}

interface ZItemProps {
    /**
     * The content to be displayed inside the ZStack.
     */
    children: React.ReactNode;
}

export function ZItem({children, padding}: ZStackProps) {
    const style = {
        position: "absolute" as const,
        width: "100%",
        height: "100%",
        display: "flex", // Flexbox for centering
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically

        padding: padding || "0px",
        boxSizing: "border-box" as React.CSSProperties["boxSizing"],
    };

    return (
        <div style={style}>{children}</div>
    );
}
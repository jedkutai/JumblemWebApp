interface FrameProps {
    /**
     * Specifies the exact width of the frame.
     */
    width?: string;

    /**
     * Specifies the exact height of the frame.
     */
    height?: string;

    /**
     * Specifies the maximum allowable width of the frame.
     * Ignored if `width` is provided.
     */
    maxWidth?: string;

    /**
     * Specifies the maximum allowable height of the frame.
     * Ignored if `height` is provided.
     */
    maxHeight?: string;

    /**
     * Specifies the minimum allowable width of the frame.
     */
    minWidth?: string;

    /**
     * Specifies the minimum allowable height of the frame.
     */
    minHeight?: string;

    /**
     * Specifies amount of padding around the frame
     */
    padding?: string;

    /**
     * Specifies the background color of the frame.
     * Accepts any valid CSS color value (e.g., "blue", "#FF5733", "rgb(255, 0, 0)"). 
     */
    backgroundColor?: string;

    /**
     * Specifies the gradient color of the frame.
     * Accepts any valid CSS color value (e.g., "blue", "#FF5733", "rgb(255, 0, 0)"). 
     */
    gradient?: string;

    /**
     * Specifies the border of the frame.
     * Example "1px solid black"
     */
    border?: string;

    /**
     * Specifies the corner radius of the frame.
     */
    cornerRadius?: string;

    /**
     * The children to render inside the frame.
     */
    children?: React.ReactNode;
}

/**
 * Sets the size of the container. Also allows you to style it directly
 */
export function Frame({width, height, maxWidth, maxHeight, minWidth, minHeight, padding, backgroundColor, border, cornerRadius, gradient, children}: FrameProps) {
    if (process.env.NODE_ENV !== "production") {
        if (width && maxWidth) {
            console.warn("You cannot specify both `width` and `maxWidth`. Only `width` will be used.");
        }
        if (height && maxHeight) {
            console.warn("You cannot specify both `height` and `maxHeight`. Only `height` will be used.");
        }
        if (width && minWidth) {
            console.warn("You cannot specify both `width` and `minWidth`. Only `width` will be used.");
        }
        if (height && minHeight) {
            console.warn("You cannot specify both `height` and `minHeight`. Only `height` will be used.");
        }
    }

    const style = {
        width: width || "100%",
        height: height || "100%",
        maxWidth: width ? "100%" : maxWidth || "100%",
        maxHeight: height ? "100%" : maxHeight || "100%",
        minWidth: width ? "auto" : minWidth || "auto",
        minHeight: height ? "auto" : minHeight || "auto",
        padding: padding || "0px",
        display: "flex", // Enables Flexbox
        justifyContent: "center", // Centers content horizontally
        alignItems: "center", // Centers content vertically
        boxSizing: "border-box" as React.CSSProperties["boxSizing"],
        backgroundColor: backgroundColor || "transparent",
        border: border || "transparent",
        borderRadius: cornerRadius || "0px",
        backgroundImage: gradient || "none",
        
    };

    return <div style={style}>{children}</div>;
}
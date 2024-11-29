/**
 * Props for the Text component.
 */
interface TextProps {
    /** The text content to display. */
    text: string
    
    /** 
     * Optional. The color of the text. 
     * Accepts any valid CSS color value (e.g., "blue", "#FF5733", "rgb(255, 0, 0)"). 
     * Default is "black".
     */
    color?: string;

    /** Optional. The size of the text (e.g., "16px", "1em"). Default is "16px". */
    fontSize?: string

    /**
     * Specifies amount of padding around the view
     */
    padding?: string;

    /** 
     * Optional. The weight of the text. 
     * Can be a valid CSS font weight (e.g., "normal", "bold", "lighter", or a numeric value). 
     * Default is "normal".
     */
    fontWeight?: "normal" | "bold" | "bolder" | "lighter" | number;
    
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
     * Specifies the background color of the frame.
     * Accepts any valid CSS color value (e.g., "blue", "#FF5733", "rgb(255, 0, 0)"). 
     */
    backgroundColor?: string;

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
     * Optional. Lines of text that should be should before truncation. 
     */
    lineLimit?: boolean;
}

export function Text({text, color, fontSize, fontWeight, padding, lineLimit, width, height, maxWidth, maxHeight, minWidth, minHeight, backgroundColor, border, cornerRadius,}: TextProps) {
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
        margin: 0,
        color: color || "black",
        fontWeight: fontWeight || "normal",
        fontSize: fontSize || "16px",

        padding: padding || "0px",
        display: "flex", // Enables Flexbox
        justifyContent: "center", // Centers content horizontally
        alignItems: "center", // Centers content vertically
        boxSizing: "border-box" as React.CSSProperties["boxSizing"],
        whiteSpace: lineLimit ? "nowrap" : "wrap",
        textOverflow: "ellipsis",

        width: width || "auto",
        height: height || "auto",
        maxWidth: width ? "auto" : maxWidth || "auto",
        maxHeight: height ? "100%" : maxHeight || "auto",
        minWidth: width ? "auto" : minWidth || "auto",
        minHeight: height ? "auto" : minHeight || "auto",
        backgroundColor: backgroundColor || "transparent",
        border: border || "transparent",
        borderRadius: cornerRadius || "0px"
        
    };

    return(
        <div style={style}>{text}</div>
    );
}

/**
 * Props for the HStack component.
 */
interface HStackProps {
    /** 
     * The content to be displayed inside the horizontal stack. 
     * Typically multiple child elements or components.
     */
    children: React.ReactNode;

    /** 
     * The horizontal alignment of the child elements within the stack. 
     * Acceptable values: 
     * - `"flex-start"`: Align items to the start of the container.
     * - `"center"`: Center items horizontally.
     * - `"flex-end"`: Align items to the end of the container.
     * - `"space-between"`: Distribute items with equal space between them.
     * - `"space-around"`: Distribute items with equal space around them.
     * Default is `"center"`.
     */
    alignment?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";

    /** 
     * The spacing between child elements within the stack. 
     * Accepts any valid CSS size value (e.g., `"10px"`, `"1em"`, `"2rem"`).
     * Default is `"10px"`.
     */
    spacing?: string;

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
     * Specifies amount of padding around the view
     */
    padding?: string;
}

/**
 * A horizontal stack component that arranges its children horizontally with optional spacing and alignment.
 * 
 * @param children - The content to be displayed within the stack.
 * @param alignment - Controls the horizontal alignment of the children. Default is `"center"`.
 * @param spacing - Specifies the space between child elements. Default is `"10px"`.
 * 
 * @returns A `div` element with children arranged in a horizontal stack.
 */
export function HStack({ children, alignment, spacing, padding, width, height, maxWidth, maxHeight, minWidth, minHeight, backgroundColor, border, cornerRadius,}: HStackProps) {
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
        display: "flex",
        justifyContent: alignment || "center",
        alignItems: "center",
        gap: spacing || "10px",
        // width: "100%",

        padding: padding || "0px",
        boxSizing: "border-box" as React.CSSProperties["boxSizing"],

        width: width || "100%",
        height: height || "auto",
        maxWidth: width ? "100%" : maxWidth || "100%",
        maxHeight: height ? "auto" : maxHeight || "auto",
        minWidth: width ? "auto" : minWidth || "auto",
        minHeight: height ? "auto" : minHeight || "auto",
        backgroundColor: backgroundColor || "transparent",
        border: border || "transparent",
        borderRadius: cornerRadius || "0px"
    };

    return <div style={style}>{children}</div>;
}
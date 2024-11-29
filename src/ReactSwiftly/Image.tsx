
interface ImageProps {
    image: string

    /**
     * Specifies amount of padding around the view
     */
    padding?: string;

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
     * Specifies how the image should scale to fit its container.
     * Default is `"cover"`.
     */
    objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
}

export function Image({image, padding, width, height, maxHeight, minHeight, minWidth, maxWidth, backgroundColor, border, cornerRadius, objectFit}: ImageProps) {
    const style = {
        margin: 0,
        padding: padding || "0px",
        width: width || "auto",
        height: height || "auto",
        maxWidth: width ? "auto" : maxWidth || "auto",
        maxHeight: height ? "auto" : maxHeight || "auto",
        minWidth: width ? "auto" : minWidth || "auto",
        minHeight: height ? "auto" : minHeight || "auto",
        backgroundColor: backgroundColor || "transparent",
        border: border || "transparent",
        borderRadius: cornerRadius || "0px",
        objectFit: objectFit || "contain",
    }

    return(
        <img src={image} style={style}/>
    );

}
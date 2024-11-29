

interface ProgressViewProps {

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
    dimension?: string;

    border?: string;

    borderTop?: string;

    borderRadius?: string;

    animation?: string;
}

export function ProgressView({border, borderTop, borderRadius, dimension, animation}: ProgressViewProps) {
    const style = {
        border: border || "16px solid #f3f3f3",
        borderTop: borderTop || "16px solid #3498db",
        borderRadius: borderRadius || "16px solid #3498db",
        width: dimension || "50px",
        height: dimension || "50px",
        animation: animation || "spin 2s linear infinite",
        // border: 16px solid #f3f3f3; /* Light grey */
        // border-top: 16px solid #3498db; /* Blue */
        // border-radius: 50%;
        // width: 120px;
        // height: 120px;
        // animation: spin 2s linear infinite;
    };

    return (
        <div style={style}></div>
    );

}
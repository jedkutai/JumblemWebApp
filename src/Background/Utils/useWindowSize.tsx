import { useState, useEffect } from "react";

export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
        minDimension: Math.min(window.innerWidth, window.innerHeight),
        maxDimension: Math.max(window.innerWidth, window.innerHeight)
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
                minDimension: Math.min(window.innerWidth, window.innerHeight),
                maxDimension: Math.max(window.innerWidth, window.innerHeight)
            });
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
}

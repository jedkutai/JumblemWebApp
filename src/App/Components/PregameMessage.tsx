import { useEffect, useState } from "react";


export default function PregameMessage() {
    const [messageShown, setMessageShown] = useState("4 to 7 letters");

    useEffect(() => {
        const timeout = setTimeout(async () => {
            setMessageShown("Any direction");
        }, 1000 * 3);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <h2>
            {messageShown.toUpperCase()}
        </h2>
    );
}
import { useEffect, useState } from "react";


export default function PregameMessage() {
    const [messageShown, setMessageShown] = useState("Select a black square");

    useEffect(() => {
        const timeout = setTimeout(async () => {
            setMessageShown("Then select a letter");
        }, 1000 * 3);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <h2>
            {messageShown.toUpperCase()}
        </h2>
    );
}
import { useEffect, useState } from "react";

enum MessageShown {
    selectSquare,
    selectLetter,
}

export default function PrepuzzleMessage() {
    const [messageShown, setMessageShown] = useState(MessageShown.selectSquare);

    useEffect(() => {
        changeMessage();
    }, []);

    useEffect(() => {
        changeMessage();
    }, [messageShown]);

    function changeMessage() {
        const timeout = setTimeout(async () => {
            switch (messageShown) {
                case MessageShown.selectSquare:
                    setMessageShown(MessageShown.selectLetter);
                    break;
                case MessageShown.selectLetter:
                    setMessageShown(MessageShown.selectSquare);
                    break;
            }
        }, 1000 * 3);

        return () => clearTimeout(timeout);
    }

    return (
        <h2>
            {messageShown === MessageShown.selectSquare ? "Select a black square" : "Then select a letter"}
        </h2>
    );
}
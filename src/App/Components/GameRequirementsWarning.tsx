import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

enum MessageShown {
    findingMatch,
    fourToSevenLetterWords,
    anyDirection,
    firstWordWins,
    expandingSearch,
}

export default function GameRequirementsWarning() {

    const [messageShown, setMessageShown] = useState<MessageShown>(MessageShown.findingMatch);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            switch (messageShown) {
                case MessageShown.findingMatch:
                    setMessageShown(MessageShown.fourToSevenLetterWords);
                    break;
                case MessageShown.fourToSevenLetterWords:
                    setMessageShown(MessageShown.anyDirection);
                    break;
                case MessageShown.anyDirection:
                    setMessageShown(MessageShown.firstWordWins);
                    break;
                case MessageShown.firstWordWins:
                    setMessageShown(MessageShown.expandingSearch);
                    break;
                case MessageShown.expandingSearch:
                    setMessageShown(MessageShown.fourToSevenLetterWords);
                    break;

            }
        }, 1000 * 4);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            switch (messageShown) {
                case MessageShown.findingMatch:
                    setMessageShown(MessageShown.fourToSevenLetterWords);
                    break;
                case MessageShown.fourToSevenLetterWords:
                    setMessageShown(MessageShown.anyDirection);
                    break;
                case MessageShown.anyDirection:
                    setMessageShown(MessageShown.firstWordWins);
                    break;
                case MessageShown.firstWordWins:
                    setMessageShown(MessageShown.expandingSearch);
                    break;
                case MessageShown.expandingSearch:
                    setMessageShown(MessageShown.fourToSevenLetterWords);
                    break;

            }
        }, 1000 * 4);

        return () => clearTimeout(timeout);
    }, [messageShown]);

    return (
        <>
            {messageShown === MessageShown.findingMatch && (
                <Typography>
                    Finding match...
                </Typography>
            )}
            {messageShown === MessageShown.fourToSevenLetterWords && (
                <Typography>
                    Only 4 to 7 letter words count.
                </Typography>
            )}
            {messageShown === MessageShown.anyDirection && (
                <Typography>
                    Words can be written in any direction.
                </Typography>
            )}
            {messageShown === MessageShown.firstWordWins && (
                <Typography>
                    First word wins.
                </Typography>
            )}
            {messageShown === MessageShown.expandingSearch && (
                <Typography>
                    Expanding search...
                </Typography>
            )}
        </>
    );
}
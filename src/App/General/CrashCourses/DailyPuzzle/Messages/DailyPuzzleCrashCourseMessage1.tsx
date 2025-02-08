import { useEffect, useState } from "react";
import { VStack } from "../../../../../ReactSwiftly";
import { Typography } from "@mui/material";

enum Message {
    one,
    two,
    three
}

export default function DailyPuzzleCrashCourseMessage1() {
    const [message, setMessage] = useState<Message>(Message.one);
    const duration: number = 4;

    useEffect(() => {
        changeMessage();
    }, []);

    useEffect(() => {
        changeMessage();
    }, [message]);


    function changeMessage() {
        const timeout = setTimeout(async () => {
            switch (message) {
                case Message.one:
                    setMessage(Message.two);
                    break;
                case Message.two:
                    setMessage(Message.three);
                    break;
                case Message.three:
                    setMessage(Message.one);
                    break;

            }
        }, 1000 * duration);

        return () => clearTimeout(timeout);
    }

    return (
        <VStack height="30px">
            <div style={{ height: "100%" }}></div>
            {message == Message.one && (
                <Typography textAlign={"center"}>
                    {"Select an empty square adjacent to a letter (above, below, left, or right)."}
                </Typography>
            )}
            {message == Message.two && (
                <Typography textAlign={"center"}>
                    {"Then tap one of the banked letters to guess a word."}
                </Typography>
            )}
            {message == Message.three && (
                <Typography textAlign={"center"}>
                    {"Only 4-7 letters words are valid."}
                </Typography>
            )}

        </VStack>
    );
}
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { VStack } from "../../../../../ReactSwiftly";

enum Message {
    one,
    two

}

export default function DailyPuzzleCrashCourseMessage2() {
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
                    {"Tap the score button to view all the words you've found so far."}
                </Typography>
            )}
            {message == Message.two && (
                <Typography textAlign={"center"}>
                    {"When you run out of lives or give up, tap Submit."}
                </Typography>
            )}

        </VStack>
    );
}
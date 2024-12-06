import { Button } from "@mui/material";
import { useEffect, useState } from "react";

interface RematchButtonProps {
    flash: boolean;
    setView: () => void;
}

export default function RematchButton({ flash, setView }: RematchButtonProps) {
    const [tick, setTick] = useState(false);

    useEffect(() => {
        setTick(!tick);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            setTick(!tick);
        }, 1000 * 0.4);

        return () => clearTimeout(timeout);
    }, [tick]);

    return (
        <Button
            variant="text"
            color={flash ? tick ? "primary" : "error" : "primary"}
            onClick={setView}
        >
            Rematch
        </Button>
    )


}
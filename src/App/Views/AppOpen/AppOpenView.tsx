import { View, VStack } from "../../../ReactSwiftly";
import { Button } from "@mui/material";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { useNavigate } from "react-router-dom";
import { GuestService } from "../../../Background/Service";
import { useEffect, useState } from "react";


export default function AppOpenView() {
    const [showRed, setShowRed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (showRed) {
            setTimeout(() => {
                setShowRed(false);
            }, 1000 * 0.5);
        }
    }, [showRed]);
    
    async function continueAsGuest() {
        try {
            await GuestService.anonymousAccountCreation();
            navigate("/home");
        } catch {
            // navigate("/");
            setShowRed(true);
        }
        
    }

    return (
        <View>
            <VStack>
                <JumblemLogoSimple/>

                <Button onClick={() => navigate("/login")}>
                    LOGIN
                </Button>

                <Button onClick={() => navigate("/createaccount")}>
                    CREATE ACCOUNT
                </Button>

                <Button onClick={continueAsGuest} color={showRed ? "error" : "primary"}>
                    CONTINUE AS GUEST
                </Button>
            </VStack>
        </View>
    );
}
import { View, VStack } from "../../../ReactSwiftly";
import { Button, Typography } from "@mui/material";
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

    const style = {
        button: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(227, 218, 195)",
            color: "black",
            fontWeight: 600,
        },
        
    }

    return (
        <View>
            <VStack>
                <JumblemLogoSimple />

                <div style={{height: "40px"}}></div>
                <Button variant="contained" style={style.button} onClick={() => navigate("/login")}>
                    LOGIN
                </Button>

                <Button variant="contained" style={style.button} onClick={() => navigate("/createaccount")}>
                    CREATE ACCOUNT
                </Button>

                <Typography>- OR -</Typography>

                <Button variant="contained" style={style.button} onClick={continueAsGuest} color={showRed ? "error" : "primary"}>
                    CONTINUE AS GUEST
                </Button>
            </VStack>
        </View>
    );
}
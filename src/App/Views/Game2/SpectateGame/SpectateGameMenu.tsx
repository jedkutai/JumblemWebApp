import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { Box, Typography, TextField, Button } from "@mui/material";
import { View, VStack } from "../../../../ReactSwiftly";
import JumblemLogoSimple from "../../../Components/JumblemLogoSimple";

export default function SpectateGameMenu() {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const { minDimension } = useWindowSize();

    const styles = {
        textField: {
            marginBottom: "10px",
            width: "100%",
        },
        buttonContainer: {
            display: "flex",
            flexDirection: "row" as const,
            justifyContent: "space-between",
        },
        button: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(227, 218, 195)",
            color: "black",
            fontWeight: 600,
        },
        logo: {
            maxWidth: `${Math.min(minDimension / 3, 300)}px`,
            maxHeight: `${Math.min(minDimension / 3, 200)}px`,
            marginBottom: "20px",
        },
        section: {
            backgroundImage:
                "linear-gradient(to bottom right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))",
            borderRadius: "15px",
            border: "3px solid rgba(0, 0, 0, 0.1)",
            padding: "20px",
            marginBottom: "20px",
            width: "100%",
            maxWidth: `${Math.min(400, minDimension * 0.8)}px`,
        },
        sectionTitle: {
            fontWeight: "bold" as const,
            fontSize: "1.5rem",
            marginBottom: "10px",
            textAlign: "center" as const,
        },
    }

    function findMatch() {
        navigate(`/spectate/${code}`);
    }
    return (
        <View>
            <VStack>
                <JumblemLogoSimple/>
                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>Enter Code</Typography>
                    <TextField
                        label="Code"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                        }}
                        variant="outlined"
                        style={styles.textField}
                        type="password"
                    />
                    <Box style={{ display: "flex", justifyContent: "center" }} >
                        <Button variant="contained" style={styles.button} onClick={() => findMatch()}>
                            SPECTATE
                        </Button>
                    </Box>
                </Box>

            </VStack>
        </View>
    );
}
import { useState } from "react";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { View, VStack } from "../../../ReactSwiftly";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Checks } from "../../../Background/Utils/Checks";
import { AuthService } from "../../../Background/Service";

interface ForgotPasswordViewProps {
    backButton: () => void;
}
export default function ForgotPasswordView({ backButton }: ForgotPasswordViewProps) {
    const [email, setEmail] = useState('');
    const { minDimension } = useWindowSize();
    const [emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();
    const styles = {
        button: {
            width: '100%',
            padding: '10px',
            marginTop: '20px',
        },
        form: {
            width: '100%',
            maxWidth: `${Math.min(minDimension * 0.8, 400)}px`,
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        textField: {
            marginBottom: '20px',
            width: '100%',
        },
    }

    async function sendResetEmail() {
        if (Checks.isValidEmail(email)) {
            setEmailSent(true);
            try {
                await AuthService.resetPassword(email);
            } catch {

            }
            
        }

        
    }

    return (
        <View>
            <VStack>
                <Button onClick={() => navigate('/')}>
                    <JumblemLogoSimple />
                </Button>

                {emailSent ? (
                    <>
                        <Typography style={{ textAlign: "center" }}>{`An email will be sent to "${email}" if it exits on our server.`}</Typography>
                    </>
                ) : (
                    <Box style={styles.form}>
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.textField}
                            autoComplete="email"
                        />

                        <Button style={styles.button}
                            variant="contained"
                            color="primary"
                            onClick={sendResetEmail}
                        >
                            Reset
                        </Button>
                    </Box>
                )}

                <Button onClick={backButton}>
                    Back
                </Button>
            </VStack>
        </View>
    )
}
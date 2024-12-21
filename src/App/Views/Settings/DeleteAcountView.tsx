import { Alert, Box, Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { UserModel } from "../../../Background/Models";
import { View, VStack } from "../../../ReactSwiftly";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { AuthService, UserService } from "../../../Background/Service";

interface DeleteAccountViewProps {
    passedUser: UserModel;
    onBack: () => void;
}

export default function DeleteAccountView({ passedUser, onBack }: DeleteAccountViewProps) {
    // const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [canDelete, setCanDelete] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { minDimension } = useWindowSize();
    const navigate = useNavigate();

    async function handleDelete() {
        setCanDelete(false);
        setError(null); // Reset error state

        try {
            const loggedInUser = await AuthService.login(passedUser.email, password); // Replace with actual logic
            if (loggedInUser) {
                await UserService.deleteAccount(loggedInUser);
                navigate('/');
            }
        } catch (err) {
            setError('Invalid credentials. This might be a sign to stay.');
        } finally {
            setCanDelete(true);
        }
    }

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
        forgotPassword: {
            marginTop: '10px',
            textAlign: 'right' as const,
            color: 'gray',
            cursor: 'pointer',
        },
        textField: {
            marginBottom: '20px',
            width: '100%',
        },
        welcomeMessage: {
            textAlign: 'center' as const,
            marginBottom: '20px',
        },
    }

    return (
        <View>
            <VStack>
                <Button onClick={() => navigate("/")}>
                    <JumblemLogoSimple />
                </Button>
                <Box style={styles.form}>
                    <Typography variant="h5" style={styles.welcomeMessage}>
                        Delete Account
                    </Typography>
                    {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.textField}
                        autoComplete="current-password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={!canDelete}
                        style={styles.button}
                    >
                        {canDelete ? 'Delete' : 'Deleting...'}
                    </Button>
                </Box>

                <Button variant="text" onClick={onBack}>Back</Button>
            </VStack>
        </View>
    );
}
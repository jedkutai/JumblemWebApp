import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Typography, Alert, TextField, InputAdornment, IconButton, Button } from "@mui/material";
import { useState } from "react";
import { AuthService } from "../../../Background/Service";
import { View, VStack } from "../../../ReactSwiftly";
import { useNavigate } from "react-router-dom";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";


export default function CreateAccountView() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [canCreate, setCanCreate] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleCreateAccount = async () => {
        setCanCreate(false);
        setError(null);

        try {
            const result = await AuthService.createAccount(email, password);
            if (result.startsWith('Error')) {
                setError(result);
            } else {
                navigate("/home");
            }
        } catch (err) {
            setError('Error creating account. Please try again.');
        } finally {
            setCanCreate(true);
        }
    };

    const styles = {
        form: {
            width: '100%',
            maxWidth: '400px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        textField: {
            marginBottom: '20px',
            width: '100%',
        },
        button: {
            width: '100%',
            padding: '10px',
            marginTop: '20px',
        },
        subText: {
            marginTop: '10px',
            color: 'gray',
            textAlign: 'center' as const,
            fontSize: '0.9rem',
        },
    };

    return (
        <View>
            <VStack>
                <JumblemLogoSimple />
                <Box style={styles.form}>
                    <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '20px' }}>
                        Create Account
                    </Typography>
                    {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.textField}
                        autoComplete="email"
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.textField}
                        autoComplete="new-password"
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
                    <Typography style={styles.subText}>
                        Your password must be 8 or more characters in length.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateAccount}
                        disabled={!canCreate}
                        style={styles.button}
                    >
                        {canCreate ? 'Create Account' : 'Creating...'}
                    </Button>
                </Box>
                <Button onClick={() => navigate("/")} style={{ marginTop: '20px' }}>
                    Back
                </Button>
            </VStack>
        </View>
    );
}
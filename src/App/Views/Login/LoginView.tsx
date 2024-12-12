import { useState } from "react";
import { UserModel } from "../../../Background/Models";
import { AuthService } from "../../../Background/Service";
import { View, VStack } from "../../../ReactSwiftly";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { Alert, Box, Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";


export default function LoginView() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [canLogin, setCanLogin] = useState(true);
    const [user, setUser] = useState<UserModel | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { minDimension } = useWindowSize();
    const navigate = useNavigate();

    const handleLogin = async () => {
      setCanLogin(false);
      setError(null); // Reset error state
  
      try {
        const loggedInUser = await AuthService.login(email, password); // Replace with actual logic
        setUser(loggedInUser);
      } catch (err) {
        setError('Invalid email or password. Please try again.');
      } finally {
        setCanLogin(true);
      }
    };

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
            <Box style={styles.form}>
                    <Typography variant="h5" style={styles.welcomeMessage}>
                    Login
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
                    <Typography
                    variant="body2"
                    style={styles.forgotPassword}
                    onClick={() => console.log('Forgot password clicked')}
                    >
                    Forgot Password?
                    </Typography>
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    disabled={!canLogin}
                    style={styles.button}
                    >
                    {canLogin ? 'Login' : 'Logging in...'}
                    </Button>
                </Box>
            </VStack>
        </View>
    );
}
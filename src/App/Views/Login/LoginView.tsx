import { useEffect, useState } from "react";
import { AuthService } from "../../../Background/Service";
import { View, VStack } from "../../../ReactSwiftly";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { Alert, Box, Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import ForgotPasswordView from "./ForgotPasswordView";
import { useNavigate } from "react-router-dom";


export default function LoginView() {
  const [view, setView] = useState<"Login" | "ForgotPassword">("Login");
  const [attempts, setAttempts] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [canLogin, setCanLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { minDimension } = useWindowSize();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [email, password]);
  
  const handleLogin = async () => {
    setCanLogin(false);
    setError(null); // Reset error state
    setAttempts(attempts + 1);
    try {
      const loggedInUser = await AuthService.login(email, password); // Replace with actual logic
      if (loggedInUser) {

      }
    } catch (err) {
      setError(attempts < 5 ? 'Invalid login. Please try again.' : 'Too many attempts. Please try again later.');
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
      color: attempts >= 5 ? 'red' : 'gray',
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

  if (view === "ForgotPassword") {
    return (<ForgotPasswordView backButton={() => setView("Login")}/>);
  }

  return (
    <View>
      <VStack>
        <Button onClick={() => navigate("/")}>
          <JumblemLogoSimple />
        </Button>
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
            onClick={() => setView("ForgotPassword")}
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
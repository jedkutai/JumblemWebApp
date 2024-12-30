import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { UserModel } from "../../../Background/Models";
import { AuthService } from "../../../Background/Service";
import { Checks } from "../../../Background/Utils/Checks";
import { View, VStack } from "../../../ReactSwiftly";
import { useNavigate } from "react-router-dom";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";

interface MissingUsernameViewProps {
  currentUser: UserModel

  error: string | null;
  setError: (err: string | null) => void;

  newUsername: string;
  setNewUsername: (username: string) => void;

  isCheckingUsername: boolean;
  setIsCheckingUsername: (isChecking: boolean) => void;


  isUsernameAvailable: boolean;
  setIsUsernameAvailable: (isAvailable: boolean) => void;
}

export default function MissingUsernameView({
  currentUser,
  error, setError,
  newUsername, setNewUsername,
  isCheckingUsername, setIsCheckingUsername,
  isUsernameAvailable, setIsUsernameAvailable,

}: MissingUsernameViewProps) {
  const navigate = useNavigate();

  const handleCheckUsername = async () => {
    if (!newUsername.trim()) {
      setError("Please enter a username.");
      return;
    }

    setError(null);
    setIsCheckingUsername(true);

    try {
      const available = await Checks.isUsernameAvailable(
        newUsername.toLowerCase()
      );
      setIsUsernameAvailable(available);

      if (!available) {
        setError("Username is already taken. Please try another one.");
      }
    } catch (err) {
      setError("Failed to check username availability. Please try again.");
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleSetUsername = async () => {
    if (!isUsernameAvailable) {
      setError("Please check username availability before continuing.");
      return;
    }

    try {
      await AuthService.setUsername(currentUser, newUsername);
      navigate("/");
    } catch (err) {
      setError("Failed to set username. Please try again.");
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      backgroundColor: "rgb(227, 218, 195)",
      minHeight: "100vh",
      padding: "20px",
      boxSizing: "border-box" as const,
    },
    logo: {
      width: "150px",
      height: "auto",
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
      maxWidth: "400px",
    },
    sectionTitle: {
      fontWeight: "bold" as const,
      fontSize: "1.5rem",
      marginBottom: "10px",
      textAlign: "center" as const,
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
    bottomNav: {
      marginTop: "auto",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      width: "100%",
      maxWidth: "400px",
    },
    textField: {
      marginBottom: "10px",
      width: "100%",
    },
    logoutButton: {
      marginTop: "20px",
      width: "100%",
    },
  };

  return (
    <View>
      <VStack>
        <JumblemLogoSimple />
        <Box style={styles.section}>
          <Typography variant="h6" style={styles.sectionTitle}>
            Create Your Username
          </Typography>
          {error && (
            <Alert severity="error" style={{ marginBottom: "10px" }}>
              {error}
            </Alert>
          )}
          {isUsernameAvailable && (
            <Alert severity="success" style={{ marginBottom: "10px" }}>
              Username is available!
            </Alert>
          )}
          <TextField
            label="Username"
            value={newUsername}
            onChange={(e) => {
              setNewUsername(e.target.value);
              setIsUsernameAvailable(false);
            }}
            variant="outlined"
            style={styles.textField}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCheckUsername}
            disabled={isCheckingUsername || !newUsername.trim()}
            style={styles.button}
          >
            {isCheckingUsername ? "Checking..." : "Check Availability"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSetUsername}
            disabled={!isUsernameAvailable}
            style={styles.button}
          >
            Set Username
          </Button>
        </Box>
      </VStack>
    </View>
  );
}
import { View, VStack } from "../../../ReactSwiftly";
import { Button } from "@mui/material";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { useNavigate } from "react-router-dom";


export default function AppOpenView() {
    const navigate = useNavigate();


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

                <Button onClick={() => navigate("/home")}>
                    CONTINUE AS GUEST
                </Button>
            </VStack>
        </View>
    );
}
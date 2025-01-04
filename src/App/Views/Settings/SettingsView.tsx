import { View, VStack } from "../../../ReactSwiftly";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";



export default function SettingsView() {
    const navigate = useNavigate();



    return (
        <View startAtTop={true}>
            <VStack>
                <Button onClick={() => navigate("/home")}>
                    <JumblemLogoSimple />
                </Button>

                <Button variant="text" style={{ color: "black"}} onClick={() => navigate("/settings/changeusername")}>Change Username</Button>
                <Button variant="text" style={{ color: "red"}} onClick={() => navigate("/settings/deleteaccount")}>Delete Account</Button>

            </VStack>
        </View>
    );
}
import { useState } from "react";
import { UserModel } from "../../../Background/Models";
import { View, VStack } from "../../../ReactSwiftly";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { Button } from "@mui/material";
import DeleteAccountView from "./DeleteAcountView";
import { useNavigate } from "react-router-dom";

interface SettingsViewProps {
    passedUser: UserModel;
}

export default function SettingsView({ passedUser }: SettingsViewProps) {
    const navigate = useNavigate();
    const [view, setView] = useState<"Settings" | "DeleteAccount">("Settings");

    if (view === "DeleteAccount") {
        return (<DeleteAccountView passedUser={passedUser} onBack={() => setView("Settings")}/>);
    }

    return (
        <View startAtTop={true}>
            <VStack>
                <Button onClick={() => navigate("/home")}>
                    <JumblemLogoSimple />
                </Button>

                <Button variant="text" style={{ color: "black"}} onClick={() => setView("DeleteAccount")}>Delete Account</Button>

            </VStack>
        </View>
    );
}
import { Button, Typography } from "@mui/material";
import { View, VStack } from "../../ReactSwiftly";
import JumblemLogoSimple from "./JumblemLogoSimple";
import { useNavigate } from "react-router-dom";
import HowDidIGetHere from "./Embeds/HowDidIGetHere";

export default function PageNotFoundView() {
    const navigate = useNavigate();

    return (
        <View>
            <VStack>
                <Button onClick={() => navigate("/home")}>
                    <JumblemLogoSimple />
                </Button>
                <Typography variant="h1">
                    404
                </Typography>
                <Typography variant="h4" style={{ color: "gray"}}>
                    How did you get here?
                </Typography>
                <HowDidIGetHere />
                
            </VStack>
        </View>
    )
}
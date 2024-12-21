import { CircularProgress } from "@mui/material";
import { View, VStack } from "../../../ReactSwiftly";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";

export default function AppLoadingView() {

    return (
        <View>
            <VStack>
                <JumblemLogoSimple />
                <CircularProgress sx={{ color: "black" }}/>
            </VStack>
        </View>
    );
}


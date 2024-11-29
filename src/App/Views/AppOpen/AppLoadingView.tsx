import { CircularProgress } from "@mui/material";
import JumblemLogo from "../../../assets/jumblem_logo.png";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { View, VStack } from "../../../ReactSwiftly";

export default function AppLoadingView() {
    const { minDimension } = useWindowSize();
    const styling = {
        maxWidth: `${minDimension / 3}px`,
        maxHeight: `${minDimension / 3}px`,
    }

    return (
        <View>
            <VStack>
                <img src={JumblemLogo} style={styling}/>
                <CircularProgress />
            </VStack>
        </View>
    );
}


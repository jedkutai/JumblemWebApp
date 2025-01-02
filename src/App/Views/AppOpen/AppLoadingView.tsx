import { CircularProgress } from "@mui/material";
import { View, VStack } from "../../../ReactSwiftly";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";

interface AppLoadingViewProps {
    startAtTop?: boolean;
}

export default function AppLoadingView({ startAtTop }: AppLoadingViewProps) {
    const { height } = useWindowSize();
    
    if (startAtTop) {
        return (
            <View startAtTop={true}>
                <VStack>
                    <JumblemLogoSimple />
                    <div
                        style={{
                            height: `${height * 0.3}px`,
                            visibility: "hidden", // Makes it invisible but keeps it in the layout
                        }}
                    ></div>
                    <CircularProgress sx={{ color: "black" }} />
                </VStack>
            </View>
        );
    } else {
        return (
            <View>
                <VStack>
                    <JumblemLogoSimple />
                    <CircularProgress sx={{ color: "black" }} />
                </VStack>
            </View>
        );
    }
}


import { Typography } from "@mui/material";
import { View, VStack } from "../../ReactSwiftly";

export default function PageNotFoundView() {


    return (
        <View>
            <VStack>
                <Typography variant="h1">
                    404
                </Typography>
                <Typography variant="h3" style={{ color: "gray"}}>
                    Ummmmmmm, how did you get here?
                </Typography>
            </VStack>
        </View>
    )
}
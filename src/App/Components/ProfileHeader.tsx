import { Box, Typography } from "@mui/material";
import { UserModel } from "../../Background/Models";
import { useWindowSize } from "../../Background/Utils/useWindowSize";
import { HStack, VStack } from "../../ReactSwiftly";
import { DisplayFunctions } from "../../Background/Utils/DisplayFunctions";

interface ProfileHeaderProps {
    passedUser: UserModel;
}

export default function ProfileHeader({
    passedUser,
}: ProfileHeaderProps) {
    const upperBound = 650;
    const dimensionDivider = 9 * 1.75;
    const { minDimension } = useWindowSize();


    const style = {
        section: {
            backgroundColor: "black",
            borderRadius: "15px",
            border: "3px solid rgba(0, 0, 0, 0.1)",
            padding: "20px",
            width: `${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`,
        },
    }

    return (
        <Box style={style.section}>
            <VStack spacing="10px">
                <HStack spacing="10px">
                    <Typography variant="h5" style={{ color:"white", fontWeight: "bolder"}}>{DisplayFunctions.displayUsername(passedUser.usernameDisplayed) ?? "N/A"}</Typography>
                    <Typography variant="h6" style={{ color:"gray", fontWeight: "bold"}}>{`(${passedUser.standardRating})`}</Typography>
                </HStack>
                <Typography variant="h6" style={{ color:"gray", fontWeight: "bold"}}>{`Est. ${DisplayFunctions.displayUserDate(passedUser.timestamp)}`}</Typography>
            </VStack>
        </Box>
    );
}
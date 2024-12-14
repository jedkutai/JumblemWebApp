import { UserModel } from "../../Background/Models";
import { useWindowSize } from "../../Background/Utils/useWindowSize";
import { HStack, VStack } from "../../ReactSwiftly";

interface ProfileHeaderProps {
    passedUser: UserModel;
}

export default function ProfileHeader({
    passedUser,
}: ProfileHeaderProps) {
    const { minDimension } = useWindowSize();


    const style = {
        section: {
            backgroundImage:
                "linear-gradient(to bottom right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))",
            borderRadius: "15px",
            border: "3px solid rgba(0, 0, 0, 0.1)",
            padding: "20px",
            marginBottom: "20px",
            width: "100%",
            maxWidth: `${Math.min(400, minDimension * 0.8)}px`,
        },
    }

    return (
        <VStack>
            <HStack>
                <></>
            </HStack>
        </VStack>
    );
}
import { UserModel } from "../../../../Background/Models";
import { HStack, VStack, Text, HSpacer } from "../../../../ReactSwiftly";


interface VersusCrashCourseHeaderProps {
    user: UserModel,
    yourTurn: boolean,
}

export default function VersusCrashCourseHeader({ yourTurn }: VersusCrashCourseHeaderProps) {
    return (
        <VStack>
            <HStack maxWidth="400px">
                <HSpacer />

                <VStack minWidth={`${150}px`} minHeight={`${75}px`} maxWidth={`${150}px`} maxHeight={`${75}px`} border={yourTurn ? "3px solid white" : "3px solid black"} cornerRadius="20px">
                    <Text text={"You"} />
                </VStack>

                <HSpacer />

                <VStack minWidth={`${150}px`} minHeight={`${75}px`} maxWidth={`${150}px`} maxHeight={`${75}px`} border={!yourTurn ? "3px solid white" : "3px solid black"} cornerRadius="20px">
                    <Text text={"Jumblem"} />
                </VStack>

                <HSpacer />
            </HStack>
        </VStack>
    )
}
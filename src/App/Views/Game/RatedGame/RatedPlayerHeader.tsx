import { CircularProgress, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { UserModelGuest } from "../../../../Background/Extends/UserModelGuest";
import { UserModel } from "../../../../Background/Models";
import { FetchService } from "../../../../Background/Service";
import { VStack } from "../../../../ReactSwiftly";
import { DisplayTime } from "../../../Components";
import { DisplayFunctions } from "../../../../Background/Utils/DisplayFunctions";


interface RatedPlayerHeaderProps {
    playerId: string | undefined,
    timeRemaining: number,
    highlight: boolean,
}

export default function RatedPlayerHeaderProps({
    playerId,
    timeRemaining,
    highlight

}: RatedPlayerHeaderProps) {
    const [player, setPlayer] = useState<UserModel | undefined>(undefined);
    useEffect(() => {
        const getPlayer = async (): Promise<void> => {
            if (playerId !== undefined) {
                try {
                    const loadedPlayer = await FetchService.fetchUserByUid(playerId);
                    setPlayer(loadedPlayer);
                } catch (error) {
                    setPlayer(UserModelGuest);
                }
            }


        }

        getPlayer();

    }, []);
    return (

        <VStack>
            {player !== undefined ? (
                <VStack spacing="0px" minWidth={`${150}px`} minHeight={`${100}px`} maxWidth={`${150}px`} maxHeight={`${100}px`} border={highlight ? "3px solid white" : "3px solid black"} cornerRadius="20px">
                    

                    <Typography
                        variant="h6"
                        style={{
                            color: "black",
                            fontWeight: "bold",
                            padding: "0px",
                            margin: "0px"
                        }}
                    >{DisplayFunctions.displayUsername(player.usernameDisplayed)}</Typography>
                    <Typography
                        variant="h6"
                        style={{
                            color: "black",
                            padding: "0px",
                            margin: "0px"
                        }}
                    >{`${player.standardRating}`}</Typography>
                    <DisplayTime timeRemaining={timeRemaining} />
                </VStack>

            ) : (
                <CircularProgress />
            )}
        </VStack>
    );

}
import { Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { UserModelGuest } from "../../../../Background/Extends/UserModelGuest";
import { UserModel } from "../../../../Background/Models";
import { FetchService } from "../../../../Background/Service";
import { DisplayFunctions } from "../../../../Background/Utils/DisplayFunctions";
import { VStack, HStack } from "../../../../ReactSwiftly";
import { DisplayTime } from "../../../Components";

interface RatedPlayerHeader2Props {
    playerId: string | undefined,
    timeRemaining: number,
    highlight: boolean,
    ratingChange?: number
}

export default function RatedPlayerHeader2Props({
    playerId,
    timeRemaining,
    highlight,
    ratingChange

}: RatedPlayerHeader2Props) {
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
                    <HStack>
                        <Typography
                            variant="h6"
                            style={{
                                color: "black",
                                padding: "0px",
                                margin: "0px"
                            }}
                        >{`${player.standardRating}`}</Typography>
                        {ratingChange && ratingChange > 0 && (
                            <Typography
                                variant="h6"
                                style={{
                                    color: "green",
                                    padding: "0px",
                                    margin: "0px"
                                }}
                            >{`+${ratingChange}`}</Typography>
                        )}
                        {ratingChange && ratingChange == 0 && (
                            <Typography
                                variant="h6"
                                style={{
                                    color: "black",
                                    padding: "0px",
                                    margin: "0px"
                                }}
                            >{`+${ratingChange}`}</Typography>
                        )}
                        {ratingChange && ratingChange < 0 && (
                            <Typography
                                variant="h6"
                                style={{
                                    color: "red",
                                    padding: "0px",
                                    margin: "0px"
                                }}
                            >{`${ratingChange}`}</Typography>
                        )}
                    </HStack>
                    <DisplayTime timeRemaining={timeRemaining} />
                </VStack>

            ) : (
                <CircularProgress sx={{ color: "black" }}/>
            )}
        </VStack>
    );

}
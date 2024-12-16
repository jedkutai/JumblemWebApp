import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { UserModelGuest } from "../../../Background/Extends/UserModelGuest";
import { UserModel } from "../../../Background/Models";
import { FetchService } from "../../../Background/Service";
import { DisplayFunctions } from "../../../Background/Utils/DisplayFunctions";
import { Text, VStack } from "../../../ReactSwiftly";

interface PreviousGamePlayerHeaderProps {
    playerId: string | undefined,
    highlight: boolean,
}

export default function PreviousGamePlayerHeaderProps({
    playerId,
    highlight

}: PreviousGamePlayerHeaderProps) {
    const [player, setPlayer]= useState<UserModel | undefined>(undefined);
    useEffect(() => {
        const getPlayer = async(): Promise<void> => {
            if (playerId !== undefined) {
                try {
                    const loadedPlayer = await FetchService.fetchUserByUid(playerId);
                    setPlayer(loadedPlayer);
                } catch(error) {
                    setPlayer(UserModelGuest);
                }
            }


        }

        getPlayer();

    }, []);
    return (

        <VStack>
            {player !== undefined ? (
                <VStack minWidth={`${150}px`} minHeight={`${75}px`} maxWidth={`${150}px`} maxHeight={`${75}px`} border={highlight ? "3px solid white" : "3px solid black"} cornerRadius="20px">
                    <Text text={DisplayFunctions.displayUsername(player.usernameDisplayed)}/>
                </VStack>

            ) : (
                <CircularProgress/>
            )}
        </VStack>
    );

}
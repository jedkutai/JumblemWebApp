import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { UserModelGuest } from "../../../../Background/Extends/UserModelGuest";
import { UserModel } from "../../../../Background/Models";
import { FetchService } from "../../../../Background/Service";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { Text, VStack } from "../../../../ReactSwiftly";
import { DisplayTime } from "../../../Components/DisplayTime";


interface CasualPlayerHeaderProps {
    playerId: string | undefined,
    timeRemaining: number,
    highlight: boolean,
}

export default function CasualPlayerHeaderProps({
    playerId,
    timeRemaining,
    highlight

}: CasualPlayerHeaderProps) {
    const [player, setPlayer]= useState<UserModel | undefined>(undefined);
    const { minDimension } = useWindowSize();
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
                    <Text text={player.username ?? "N/A"}/>
                    <DisplayTime timeRemaining={timeRemaining}/>
                </VStack>

            ) : (
                <CircularProgress/>
            )}
        </VStack>
    );

}
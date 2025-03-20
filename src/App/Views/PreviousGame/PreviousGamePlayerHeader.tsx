import { Button, CircularProgress, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { UserModelGuest } from "../../../Background/Extends/UserModelGuest";
import { GameModel, UserModel } from "../../../Background/Models";
import { FetchService } from "../../../Background/Service";
import { DisplayFunctions } from "../../../Background/Utils/DisplayFunctions";
import { VStack } from "../../../ReactSwiftly";
import { useNavigate } from "react-router-dom";

interface PreviousGamePlayerHeaderProps {
    playerId: string | undefined,
    highlight: boolean,
    game: GameModel;
}

export default function PreviousGamePlayerHeaderProps({
    playerId,
    highlight,
    game

}: PreviousGamePlayerHeaderProps) {
    const [player, setPlayer] = useState<UserModel | undefined>(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        const getPlayer = async (): Promise<void> => {
            if (playerId !== undefined) {
                try {
                    const loadedPlayer = await FetchService.fetchUserByUid(playerId);
                    setPlayer(loadedPlayer);
                } catch (error) {
                    let unloadedPlayer = UserModelGuest;
                    unloadedPlayer.id = playerId
                    setPlayer(unloadedPlayer);
                }
            }


        }

        getPlayer();

    }, []);

    function navigateToPlayer() {
        if (player) {
            navigate(`/people/${player.username}`);
        }
    }
    return (

        <Button onClick={navigateToPlayer} style={{ outline: "none", boxShadow: "none" }}>
            <VStack>
                {player !== undefined ? (
                    <VStack spacing="0x" minWidth={`${150}px`} minHeight={`${75}px`} maxWidth={`${150}px`} maxHeight={`${75}px`} border={highlight ? "3px solid white" : "3px solid black"} cornerRadius="20px">

                        <Typography
                            variant="h6"
                            style={{
                                color: "black",
                                fontWeight: "bold",
                                padding: "0px",
                                margin: "0px"
                            }}
                        >{DisplayFunctions.displayUsername(game.winner == playerId ? `(W) ${player.usernameDisplayed}` : player.usernameDisplayed)}</Typography>

                    </VStack>

                ) : (
                    <CircularProgress sx={{ color: "black" }}/>
                )}
            </VStack>
        </Button>
    );

}
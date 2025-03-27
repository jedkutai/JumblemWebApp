import { useNavigate } from "react-router-dom";
import { Button, LinearProgress, Typography } from "@mui/material";
import { View, VStack } from "../../../../ReactSwiftly";
import { useEffect, useState } from "react";
import { FollowModel, GameModel, UserModel } from "../../../../Background/Models";
import { FetchService } from "../../../../Background/Service";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import SpectateGamePreview from "./SpectateGamePreview";
import JumblemLogoSimple from "../../../Components/JumblemLogoSimple";

enum PageState {
    loading,
    loaded,
    error
}
interface SpectateGameMenuProps {
    passedUser: UserModel;
}

export default function SpectateGameMenu({ passedUser }: SpectateGameMenuProps) {
    const navigate = useNavigate();
    const [pageState, setPageState] = useState<PageState>(PageState.loading);
    const [activeGames, setActiveGames] = useState<GameModel[]>([]);

    const [follows, setFollows] = useState<FollowModel[]>([]);

    const { minDimension, height } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;

    const [tickCount, setTickCount] = useState(0);
    const tickLimit = 10;

    useEffect(() => {
        getActiveGames()
    }, []);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (tickCount >= tickLimit) {
                getActiveGames();
                setTickCount(0);
            } else {
                setTickCount(tickCount + 1);
            }

        }, 1000 * 1);

        return () => clearTimeout(timeout);
    }, [tickCount]);

    async function spectateGame(gameId: string) {
        window.open(`/spectate/${gameId}`, "_blank");
    }

    async function getActiveGames() {
        try {
            const followList = await FetchService.fetchFollowedUsers(passedUser);
            setFollows(followList);

            const games = await FetchService.fetchGamesToSpectate(passedUser);
            setActiveGames(games);
            setPageState(PageState.loaded);
        } catch {
            setPageState(PageState.error);
        }
    }

    const style = {
        button: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(227, 218, 195)",
            color: "black",
            fontWeight: 600,
        },
    }

    return (
        <View startAtTop={true}>
            <VStack>
                <JumblemLogoSimple/>
                <Typography variant="h6" style={{ color: "black" }}>SPECTATE</Typography>

                {pageState == PageState.loaded && (
                    <>
                        <Button variant="contained" style={style.button} onClick={() => navigate("/findpeople")}>
                            {follows.length === 0 ? "Find People" : "Find More People"}
                        </Button>

                        {activeGames.length == 0 && (
                            <>
                                <div style={{ height: `${height * 0.25}px` }}></div>
                                <Typography>No active games.</Typography>
                            </>
                        )}

                        {activeGames.map((game, index) => (
                            <Button onClick={() => spectateGame(game.id)}>
                                <SpectateGamePreview key={index} passedGame={game} />
                            </Button>
                        ))}
                    </>

                )}
                {pageState == PageState.loading && (
                    <LinearProgress color="inherit" sx={{ width: `${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px` }} />
                )}
                {pageState == PageState.error && (
                    <Button variant="contained" style={style.button} onClick={() => window.location.reload()}>
                        Reload
                    </Button>
                )}

            </VStack>
        </View>
    );
}
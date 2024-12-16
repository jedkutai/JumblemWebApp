import { CircularProgress, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserModel, GameModel } from "../../../Background/Models";
import { FetchService, UserService } from "../../../Background/Service";
import { View, VStack } from "../../../ReactSwiftly";
import CasualHistoryCell from "../../Components/HistoryCells/CasualHistoryCell";
import PrivateHistoryCell from "../../Components/HistoryCells/PrivateHistoryCell";
import RatedHistoryCell from "../../Components/HistoryCells/RatedHistoryCell";
import ProfileHeader from "../../Components/ProfileHeader";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";

interface SpecificPlayerViewProps {
    passedUser: UserModel;
    passedPlayer: UserModel;
}

enum ViewState {
    loading,
    loaded,
    failure
}

export default function SpecificPlayerView({ passedUser, passedPlayer }: SpecificPlayerViewProps) {
    const [games, setGames] = useState<GameModel[]>([]);
    const [viewState, setViewState] = useState<ViewState>(ViewState.loading);
    const [followedByUser, setFollowedByUser] = useState<boolean>(false);
    const [actionHappening, setActionHappening] = useState<boolean>(false);
    const [showRed, setShowRed] = useState<boolean>(false);
    const navigate = useNavigate();
    const { minDimension } = useWindowSize();
    const upperBound = 650;
    const dimensionDivider = 9 * 1.75;

    useEffect(() => {
        checkIfFollowed();
        onAppearActions();
    }, []);

    async function onAppearActions() {
        setViewState(ViewState.loading);
        try {
            const fetchedGames = await FetchService.fetchGames(passedPlayer.id, 25);
            setGames(fetchedGames);

            setViewState(ViewState.loaded);
        } catch {
            setViewState(ViewState.failure);
        }
    }

    async function checkIfFollowed() {
        try {
            const isFollowed = await FetchService.checkIfUserAFollowsUserB(passedUser, passedPlayer);
            setFollowedByUser(isFollowed);
        } catch {
            setFollowedByUser(false);
        }
    }

    async function follow() {
        if (!actionHappening) {
            setActionHappening(true);
            try {
                await UserService.followUser(passedUser, passedPlayer);
                checkIfFollowed();
            } catch {

            }
            setActionHappening(false);
        }
    }

    async function unfollow() {
        if (!actionHappening) {
            setActionHappening(true);
            try {
                await UserService.unfollowUser(passedUser, passedPlayer);
                checkIfFollowed();
            } catch {

            }
            setActionHappening(false);
        }
    }

    const buttonStyle = {
        width: `${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`
    }
    return (
        <View>
            <VStack>
                <ProfileHeader passedUser={passedPlayer} />

                {followedByUser ? (
                    <Button style={buttonStyle}
                    onMouseOver={() => setShowRed(true)} 
                    onMouseOut={() => setShowRed(false)} 
                    variant="contained" 
                    color={showRed ? "error" : "primary"} 
                    onClick={unfollow} 
                    disabled={actionHappening}
                    >
                        {showRed ? "Unfollow" : "Following"}
                    </Button>
                ) : (
                    <Button style={buttonStyle} variant="contained" color="primary" onClick={follow} disabled={actionHappening}>
                        Follow
                    </Button>
                )}


                {viewState === ViewState.loading && (
                    <CircularProgress />
                )}

                {viewState === ViewState.failure && (
                    <Button color="error" onClick={onAppearActions}>
                        Reload
                    </Button>
                )}

                {viewState === ViewState.loaded && (
                    <>
                        {games.map((game, index) => (
                            <div key={index}>
                                {game.gameMode === "casual" && (
                                    <CasualHistoryCell passedGame={game} passedUser={passedPlayer} />
                                )}
                                {game.gameMode === "private" && (
                                    <PrivateHistoryCell passedGame={game} passedUser={passedPlayer} />
                                )}
                                {game.gameMode === "standard" && (
                                    <RatedHistoryCell passedGame={game} passedUser={passedPlayer} />
                                )}
                            </div>
                        ))}
                    </>
                )}
            </VStack>
        </View>
    )
}
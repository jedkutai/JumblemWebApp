import { useEffect, useState } from "react";
import { GameModel, UserModel } from "../../../Background/Models";
import { HStack, View, VStack } from "../../../ReactSwiftly";
import ProfileHeader from "../../Components/ProfileHeader";
import { Button, CircularProgress } from "@mui/material";
import { FetchService } from "../../../Background/Service";
import CasualHistoryCell from "../../Components/HistoryCells/CasualHistoryCell";
import RatedHistoryCell from "../../Components/HistoryCells/RatedHistoryCell";
import PrivateHistoryCell from "../../Components/HistoryCells/PrivateHistoryCell";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface ProfileViewProps {
    passedUser: UserModel;
}

enum ViewState {
    loading,
    loaded,
    failure
}

export default function ProfileView({ passedUser }: ProfileViewProps) {
    const [games, setGames] = useState<GameModel[]>([]);
    const [viewState, setViewState] = useState<ViewState>(ViewState.loading);
    const navigate = useNavigate();
    
    useEffect(() => {
        onAppearActions();
    }, []);

    async function onAppearActions() {
        setViewState(ViewState.loading);
        try {
            const fetchedGames = await FetchService.fetchGames(passedUser.id, 25);
            setGames(fetchedGames);

            setViewState(ViewState.loaded);
        } catch {
            setViewState(ViewState.failure);
        }
    }

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
        }
    };
    
    return (
        <View startAtTop={true}>
            <VStack>
                <ProfileHeader passedUser={passedUser} />

                <HStack>
                    <Button onClick={() => navigate("/settings")} variant="text" style={{ color: "white", backgroundColor: "black", fontWeight: "bold" }}>
                        Settings
                    </Button>

                    <Button onClick={handleLogout} variant="text" style={{ color: "white", backgroundColor: "red", fontWeight: "bold" }}>
                        Logout
                    </Button>
                </HStack>


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
                                    <CasualHistoryCell passedGame={game} passedUser={passedUser} />
                                )}
                                {game.gameMode === "private" && (
                                    <PrivateHistoryCell passedGame={game} passedUser={passedUser} />
                                )}
                                {game.gameMode === "standard" && (
                                    <RatedHistoryCell passedGame={game} passedUser={passedUser} />
                                )}
                            </div>
                        ))}
                    </>
                )}
            </VStack>
        </View>
    )
}
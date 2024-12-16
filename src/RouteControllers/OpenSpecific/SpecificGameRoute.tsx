import { CircularProgress, Typography } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GameModel, UserModel } from "../../Background/Models";
import { FetchService } from "../../Background/Service";
import app from "../../firebase";
import { View } from "../../ReactSwiftly";
import SeePreviousGameView from "../../App/Views/PreviousGame/SeePreviousGameView";

enum PageState {
    loading,
    loaded,
}

function SpecificGameRoute() {
    const { gameId } = useParams();
    const [user, setUser] = useState<UserModel | null>(null);
    const [specificGame, setSpecificGame] = useState<GameModel | null>(null);
    const [pageState, setPageState] = useState<PageState>(PageState.loading);
    const navigate = useNavigate();

    useEffect(() => {
        onAppearActions();
    }, []);

    async function onAppearActions() {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const fetchedUser = await FetchService.fetchUserByUid(firebaseUser.uid);
                    if (gameId) {
                        const fetchedGame = await FetchService.fetchGameById(gameId);
                        if (fetchedGame.winner !== "aborted") {
                            setSpecificGame(fetchedGame);
                        }
                    }
                    setUser(fetchedUser);
                    setPageState(PageState.loaded);

                } catch (error) {
                    navigate("/");
                }
            } else {
                navigate("/");
            }
        });

        return () => unsubscribe();
    }

    switch (pageState) {
        case PageState.loading:
            return (
                <View>
                    <CircularProgress />
                </View>
            );

        case PageState.loaded:
            if (user && specificGame) {
                return (
                    <SeePreviousGameView previousGame={specificGame} />
                );
            } else {
                return (
                    <View>
                        <Typography>Game not found.</Typography>
                    </View>
                )
            }
            break;

    }
}

export default SpecificGameRoute;
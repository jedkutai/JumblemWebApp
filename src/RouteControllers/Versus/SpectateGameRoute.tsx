import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GameModel, UserModel } from "../../Background/Models";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FetchService, SpectateService } from "../../Background/Service";
import app from "../../firebase";
import { Typography } from "@mui/material";
import AppLoadingView from "../../App/Views/AppOpen/AppLoadingView";
import { View } from "../../ReactSwiftly";
import { WordBankFunctions } from "../../Background/Utils/WordBankFunctions";
import SpectateGameView from "../../App/Views/Game2/SpectateGame/SpectateGameView";

enum PageState {
    loading,
    loaded,
}

export default function SpectateGameRoute() {
    const { gameId } = useParams();
    const [user, setUser] = useState<UserModel | null>(null);
    const [game, setGame] = useState<GameModel | null>(null);
    const [pageState, setPageState] = useState<PageState>(PageState.loading);
    const [wordBankDict, setWordBankDict] = useState<Record<string, string[]>>({});
    const navigate = useNavigate();

    useEffect(() => {
        onAppearActions();
    }, []);


    async function onAppearActions() {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                if (firebaseUser.isAnonymous) {
                    navigate("/home");
                } else {
                    try {
                        const wordBank = await WordBankFunctions.getWordBank();
                        setWordBankDict(wordBank);
                        const fetchedUser = await FetchService.fetchUserByUid(firebaseUser.uid);
                        if (gameId) {
                            const fetchedGame = await SpectateService.fetchActiveGameById(gameId);
                            if (fetchedGame.winner !== "aborted") {
                                setGame(fetchedGame);
                            } else {
                                navigate("/home");
                            }
                        }
                        setUser(fetchedUser);
                        setPageState(PageState.loaded);

                    } catch (error) {
                        navigate(`/games/${gameId}`);
                    }
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
                <AppLoadingView />
            );

        case PageState.loaded:
            if (user && game) {
                return (
                    <SpectateGameView passedGame={game} passedUser={user} wordBankDict={wordBankDict}/>
                );
            } else {
                return (
                    <View>
                        <Typography>Game not found.</Typography>
                    </View>
                );
            }

    }
}
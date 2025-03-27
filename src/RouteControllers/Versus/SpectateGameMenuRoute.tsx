import { useEffect, useState } from "react";
import { UserModel } from "../../Background/Models";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FetchService } from "../../Background/Service";
import app from "../../firebase";
import { useNavigate } from "react-router-dom";
import AppLoadingView from "../../App/Views/AppOpen/AppLoadingView";
import { Typography } from "@mui/material";
import { View } from "../../ReactSwiftly";
import SpectateGameMenu from "../../App/Views/Game2/SpectateGame/SpectateGameMenu";

enum PageState {
    loading,
    loaded,
}

export default function SpectateGameMenuRoute() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserModel | null>(null);
    const [pageState, setPageState] = useState<PageState>(PageState.loading);

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
                        const fetchedUser = await FetchService.fetchUserByUid(firebaseUser.uid);
                        setUser(fetchedUser);
                        setPageState(PageState.loaded);

                    } catch (error) {
                        navigate("/");
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
            if (user) {
                return (
                    <SpectateGameMenu passedUser={user} />
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
import { Typography } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserModel } from "../../Background/Models";
import { FetchService } from "../../Background/Service";
import app from "../../firebase";
import { View } from "../../ReactSwiftly";
import SpecificPlayerView from "../../App/Views/People/SpecificPlayerView";
import AppLoadingView from "../../App/Views/AppOpen/AppLoadingView";

enum PageState {
    loading,
    loaded,
}

function SpecificPlayerRoute() {
    const { username } = useParams();
    const [user, setUser] = useState<UserModel | null>(null);
    const [specificPlayer, setSpecificPlayer] = useState<UserModel | null>(null);
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
                    if (username) {
                        if (fetchedUser.username == username.toLowerCase()) {
                            navigate("/profile");
                        } else {
                            const fetchedPlayer = await FetchService.fetchUserByUsername(username);
                            setSpecificPlayer(fetchedPlayer);
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
                <AppLoadingView />
            );

        case PageState.loaded:
            if (user && specificPlayer) {
                return (
                    <SpecificPlayerView passedUser={user} passedPlayer={specificPlayer} />
                );
            } else {
                return (
                    <View>
                        <Typography>User not found.</Typography>
                    </View>
                )
            }
            break;

    }
}

export default SpecificPlayerRoute;
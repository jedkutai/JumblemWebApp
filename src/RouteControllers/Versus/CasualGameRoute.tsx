import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../Background/Models";
import { FetchService } from "../../Background/Service";
import app from "../../firebase";
import { CircularProgress } from "@mui/material";
import { View } from "../../ReactSwiftly";
import StartCasualGameView from "../../App/Views/Game/CasualGame/StartCasualGameView";

enum PageState {
    loading,
    loaded,
}

export default function CasualGameRoute() {
    const [user, setUser] = useState<UserModel | null>(null);
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

                    if (fetchedUser.username) {
                        setUser(fetchedUser);
                        setPageState(PageState.loaded);
                    } else {
                        navigate("/home");
                    }
                } catch (error) {
                    setUser(null);
                    navigate("/");
                }
            } else {
                setUser(null);
                setPageState(PageState.loaded);
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
            if (user) {
                return (
                    <StartCasualGameView passedUser={user} />
                );
            } else {
                return (
                    <View><h1>GuestStartCasualGameView</h1></View>
                )
            }
            break;

    }
}
import { CircularProgress } from "@mui/material";
import SettingsView from "../../App/Views/Settings/SettingsView";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../Background/Models";
import { FetchService } from "../../Background/Service";
import app from "../../firebase";
import { View } from "../../ReactSwiftly";

enum PageState {
    loading,
    loaded,
}

function HomeRoute() {
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
                    setUser(fetchedUser);
                    setPageState(PageState.loaded); // Delay the loading state
                } catch (error) {
                    setUser(null);
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
            if (user) {
                return (
                    <SettingsView passedUser={user} />
                );
            } else {
                return (
                    <View>
                        <CircularProgress />
                    </View>
                )
            }
            break;

    }
}

export default HomeRoute;
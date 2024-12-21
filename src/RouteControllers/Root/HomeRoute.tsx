import { useEffect, useState } from "react";
// import { View } from "../../ReactSwiftly";
import { UserModel } from "../../Background/Models";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FetchService } from "../../Background/Service";
import app from "../../firebase";
import { useNavigate } from "react-router-dom";
// import { CircularProgress } from "@mui/material";
import HomeView from "../../App/Views/Body/HomeView";
import GuestHomeView from "../../App/GuestViews/Body/GuestHomeView";
import AppLoadingView from "../../App/Views/AppOpen/AppLoadingView";

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
                setUser(null);
                setPageState(PageState.loaded);
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
                    <HomeView passedUser={user} />
                );
            } else {
                return (
                    <GuestHomeView />
                )
            }
            break;

    }
}

export default HomeRoute;
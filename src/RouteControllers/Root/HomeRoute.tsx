import { useEffect, useState } from "react";
import { UserModel } from "../../Background/Models";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FetchService } from "../../Background/Service";
import app from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Timestamp } from "firebase/firestore";
import HomeView from "../../App/Views/Body/HomeView";
import GuestHomeView from "../../App/GuestViews/Body/GuestHomeView";
import AppLoadingView from "../../App/Views/AppOpen/AppLoadingView";
import PageNotFoundView from "../../App/Components/PageNoteFoundView";

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
                if (firebaseUser.isAnonymous) {
                    const guestUser: UserModel = {
                        id: `GUEST${firebaseUser.uid}`,
                        email: "",
                        username: "guest",
                        usernameDisplayed: "Guest",
                        standardRating: 1500,
                        timestamp: Timestamp.fromDate(new Date())
                    }

                    setUser(guestUser);
                    setPageState(PageState.loaded);
                } else {
                    try {
                        const fetchedUser = await FetchService.fetchUserByUid(firebaseUser.uid);
                        setUser(fetchedUser);
                        setPageState(PageState.loaded); // Delay the loading state
                    } catch (error) {
                        setUser(null);
                        navigate("/");
                    }
                }
            } else {
                // setUser(null);
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
                if (user.username === "guest") {
                    return (
                        <GuestHomeView />
                    );
                } else {
                    return (
                        <HomeView passedUser={user} />
                    );
                }
            } else {
                return (
                    <PageNotFoundView />
                )
            }

    }
}

export default HomeRoute;
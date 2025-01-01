import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileView from "../../App/Views/Body/ProfileView";
import { UserModel } from "../../Background/Models";
import { FetchService } from "../../Background/Service";
import app from "../../firebase";
import AppLoadingView from "../../App/Views/AppOpen/AppLoadingView";
import PageNotFoundView from "../../App/Components/PageNotFoundView";

enum PageState {
    loading,
    loaded,
}

function ProfileRoute() {
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
                    navigate("/home");
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
            if (user && user.username !== "guest") {
                return (
                    <ProfileView passedUser={user} />
                );
            } else {
                return (
                    <PageNotFoundView />
                )
            }

    }
}

export default ProfileRoute;
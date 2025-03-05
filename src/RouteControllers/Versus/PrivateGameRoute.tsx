import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../Background/Models";
import { FetchService } from "../../Background/Service";
import app from "../../firebase";
import PrivateMatchMenuView from "../../App/Views/Game2/PrivateMatch2/PrivateMatchMenuView";
import AppLoadingView from "../../App/Views/AppOpen/AppLoadingView";
import PageNotFoundView from "../../App/Components/PageNotFoundView";
import { Timestamp } from "firebase/firestore";
import VersusCrashCourse from "../../App/General/CrashCourses/Versus/VersusCrashCourse";
import { ClockFunctions } from "../../Background/Utils/ClockFunctions";

enum PageState {
    loading,
    loaded,
}

export default function PrivateGameRoute() {
    const [user, setUser] = useState<UserModel | null>(null);
    const [timeOffset, setTimeOffset] = useState<number | null>(null);
    const [pageState, setPageState] = useState<PageState>(PageState.loading);
    const navigate = useNavigate();
    const crashCoursePlayed = localStorage.getItem("versusCrashCoursePlayed");

    useEffect(() => {
        onAppearActions();
    }, []);

    async function onAppearActions() {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            const fetchedTimeOffset = await ClockFunctions.getTimeOffset();
            setTimeOffset(fetchedTimeOffset);
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
                }

            } else {
                setUser(null);
                setPageState(PageState.loaded);
            }
        });

        return () => unsubscribe();
    }

    if (!crashCoursePlayed && user) {
        return (
            <VersusCrashCourse />
        );
    }

    switch (pageState) {
        case PageState.loading:
            return (
                <AppLoadingView />
            );

        case PageState.loaded:
            if (user && timeOffset) {
                return (
                    <PrivateMatchMenuView passedUser={user} timeOffset={timeOffset} />
                );
            } else {
                <PageNotFoundView />
            }

    }
}
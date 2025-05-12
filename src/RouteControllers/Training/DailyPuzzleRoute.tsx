
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadDailyPuzzleView from "../../App/Views/DailyPuzzle/LoadDailyPuzzleView";
import { UserModel } from "../../Background/Models";
import { FetchService } from "../../Background/Service";
import app from "../../firebase";
import GuestLoadDailyPuzzleView from "../../App/GuestViews/DailyPuzzle/GuestLoadDailyPuzzleView";
import AppLoadingView from "../../App/Views/AppOpen/AppLoadingView";
import DailyPuzzleCrashCourse from "../../App/General/CrashCourses/DailyPuzzle/DailyPuzzleCrashCourse";
import { Timestamp } from "firebase/firestore";

enum PageState {
    loading,
    loaded,
}

export default function DailyPuzzleRoute() {
    const [user, setUser] = useState<UserModel | null>(null);
    const [pageState, setPageState] = useState<PageState>(PageState.loading);
    const navigate = useNavigate();
    const crashCoursePlayed = localStorage.getItem("dailyPuzzleCrashCoursePlayed");

    useEffect(() => {
        onAppearActions();
    }, []);

    async function onAppearActions() {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser && !firebaseUser.isAnonymous) {
                try {
                    const fetchedUser = await FetchService.fetchUserByUid(firebaseUser.uid);

                    if (fetchedUser.username) {
                        setUser(fetchedUser);

                    }
                    setPageState(PageState.loaded);
                } catch (error) {
                    setUser(null);
                    navigate("/");
                }
            } else if (firebaseUser && firebaseUser.isAnonymous) {
                const guestUser: UserModel = {
                    id: firebaseUser.uid,
                    email: "",
                    username: "guest",
                    usernameDisplayed: "Guest",
                    standardRating: 1500,
                    timestamp: Timestamp.now()
                };
                setUser(guestUser);
                setPageState(PageState.loaded);
            } else {
                navigate("/");
            }
        });

        return () => unsubscribe();
    }

    if (!crashCoursePlayed) {
        return (
            <DailyPuzzleCrashCourse />
        );
    }

    switch (pageState) {
        case PageState.loading:
            return (
                <AppLoadingView />
            );

        case PageState.loaded:
            if (user && user.username !== "guest") {
                return (
                    <LoadDailyPuzzleView passedUser={user} />
                );
            } else if (user && user.username == "guest") {
                return (
                    <GuestLoadDailyPuzzleView guestUser={user}/>
                )
            }

    }
}
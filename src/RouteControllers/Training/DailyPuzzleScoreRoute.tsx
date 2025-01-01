import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GuestLoadDailyPuzzleView from "../../App/GuestViews/DailyPuzzle/GuestLoadDailyPuzzleView";
import AppLoadingView from "../../App/Views/AppOpen/AppLoadingView";
import LoadDailyPuzzleView from "../../App/Views/DailyPuzzle/LoadDailyPuzzleView";
import { UserModel } from "../../Background/Models";
import { FetchService } from "../../Background/Service";
import app from "../../firebase";
import { Helmet } from "react-helmet-async";

enum PageState {
    loading,
    loaded,
}

export default function DailyPuzzleScoreRoute() {
    const { date, score } = useParams();
    const [user, setUser] = useState<UserModel | null>(null);
    const [pageState, setPageState] = useState<PageState>(PageState.loading);
    const navigate = useNavigate();

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
            } else {
                setUser(null);
                setPageState(PageState.loaded);
            }
        });

        return () => unsubscribe();
    }

    const getHelmetTitle = () => {
        if (score) {
            return `I scored ${score} on today's puzzle!`;
        }
        return "Daily Puzzle Challenge";
    };

    switch (pageState) {
        case PageState.loading:
            return (
                <>
                    <Helmet>
                        <title>Loading...</title>
                        <meta property="og:title" content="Loading Daily Puzzle..." />
                        <meta property="og:description" content="Hold tight! Your puzzle is loading." />
                    </Helmet>
                    <AppLoadingView />
                </>
            );

        case PageState.loaded:
            const title = getHelmetTitle();
            return (
                <>
                    <Helmet>
                        <title>{title}</title>
                        <meta property="og:title" content={title} />
                        <meta property="og:description" content="Can you beat my score? Try today's puzzle now!" />
                        <meta property="og:image" content="https://jumblem.com/web-app-manifest-512x512.png" />
                        <meta property="og:url" content={`https://jumblem.com/puzzle/${date}/${score}`} />
                    </Helmet>
                    {user && user.username !== "guest" ? (
                        <LoadDailyPuzzleView passedUser={user} />
                    ) : (
                        <GuestLoadDailyPuzzleView />
                    )}
                </>
            );

    }
}
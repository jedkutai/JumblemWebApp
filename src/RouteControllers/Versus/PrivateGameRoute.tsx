import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../Background/Models";
import { FetchService } from "../../Background/Service";
import app from "../../firebase";
import PrivateMatchMenuView from "../../App/Views/Game/PrivateMatch/PrivateMatchMenuView";
import AppLoadingView from "../../App/Views/AppOpen/AppLoadingView";
import PageNotFoundView from "../../App/Components/PageNotFoundView";
import { Timestamp } from "firebase/firestore";

enum PageState {
    loading,
    loaded,
}

export default function PrivateGameRoute() {
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

    switch (pageState) {
        case PageState.loading:
            return (
                <AppLoadingView />
            );

        case PageState.loaded:
            if (user) {
                return (
                    <PrivateMatchMenuView passedUser={user} />
                );
            } else {
                <PageNotFoundView />
            }

        // if (user && user.username !== "guest") {
        //     return (
        //         <PrivateMatchMenuView passedUser={user} />
        //     );
        // } else {
        //     return (
        //         <View>
        //             <VStack>
        //                 <Button onClick={() => navigate("/home")}>
        //                     <JumblemLogoSimple />
        //                 </Button>

        //                 <Typography textAlign={"center"}>Login required to play private matches.</Typography>

        //                 <HStack>
        //                     <Button variant="contained" color="secondary" onClick={() => navigate("/login")}>Login</Button>
        //                     <Button variant="contained" color="primary">Download</Button>
        //                 </HStack>
        //             </VStack>
        //         </View>
        //     )
        // }

    }
}
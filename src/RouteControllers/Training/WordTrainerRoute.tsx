import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../Background/Models";
import { View } from "../../ReactSwiftly";

enum PageState {
    loading,
    loaded,
}

export default function WordTrainerRoute() {
    const [user, setUser] = useState<UserModel | null>(null);
    const [pageState, setPageState] = useState<PageState>(PageState.loading);
    const navigate = useNavigate();

    useEffect(() => {
        // onAppearActions();
    }, []);

    // async function onAppearActions() {
    //     const auth = getAuth(app);

    //     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    //         if (firebaseUser) {
    //             try {
    //                 const fetchedUser = await FetchService.fetchUserByUid(firebaseUser.uid);

    //                 if (fetchedUser.username) {
    //                     setUser(fetchedUser);
    //                     setPageState(PageState.loaded);
    //                 } else {
    //                     navigate("/home");
    //                 }
    //             } catch (error) {
    //                 setUser(null);
    //                 navigate("/");
    //             }
    //         } else {
    //             setUser(null);
    //             setPageState(PageState.loaded);
    //         }
    //     });

    //     return () => unsubscribe();
    // }

    return (
        <View>
            <h2>Word Trainer App Store Preview</h2>
        </View>
    )
}
import { useEffect, useState } from "react";
import { UserModel } from "./Background/Models";
import { FetchService } from "./Background/Service";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "./firebase";
import AppLoadingView from "./App/Views/AppOpen/AppLoadingView";
import AppOpenView from "./App/Views/AppOpen/AppOpenView";
import HomeView from "./App/Views/Body/HomeView";

enum ContentViewPageState {
    loading,
    loaded
}

export default function ContentView() {
    const [user, setUser] = useState<UserModel | null>(null);
    const [pageState, setPageState] = useState<ContentViewPageState>(ContentViewPageState.loading);

    useEffect(() => {
        const auth = getAuth(app);
    
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const fetchedUser = await FetchService.fetchUserByUid(firebaseUser.uid);
              setTimeout(() => {
                setUser(fetchedUser);
                setPageState(ContentViewPageState.loaded); // Delay the loading state
              }, 1000); // 1-second delay
            } catch (error) {
              console.error('Failed to fetch user data:', error);
              setTimeout(() => {
                setUser(null);
                setPageState(ContentViewPageState.loaded); // Delay the loading state
              }, 1000); // 1-second delay
            }
          } else {
            setTimeout(() => {
              setUser(null);
              setPageState(ContentViewPageState.loaded); // Delay the loading state
            }, 1000); // 1-second delay
          }
        });
    
        return () => unsubscribe();
      }, []);

      
    return (
        <>
            {pageState === ContentViewPageState.loading && <AppLoadingView/>}
            {pageState === ContentViewPageState.loaded && user && <HomeView passedUser={user} />}
            {pageState === ContentViewPageState.loaded && !user && <AppOpenView/>}
        </>
    );
}
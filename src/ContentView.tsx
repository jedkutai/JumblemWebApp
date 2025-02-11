import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "./firebase";
import AppLoadingView from "./App/Views/AppOpen/AppLoadingView";
import AppOpenView from "./App/Views/AppOpen/AppOpenView";
import { useNavigate } from "react-router-dom";

enum ContentViewPageState {
  loading,
  loaded
}

export default function ContentView() {
  const [pageState, setPageState] = useState<ContentViewPageState>(ContentViewPageState.loading); // change to loading
  const navigate = useNavigate();
  
  useEffect(() => {
    onAppearActions();
  }, []);

  async function onAppearActions() {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        navigate("/home");
      } else {
        setPageState(ContentViewPageState.loaded);
      }

    });

    return () => unsubscribe();
  }

  return (
    <>
      {pageState === ContentViewPageState.loading && <AppLoadingView />}
      {pageState === ContentViewPageState.loaded && <AppOpenView />}
    </>
  );
}
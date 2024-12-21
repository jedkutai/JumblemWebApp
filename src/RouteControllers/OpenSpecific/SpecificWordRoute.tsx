import { Typography } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DictionaryWordModel, UserModel, WordModel } from "../../Background/Models";
import { FetchService } from "../../Background/Service";
import app from "../../firebase";
import { View } from "../../ReactSwiftly";
import SpecificWordView from "../../App/Views/Dictionary/SpecificWordView";
import AppLoadingView from "../../App/Views/AppOpen/AppLoadingView";

enum PageState {
    loading,
    loaded,
}

function SpecificWordRoute() {
    const { word } = useParams();
    const [user, setUser] = useState<UserModel | null>(null);
    const [wordModel, setWordModel] = useState<WordModel | null>(null);
    const [dictionaryModels, setDictionaryModels] = useState<DictionaryWordModel[] | null>(null);
    const [pageState, setPageState] = useState<PageState>(PageState.loading);
    const navigate = useNavigate();
    const googleLink = "https://www.google.com/search?q=";

    useEffect(() => {
        onAppearActions();
    }, []);

    async function onAppearActions() {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const fetchedUser = await FetchService.fetchUserByUid(firebaseUser.uid);
                    if (word) {
                        const fetchedWordModel = await FetchService.fetchWordModelByWord(word);
                        const fetchedDictionaryModels = await FetchService.fetchWordDefinition(word);
                        setWordModel(fetchedWordModel);
                        setDictionaryModels(fetchedDictionaryModels);
                        if (fetchedWordModel && !fetchedDictionaryModels) {
                            const searchUrl = `${googleLink}${word}+definition`;
                            window.open(searchUrl, "_blank");
                        }
                    }
                    setUser(fetchedUser);
                    setPageState(PageState.loaded);

                } catch (error) {
                    const searchUrl = `${googleLink}${word}+definition`;
                    window.open(searchUrl, "_blank");
                    navigate("/");
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
            if (user && wordModel && dictionaryModels) {
                return (
                    <SpecificWordView dictionaryModels={dictionaryModels} wordModel={wordModel} />
                );
            } else {
                return (
                    <View>
                        <Typography>Word not found.</Typography>
                    </View>
                )
            }
            break;

    }
}

export default SpecificWordRoute;
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DictionaryWordModel, WordModel } from "../../Background/Models";
import { FetchService } from "../../Background/Service";
import app from "../../firebase";
import SpecificWordView from "../../App/Views/Dictionary/SpecificWordView";
import AppLoadingView from "../../App/Views/AppOpen/AppLoadingView";
import PageNotFoundView from "../../App/Components/PageNotFoundView";

enum PageState {
    loading,
    loaded,
}

function SpecificWordRoute() {
    const { word } = useParams();
    // const [user, setUser] = useState<UserModel | null>(null);
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
                    // const fetchedUser = await FetchService.fetchUserByUid(firebaseUser.uid);
                    if (word) {
                        const fetchedWordModel = await FetchService.fetchWordModelByWord(word);
                        const fetchedDictionaryModels = await FetchService.fetchWordDefinition(word);
                        setWordModel(fetchedWordModel);
                        setDictionaryModels(fetchedDictionaryModels);
                        if (fetchedWordModel && !fetchedDictionaryModels) {
                            const searchUrl = `${googleLink}${word}+definition`;
                            window.location.href = searchUrl;
                            // window.open(searchUrl);
                        }
                    }
                    // setUser(fetchedUser);
                    setPageState(PageState.loaded);

                } catch (error) {
                    const searchUrl = `${googleLink}${word}+definition`;
                    window.location.href = searchUrl;
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
            if (wordModel && dictionaryModels) {
                return (
                    <SpecificWordView dictionaryModels={dictionaryModels} wordModel={wordModel} />
                );
            } else {
                return (
                    <PageNotFoundView />
                )
            }
            break;

    }
}

export default SpecificWordRoute;
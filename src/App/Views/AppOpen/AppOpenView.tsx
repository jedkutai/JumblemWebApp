import { useEffect, useState } from "react";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { View, VStack } from "../../../ReactSwiftly";
import JumblemLogo from "../../../assets/jumblem_logo.png";
import { Button } from "@mui/material";
import LoginView from "../Login/LoginView";


export default function AppOpenView() {
    const { minDimension } = useWindowSize();
    const [view, setView] = useState<"AppOpenView" | "LoginView" | "CreateAccountView" | "GuestView">("AppOpenView");

    useEffect(() => {
        
    }, []);

    const styles = {
        image: {
            maxWidth: `${minDimension / 3}px`,
            maxHeight: `${minDimension / 3}px`,
        },
    }

    switch (view) {
        case "LoginView":
            return (<LoginView onBack={() => setView("AppOpenView")}/>);
        case "CreateAccountView":
            // return (<CreateAccountView onBack={() => setView("AppOpenView")}/>);
        case "GuestView":
            // return (<View><VStack><Text text="GuestView"/><button onClick={() => setView("AppOpenView")}>Back</button></VStack></View>);
    }

    return (
        <View>
            <VStack>
                <img src={JumblemLogo} style={styles.image}/>

                <Button onClick={() => setView("LoginView")}>
                    LOGIN
                </Button>

                <Button onClick={() => setView("CreateAccountView")}>
                    CREATE ACCOUNT
                </Button>

                <Button onClick={() => setView("GuestView")}>
                    CONTINUE AS GUEST
                </Button>
            </VStack>
        </View>
    );
}
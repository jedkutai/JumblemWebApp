import { useState } from "react";
import { HStack, View, VStack } from "../../ReactSwiftly";
import { useWindowSize } from "../../Background/Utils/useWindowSize";
import JumblemLogoSimple from "../Components/JumblemLogoSimple";
import { Button, Typography } from "@mui/material";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FirstOpenHowToPlayDailyPuzzle from "./FirstOpenHowToPlayDailyPuzzle";
import FirstOpenHowToPLayVersus from "./FirstOpenHowToPlayVersus";

enum TabShown {
    intro,
    versus,
    daily
}


export default function FirstOpenController() {
    const [tabShown, setTabShown] = useState<TabShown>(TabShown.intro);
    const { height } = useWindowSize();
    const navigate = useNavigate();

    function dismiss() {
        localStorage.setItem("firstOpenSeen", "true");
        navigate("/home");
    }

    return (
        <View startAtTop={true}>
            <VStack>
                {tabShown == TabShown.intro && (
                    <>
                        <HStack>
                            <Button>
                                <FaArrowLeft size={25} style={{ color: "gray" }} />
                            </Button>

                            <Button onClick={() => setTabShown(TabShown.versus)}>
                                <FaArrowRight size={25} style={{ color: "black" }} />
                            </Button>
                        </HStack>


                        <JumblemLogoSimple />

                        <div style={{ height: `${height * 0.2}px` }}></div>

                        <Typography variant="h5" style={{ color: "black", fontWeight: "bold" }}>
                            {"How to and more!".toUpperCase()}
                        </Typography>
                    </>
                )}
                {tabShown == TabShown.versus && (
                    <>
                        <HStack>
                            <Button onClick={() => setTabShown(TabShown.intro)}>
                                <FaArrowLeft size={25} style={{ color: "black" }} />
                            </Button>

                            <Button onClick={() => setTabShown(TabShown.daily)}>
                                <FaArrowRight size={25} style={{ color: "black" }} />
                            </Button>
                        </HStack>

                        <FirstOpenHowToPLayVersus />
                    </>
                )}
                {tabShown == TabShown.daily && (
                    <>
                        <HStack>
                            <Button onClick={() => setTabShown(TabShown.versus)}>
                                <FaArrowLeft size={25} style={{ color: "black" }} />
                            </Button>

                            <Button onClick={dismiss}>
                                <FaArrowRight size={25} style={{ color: "black" }} />
                            </Button>
                        </HStack>

                        <FirstOpenHowToPlayDailyPuzzle />
                    </>
                )}
            </VStack>

        </View>
    )
}
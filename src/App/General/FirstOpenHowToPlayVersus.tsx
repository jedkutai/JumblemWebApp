import { Button, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "../../Background/Utils/useWindowSize";
import { View, VStack, HStack } from "../../ReactSwiftly";
import VersusExamlpeGrid1 from "../Components/HowTo/VersusExampleGrid1";
import VersusExamlpeGrid2 from "../Components/HowTo/VersusExampleGrid2";
import VersusExamlpeGrid3 from "../Components/HowTo/VersusExampleGrid3";
import VersusExamlpeGrid4 from "../Components/HowTo/VersusExampleGrid4";
import HowToPLaySection from "../Components/HowToPlaySection";
import JumblemLogoSimple from "../Components/JumblemLogoSimple";

enum ExampleGridShown {
    example1,
    example2,
    example3,
    example4
}

export default function FirstOpenHowToPLayVersus() {
    const [exampleGridShown, setExampleGridShown] = useState<ExampleGridShown>(ExampleGridShown.example1)
    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const navigate = useNavigate();
    return (
        <View startAtTop={true}>
            <VStack width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}>
                <Button onClick={() => navigate("/home")}>
                    <JumblemLogoSimple />
                </Button>

                <Typography variant="h5" style={{ color: "black", fontWeight: "bold" }}>
                    {"Versus".toUpperCase()}
                </Typography>


                <HowToPLaySection
                    title="Objective"
                    descriptions={["Players take turns placing letters on the board until a 4 to 7 letter word is created. The player who creates the word, wins the game."]}
                />
                <HowToPLaySection
                    title="Rules"
                    descriptions={[
                        "The first letter must be placed in the center of the board.",
                        "Each subsequent letter must be placed next to, above, or below a letter already on the board.",
                        "Words can be created horizontally, vertically, or diagonally and can be read in any direction."
                    ]}
                />

                <HStack>
                    <Button
                        style={{ color: exampleGridShown == ExampleGridShown.example1 ? "black" : "gray" }}
                        onClick={() => setExampleGridShown(ExampleGridShown.example1)}
                    >
                        #1
                    </Button>
                    <Button
                        style={{ color: exampleGridShown == ExampleGridShown.example2 ? "black" : "gray" }}
                        onClick={() => setExampleGridShown(ExampleGridShown.example2)}
                    >
                        #2
                    </Button>
                    <Button
                        style={{ color: exampleGridShown == ExampleGridShown.example3 ? "black" : "gray" }}
                        onClick={() => setExampleGridShown(ExampleGridShown.example3)}
                    >
                        #3
                    </Button>
                    <Button
                        style={{ color: exampleGridShown == ExampleGridShown.example4 ? "black" : "gray" }}
                        onClick={() => setExampleGridShown(ExampleGridShown.example4)}
                    >
                        #4
                    </Button>
                </HStack>

                {exampleGridShown == ExampleGridShown.example1 && (
                    <VersusExamlpeGrid1 />
                )}
                {exampleGridShown == ExampleGridShown.example2 && (
                    <VersusExamlpeGrid2 />
                )}
                {exampleGridShown == ExampleGridShown.example3 && (
                    <VersusExamlpeGrid3 />
                )}
                {exampleGridShown == ExampleGridShown.example4 && (
                    <VersusExamlpeGrid4 />
                )}

                <HowToPLaySection
                    title="Alternate Game Results"
                    descriptions={[
                        "If the board is filled entirely without a word being created, the game will end in a draw.",
                        "If a player’s time expires, that player will lose the game."
                    ]}
                />
                <HowToPLaySection
                    title="User Interface"
                    descriptions={[
                        "When a word is created, the word will be highlighted on the board. The word will also be shown below. Tap on the word to see its definition.",
                        "The word will be shown in a color that indicates its rarity."
                    ]}
                />
            </VStack>
        </View>
    );
}
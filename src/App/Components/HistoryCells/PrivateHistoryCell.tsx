import { Box, Typography } from "@mui/material";
import { UserModel, GameModel } from "../../../Background/Models";
import { DisplayFunctions } from "../../../Background/Utils/DisplayFunctions";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { VStack, HStack } from "../../../ReactSwiftly";
import DisplayHistoryCellInfo from "./DisplayHistoryCellInfo";

interface PrivateHistoryCellProps {
    passedUser: UserModel;
    passedGame: GameModel;
}

export default function PrivateHistoryCell({ passedGame, passedUser }: PrivateHistoryCellProps) {

    const upperBound = 650;
    const dimensionDivider = 9 * 1.75;
    const { minDimension } = useWindowSize();


    const style = {
        section: {
            borderRadius: "15px",
            border: passedGame.winner == passedUser.id ? "3px solid rgba(60, 108, 29, 0.59)" : (passedGame.winner == "draw" || passedGame.winner == "aborted") ? "3px solid rgba(0, 0, 0, 0.1)" : "3px solid rgba(233, 109, 109, 0.52)",
            padding: "20px",
            width: `${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`,
        },
    }

    return (
        <Box style={style.section}>
            <VStack>
                <Typography style={{ color: "black", fontWeight: "bolder" }}>{`Private: ${DisplayFunctions.displayGameDate(passedGame.timestamp)}`}</Typography>

                <HStack>
                    <DisplayHistoryCellInfo
                        passedUser={passedUser}
                        passedPlayerId={passedUser.id}
                        passedRating={undefined}
                        passedRatingChange={undefined}
                    />

                    <Typography style={{ color: "black" }}>vs.</Typography>

                    <DisplayHistoryCellInfo
                        passedUser={passedUser}
                        passedPlayerId={passedUser.id == passedGame.playerOneId ? passedGame.playerTwoId : passedGame.playerOneId}
                        passedRating={undefined}
                        passedRatingChange={undefined}
                    />
                </HStack>
            </VStack>
        </Box>
    );
}
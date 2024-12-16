import { useEffect, useState } from "react";
import { HStack } from "../../../ReactSwiftly";
import { UserModel } from "../../../Background/Models";
import { Typography } from "@mui/material";
import { DisplayFunctions } from "../../../Background/Utils/DisplayFunctions";
import { FetchService } from "../../../Background/Service";


interface DisplayHistoryCellInfoProps {
    passedUser: UserModel;
    passedPlayerId: string | undefined;
    passedRating: number | undefined;
    passedRatingChange: number | undefined;
}

export default function DisplayHistoryCellInfo({
    passedUser,
    passedPlayerId,
    passedRating,
    passedRatingChange
}: DisplayHistoryCellInfoProps) {
    const [otherUser, setOtherUser] = useState<UserModel | null>(null);
    useEffect(() => {
        onAppearActions();
    }, []);

    async function onAppearActions() {
        try {
            if (passedPlayerId == passedUser.id) {
                setOtherUser(passedUser);
            } else {
                if (passedPlayerId) {
                    const fetchedUser = await FetchService.fetchUserByUid(passedPlayerId);
                    setOtherUser(fetchedUser);
                }
            }
        } catch {

        }
    }

    return (
        <HStack>
            <>
                {otherUser ? (
                    <Typography>{DisplayFunctions.displayUsername(otherUser.usernameDisplayed)}</Typography>
                    // <>
                    //     {passedPlayerId == passedUser.id ? (
                    //         <Typography>You</Typography>
                    //     ) : (
                    //         <Typography>{DisplayFunctions.displayUsername(otherUser.usernameDisplayed)}</Typography>
                    //     )}

                    // </>
                ) : (
                    <Typography>N/A</Typography>
                )}

                {passedRating && passedRatingChange ? (
                    <>
                        <Typography>{passedRating}</Typography>

                        {passedRatingChange > 0 && (
                            <Typography style={{ color: "green" }}>{`+${passedRatingChange}`}</Typography>
                        )}
                        {passedRatingChange < 0 && (
                            <Typography style={{ color: "red" }}>{`${passedRatingChange}`}</Typography>
                        )}
                        {passedRatingChange == 0 && (
                            <Typography style={{ color: "black" }}>{`+0`}</Typography>
                        )}

                    </>
                ) : (
                    <></>
                )}
            </>
        </HStack>
    )

}